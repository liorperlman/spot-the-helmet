import { render, screen } from '@testing-library/react';
import ResultViewer from './ResultViewer';

describe('ResultViewer Component', () => {
  const mockResults = {
    total_detections: 2,
    helmet_count: 1,
    no_helmet_count: 1,
    detections: [
      { label: 'helmet', confidence: 0.95 },
      { label: 'no_helmet', confidence: 0.85 }
    ]
  };

  test('does not render when no results', () => {
    render(<ResultViewer previewUrl="" results={null} />);
    expect(screen.queryByText(/Detection Results/i)).not.toBeInTheDocument();
  });

  test('renders results when data is provided', () => {
    render(<ResultViewer previewUrl="test.jpg" results={mockResults} />);

    expect(screen.getByText(/Detection Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Total/i)).toBeInTheDocument();
    expect(screen.getByText(/With Helmet/i)).toBeInTheDocument();
    expect(screen.getByText(/Without Helmet/i)).toBeInTheDocument();
  });

  test('displays correct detection counts', () => {
    render(<ResultViewer previewUrl="test.jpg" results={mockResults} />);

    expect(screen.getByText('2')).toBeInTheDocument(); // total
    expect(screen.getAllByText('1')).toHaveLength(2); // with helmet + without helmet
  });

  test('displays detection details', () => {
    render(<ResultViewer previewUrl="test.jpg" results={mockResults} />);

    expect(screen.getByText('helmet')).toBeInTheDocument();
    expect(screen.getByText('no_helmet')).toBeInTheDocument();
    expect(screen.getByText(/95%/i)).toBeInTheDocument();
    expect(screen.getByText(/85%/i)).toBeInTheDocument();
  });
});
