'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCheckoutSession, useValidateCoupon } from '@/hooks/usePayments';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  shippingAddress: z.object({
    street: z.string().min(4, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    zip: z.string().min(4, 'ZIP code is required'),
    country: z.string().min(2, 'Country is required'),
  }),
  paymentMethod: z.enum(['Credit Card', 'PayPal']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const createOrder = useCreateOrder();
  const checkoutSession = useCheckoutSession();
  const validateCoupon = useValidateCoupon();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercentage: number } | null>(null);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    try {
      const res = await validateCoupon.mutateAsync(promoCodeInput);
      setAppliedPromo(res);
      toast.success(`Promo code applied: ${res.discountPercentage}% off!`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Invalid promo code'));
    }
  };

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '',
      shippingAddress: { street: '', city: '', zip: '', country: 'US' },
      paymentMethod: 'Credit Card',
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  const items = cart?.items || [];
  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const subtotal = items.reduce((acc, item) => acc + (item.priceSnapshot * item.quantity), 0);
  const discountAmount = appliedPromo ? subtotal * (appliedPromo.discountPercentage / 100) : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08;
  const shippingCost = 15.00;
  const totalAmount = discountedSubtotal + tax + shippingCost;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const orderData = {
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        contact: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
      };
      
      const res = await createOrder.mutateAsync(orderData);
      const responseBody = res?.data?.data || res?.data || res;
      const orderId = responseBody?._id;
      
      if (!orderId) {
        throw new Error('Failed to create order — no order ID returned');
      }
      
      const session = await checkoutSession.mutateAsync({ orderId, couponCode: appliedPromo?.code });
      
      if (session?.url) {
        toast.loading('Redirecting to Stripe...');
        window.location.href = session.url;
      } else {
        throw new Error('Could not retrieve Checkout session URL');
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Checkout failed. Please try again.');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Checkout</h1>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Shipping Details Box */}
          <div className="bg-surface p-8 border border-border rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-white">Shipping Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input {...form.register('firstName')} className="input-field" placeholder="John" />
                {form.formState.errors.firstName && <p className="text-error text-xs mt-1">{form.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <label className="label">Last Name</label>
                <input {...form.register('lastName')} className="input-field" placeholder="Doe" />
                {form.formState.errors.lastName && <p className="text-error text-xs mt-1">{form.formState.errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Email Address</label>
                <input type="email" {...form.register('email')} className="input-field" placeholder="john@example.com" />
                {form.formState.errors.email && <p className="text-error text-xs mt-1">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" {...form.register('phone')} className="input-field" placeholder="+1 (555) 000-0000" />
                {form.formState.errors.phone && <p className="text-error text-xs mt-1">{form.formState.errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Street Address</label>
              <input {...form.register('shippingAddress.street')} className="input-field" placeholder="123 Main St" />
              {form.formState.errors.shippingAddress?.street && <p className="text-error text-xs mt-1">{form.formState.errors.shippingAddress.street.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">City</label>
                <input {...form.register('shippingAddress.city')} className="input-field" placeholder="New York" />
                {form.formState.errors.shippingAddress?.city && <p className="text-error text-xs mt-1">{form.formState.errors.shippingAddress.city.message}</p>}
              </div>
              <div>
                <label className="label">ZIP / Postal Code</label>
                <input {...form.register('shippingAddress.zip')} className="input-field" placeholder="10001" />
                {form.formState.errors.shippingAddress?.zip && <p className="text-error text-xs mt-1">{form.formState.errors.shippingAddress.zip.message}</p>}
              </div>
              <div>
                <label className="label">Country</label>
                <select {...form.register('shippingAddress.country')} className="input-field">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
                {form.formState.errors.shippingAddress?.country && <p className="text-error text-xs mt-1">{form.formState.errors.shippingAddress.country.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method MVP Simulation */}
          <div className="bg-surface p-8 border border-border rounded-xl space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" /> Payment Details
            </h2>
            <p className="text-sm text-textMuted flex items-center gap-1 mb-4">
              <ShieldCheck className="w-4 h-4 text-success" /> Secure encrypted checkout pipeline
            </p>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer p-4 border border-border rounded-lg hover:border-primary-500 transition-colors bg-surfaceHighlight">
                <input type="radio" value="Credit Card" {...form.register('paymentMethod')} className="w-4 h-4 accent-primary-500" />
                <span className="font-medium text-white">Credit Card (Simulated)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer p-4 border border-border rounded-lg hover:border-primary-500 transition-colors bg-surfaceHighlight">
                <input type="radio" value="PayPal" {...form.register('paymentMethod')} className="w-4 h-4 accent-primary-500" />
                <span className="font-medium text-white">PayPal</span>
              </label>
              {form.formState.errors.paymentMethod && <p className="text-error text-xs">{form.formState.errors.paymentMethod.message}</p>}
            </div>

            {/* Card details are collected securely by Stripe Checkout after order creation. */}
            <div className="border-t border-border pt-6 mt-6 grid grid-cols-2 gap-4 opacity-50 pointer-events-none">
              <div className="col-span-2">
                <label className="label">Card Number</label>
                <input disabled className="input-field" placeholder="**** **** **** ****" />
              </div>
              <div>
                <label className="label">Expiry (MM/YY)</label>
                <input disabled className="input-field" placeholder="12/25" />
              </div>
              <div>
                <label className="label">CVC</label>
                <input disabled className="input-field" placeholder="123" />
              </div>
            </div>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-surface border border-border rounded-xl p-6 sticky top-8">
            <h2 className="text-lg font-medium text-white mb-6">Your Order</h2>
            
            <ul className="space-y-4 mb-6 border-b border-border pb-6 overflow-y-auto max-h-64">
              {items.map((item) => (
                <li key={item._id} className="flex justify-between">
                  <div className="flex text-sm text-textMuted overflow-hidden pr-2">
                    <span className="font-medium text-white min-w-4 mr-2">{item.quantity}x</span>
                    <span className="truncate">{item.productId?.title}</span>
                  </div>
                  <span className="text-white ml-4">${(item.priceSnapshot * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <dl className="space-y-3 text-sm text-textMuted mt-4">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-white">${subtotal.toFixed(2)}</dd>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-success font-bold">
                  <dt>Discount ({appliedPromo.discountPercentage}%)</dt>
                  <dd>-${discountAmount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-white">${shippingCost.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Taxes</dt>
                <dd className="text-white">${tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-base font-bold text-white">
                <dt>Total</dt>
                <dd className="text-primary-500">${totalAmount.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6 pt-6 border-t border-border">
              <label className="text-xs font-bold text-textMuted uppercase tracking-wider mb-2 block">Have a promo code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 input-field py-2 uppercase"
                  disabled={!!appliedPromo}
                />
                {!appliedPromo ? (
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={validateCoupon.isPending || !promoCodeInput}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    {validateCoupon.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setAppliedPromo(null); setPromoCodeInput(''); }}
                    className="bg-error/20 hover:bg-error/30 text-error px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={form.formState.isSubmitting || createOrder.isPending}
              className="btn-primary w-full mt-6 py-4 text-lg shadow-[0_0_15px_rgba(214,0,0,0.3)] hover:shadow-[0_0_25px_rgba(214,0,0,0.5)] transition-shadow"
            >
              {createOrder.isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : `Pay $${totalAmount.toFixed(2)}`}
            </button>
            <p className="text-xs text-center text-textMuted mt-4">
              By placing your order, you agree to our Terms of Sale and Privacy Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
