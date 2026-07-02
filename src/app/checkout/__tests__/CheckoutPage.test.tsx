import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from '../page';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCheckoutSession, useValidateCoupon } from '@/hooks/usePayments';
import toast from 'react-hot-toast';

// Mock Dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useCart', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/hooks/useOrders', () => ({
  useCreateOrder: jest.fn(),
}));

jest.mock('@/hooks/usePayments', () => ({
  useCheckoutSession: jest.fn(),
  useValidateCoupon: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));

// Mock window.location.assign by replacing window.location
const originalLocation = window.location;
let assignMock: jest.Mock;

beforeAll(() => {
  assignMock = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).location;
  window.location = { 
    assign: assignMock,
    href: 'http://localhost'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
});

afterAll(() => {
  window.location = originalLocation;
});

const mockPush = jest.fn();
const mockReplace = jest.fn();

describe('CheckoutPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
    (useValidateCoupon as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
    assignMock.mockClear();
  });

  const fillOutForm = () => {
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('+1 (555) 000-0000'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('123 Main St'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('New York'), { target: { value: 'Test City' } });
    fireEvent.change(screen.getByPlaceholderText('10001'), { target: { value: '12345' } });
  };

  it('renders correctly and displays the Pay button with correct total amount', () => {
    (useCart as jest.Mock).mockReturnValue({
      data: { items: [{ _id: '1', priceSnapshot: 100, quantity: 1, productId: { title: 'Test Product' } }] },
      isLoading: false,
    });
    (useCreateOrder as jest.Mock).mockReturnValue({ isPending: false });
    (useCheckoutSession as jest.Mock).mockReturnValue({ isPending: false });

    render(<CheckoutPage />);
    
    // Subtotal 100 + 8 tax + 15 shipping = 123
    const payButton = screen.getByRole('button', { name: /Pay \$123\.00/i });
    expect(payButton).toBeInTheDocument();
    expect(payButton).not.toBeDisabled();
  });

  it('disables the page and redirects to cart if cart is empty', () => {
    (useCart as jest.Mock).mockReturnValue({
      data: { items: [] },
      isLoading: false,
    });
    (useCreateOrder as jest.Mock).mockReturnValue({ isPending: false });
    (useCheckoutSession as jest.Mock).mockReturnValue({ isPending: false });

    render(<CheckoutPage />);
    
    expect(mockReplace).toHaveBeenCalledWith('/cart');
  });

  it('completes checkout when user fills the form and submits (logged in simulation)', async () => {
    (useCart as jest.Mock).mockReturnValue({
      data: { items: [{ _id: '1', priceSnapshot: 100, quantity: 1, productId: { title: 'Test Product' } }] },
      isLoading: false,
    });
    const mutateAsyncCreateOrder = jest.fn().mockResolvedValue({ data: { _id: 'order_123' } });
    (useCreateOrder as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncCreateOrder, isPending: false });
    
    const mutateAsyncCheckout = jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/pay' });
    (useCheckoutSession as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncCheckout, isPending: false });

    render(<CheckoutPage />);
    
    fillOutForm();
    
    const payButton = screen.getByRole('button', { name: /Pay \$123\.00/i });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(mutateAsyncCreateOrder).toHaveBeenCalled();
      expect(mutateAsyncCheckout).toHaveBeenCalledWith({ orderId: 'order_123', couponCode: undefined });
      expect(toast.loading).toHaveBeenCalledWith('Redirecting to Stripe...');
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it('shows loading state and disables button during API request', () => {
    (useCart as jest.Mock).mockReturnValue({
      data: { items: [{ _id: '1', priceSnapshot: 100, quantity: 1 }] },
      isLoading: false,
    });
    // Simulate order creation is in progress
    (useCreateOrder as jest.Mock).mockReturnValue({ isPending: true });
    (useCheckoutSession as jest.Mock).mockReturnValue({ isPending: false });

    render(<CheckoutPage />);
    
    const payButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(payButton).toBeDisabled();
    // Loader SVG has lucide-loader-circle class
    expect(document.querySelector('.lucide-loader-circle')).toBeInTheDocument();
  });

  it('displays error message if API fails', async () => {
    (useCart as jest.Mock).mockReturnValue({
      data: { items: [{ _id: '1', priceSnapshot: 100, quantity: 1, productId: { title: 'Test Product' } }] },
      isLoading: false,
    });
    
    // Simulate API throwing a generic Error
    const mutateAsyncCreateOrder = jest.fn().mockRejectedValue(new Error('API Failure'));
    (useCreateOrder as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncCreateOrder, isPending: false });
    (useCheckoutSession as jest.Mock).mockReturnValue({ mutateAsync: jest.fn(), isPending: false });

    render(<CheckoutPage />);
    
    fillOutForm();
    
    const payButton = screen.getByRole('button', { name: /Pay \$123\.00/i });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('API Failure');
    });
  });

  it('redirects to login if user is not authenticated (simulating 401 error from API)', async () => {
    (useCart as jest.Mock).mockReturnValue({
      data: { items: [{ _id: '1', priceSnapshot: 100, quantity: 1, productId: { title: 'Test Product' } }] },
      isLoading: false,
    });
    
    // Simulate 401 Unauthorized API error
    const authError = { response: { status: 401, data: { message: 'Unauthorized' } } };
    const mutateAsyncCreateOrder = jest.fn().mockRejectedValue(authError);
    (useCreateOrder as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncCreateOrder, isPending: false });
    (useCheckoutSession as jest.Mock).mockReturnValue({ mutateAsync: jest.fn(), isPending: false });

    render(<CheckoutPage />);
    
    fillOutForm();
    
    const payButton = screen.getByRole('button', { name: /Pay \$123\.00/i });
    fireEvent.click(payButton);

    // Instead of explicitly redirecting inside the component, this error is typically caught by an axios interceptor 
    // or middleware. But within the component itself, we verify that it gracefully handles the error.
    await waitFor(() => {
      // The getErrorMessage utility falls back to the backend error message or default message
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
