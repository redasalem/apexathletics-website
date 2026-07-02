import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SearchBar Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders correctly', () => {
    render(<SearchBar />);
    const inputElement = screen.getByPlaceholderText(/Search products, gear, athletes.../i);
    expect(inputElement).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<SearchBar />);
    const inputElement = screen.getByPlaceholderText(/Search products, gear, athletes.../i) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'shoes' } });
    expect(inputElement.value).toBe('shoes');
  });

  it('navigates to search page on submit with valid query', () => {
    render(<SearchBar />);
    const inputElement = screen.getByPlaceholderText(/Search products, gear, athletes.../i);
    
    // Type in the search box
    fireEvent.change(inputElement, { target: { value: 'shoes' } });
    
    // Submit the form
    const formElement = inputElement.closest('form');
    fireEvent.submit(formElement!);
    
    expect(mockPush).toHaveBeenCalledWith('/search?q=shoes');
  });

  it('does not navigate if query is less than 2 characters', () => {
    render(<SearchBar />);
    const inputElement = screen.getByPlaceholderText(/Search products, gear, athletes.../i);
    
    fireEvent.change(inputElement, { target: { value: 's' } });
    
    const formElement = inputElement.closest('form');
    fireEvent.submit(formElement!);
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows clear button only when there is input and clears input when clicked', () => {
    render(<SearchBar />);
    const inputElement = screen.getByPlaceholderText(/Search products, gear, athletes.../i) as HTMLInputElement;
    
    // Clear button should not be present initially
    let clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
    
    // Type something
    fireEvent.change(inputElement, { target: { value: 'shoes' } });
    
    // Clear button should now be present
    clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
    
    // Click clear button
    fireEvent.click(clearButton);
    expect(inputElement.value).toBe('');
    
    // Clear button should be gone again
    clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });
});
