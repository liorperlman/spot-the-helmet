import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App Integration', () => {
  const mockResults = {
    total_detections: 2,
    helmet_count: 1,
    no_helmet_count: 1,
    detections: [
      { label: 'helmet', confidence: 0.95 },
      { label: 'no_helmet', confidence: 0.85 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete flow from upload to results display', async () => {
    axios.post.mockResolvedValueOnce({ data: mockResults });

    render(<App />);

    // Upload image
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/click to select/i);
    await userEvent.upload(input, file);

    // Click analyze button
    const uploadButton = screen.getByText(/Analyze Image/i);
    await userEvent.click(uploadButton);

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText(/Detection Results/i)).toBeInTheDocument();
    });

    // Verify results are displayed correctly
    expect(screen.getByText('2')).toBeInTheDocument(); // total
    expect(screen.getAllByText('1')).toHaveLength(2); // with helmet + without helmet
  });

  test('handles upload error gracefully', async () => {
    axios.post.mockRejectedValueOnce(new Error('Upload failed'));

    render(<App />);

    // Upload image
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/click to select/i);
    await userEvent.upload(input, file);

    // Click analyze button
    const uploadButton = screen.getByText(/Analyze Image/i);
    await userEvent.click(uploadButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
    });

    // Verify results section is not shown
    expect(screen.queryByText(/Detection Results/i)).not.toBeInTheDocument();
  });
});
