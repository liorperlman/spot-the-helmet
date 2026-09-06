import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ImageUploader from './ImageUploader';

jest.mock('axios');

describe('ImageUploader Component', () => {
  const mockOnUploadComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders upload section', () => {
    render(<ImageUploader onUploadComplete={mockOnUploadComplete} />);
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
  });

  test('shows file input', () => {
    render(<ImageUploader onUploadComplete={mockOnUploadComplete} />);
    const fileInput = screen.getByLabelText(/click to select/i);
    expect(fileInput).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    render(<ImageUploader onUploadComplete={mockOnUploadComplete} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/click to select/i);

    await userEvent.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
  });

  test('handles successful upload', async () => {
    const mockResponse = {
      data: {
        total_detections: 2,
        helmet_count: 1,
        no_helmet_count: 1,
        detections: [
          { label: 'helmet', confidence: 0.95 },
          { label: 'no_helmet', confidence: 0.85 }
        ]
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(<ImageUploader onUploadComplete={mockOnUploadComplete} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/click to select/i);
    await userEvent.upload(input, file);

    const uploadButton = screen.getByText(/Analyze Image/i);
    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalled();
    });
  });

  test('handles upload error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Upload failed'));

    render(<ImageUploader onUploadComplete={mockOnUploadComplete} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/click to select/i);
    await userEvent.upload(input, file);

    const uploadButton = screen.getByText(/Analyze Image/i);
    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
    });
  });
});
