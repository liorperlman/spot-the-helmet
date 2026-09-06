import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByText(/Spot the Helmet/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders the upload section', () => {
    render(<App />);
    const uploadSection = screen.getByText(/Upload Image/i);
    expect(uploadSection).toBeInTheDocument();
  });

  test('initially does not show results section', () => {
    render(<App />);
    const resultsSection = screen.queryByText(/Detection Results/i);
    expect(resultsSection).not.toBeInTheDocument();
  });
});
