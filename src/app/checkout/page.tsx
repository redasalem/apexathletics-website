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
      <div className="flex min-h-screen items-center justify-center bg-lacquer-black">
        <Loader2 className="w-10 h-10 text-kinpaku-gold animate-spin" />
      </div>
    );
  }

  const items = cart?.items || [];
  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const subtotal = items.reduce((acc, item) => acc + (item.priceSnapshot * item.quantity), 0);
  const discountAmount = appliedPromo ? Math.round(subtotal * (appliedPromo.discountPercentage / 100) * 100) / 100 : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100;
  const shippingCost = 15.00;
  const totalAmount = Math.round((discountedSubtotal + tax + shippingCost) * 100) / 100;

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
        window.location.assign(session.url);
        // No need to dismiss — the page navigates away
        return;
      } else {
        throw new Error('Could not retrieve Checkout session URL');
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Checkout failed. Please try again.');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-lacquer-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
        <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-champagne mb-12 border-b border-gold-hairline pb-6 leading-none">
          Secure <span className="text-kinpaku-gold">Checkout</span>
        </h1>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            
            {/* Shipping Details Box */}
            <div className="bg-raised-lacquer p-8 border border-gold-hairline sm:rounded-[4px] shadow-panel space-y-6">
              <h2 className="font-display text-3xl uppercase tracking-wider text-champagne border-b border-gold-hairline pb-4 mb-6">Shipping <span className="text-kinpaku-gold">Information</span></h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input {...form.register('firstName')} className="input-field" placeholder="John" />
                  {form.formState.errors.firstName && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input {...form.register('lastName')} className="input-field" placeholder="Doe" />
                  {form.formState.errors.lastName && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" {...form.register('email')} className="input-field" placeholder="john@example.com" />
                  {form.formState.errors.email && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" {...form.register('phone')} className="input-field" placeholder="+1 (555) 000-0000" />
                  {form.formState.errors.phone && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="label">Street Address</label>
                <input {...form.register('shippingAddress.street')} className="input-field" placeholder="123 Main St" />
                {form.formState.errors.shippingAddress?.street && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.shippingAddress.street.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">City</label>
                  <input {...form.register('shippingAddress.city')} className="input-field" placeholder="New York" />
                  {form.formState.errors.shippingAddress?.city && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.shippingAddress.city.message}</p>}
                </div>
                <div>
                  <label className="label">ZIP Code</label>
                  <input {...form.register('shippingAddress.zip')} className="input-field" placeholder="10001" />
                  {form.formState.errors.shippingAddress?.zip && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.shippingAddress.zip.message}</p>}
                </div>
                <div>
                  <label className="label">Country</label>
                  <select {...form.register('shippingAddress.country')} className="input-field">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                  {form.formState.errors.shippingAddress?.country && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.shippingAddress.country.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method MVP Simulation */}
            <div className="bg-raised-lacquer p-8 border border-gold-hairline sm:rounded-[4px] shadow-panel space-y-6">
              <h2 className="font-display text-3xl uppercase tracking-wider text-champagne border-b border-gold-hairline pb-4 mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-kinpaku-gold" /> Payment <span className="text-kinpaku-gold ml-1">Details</span>
              </h2>
              <p className="text-[0.85rem] font-mono uppercase tracking-[0.1em] text-kinpaku-gold flex items-center gap-2 mb-6">
                <ShieldCheck className="w-4 h-4" /> Secure encrypted checkout pipeline
              </p>

              <div className="space-y-4">
                <label className="flex items-center space-x-4 cursor-pointer p-5 border border-gold-hairline rounded-[2px] hover:border-kinpaku-gold transition-colors bg-lacquer-deep">
                  <input type="radio" value="Credit Card" {...form.register('paymentMethod')} className="w-4 h-4 accent-kinpaku-gold" />
                  <span className="font-medium text-champagne text-[1.05rem]">Credit Card (Simulated)</span>
                </label>

                <label className="flex items-center space-x-4 cursor-pointer p-5 border border-gold-hairline rounded-[2px] hover:border-kinpaku-gold transition-colors bg-lacquer-deep">
                  <input type="radio" value="PayPal" {...form.register('paymentMethod')} className="w-4 h-4 accent-kinpaku-gold" />
                  <span className="font-medium text-champagne text-[1.05rem]">PayPal</span>
                </label>
                {form.formState.errors.paymentMethod && <p className="text-red-500 text-sm mt-1.5 font-medium">{form.formState.errors.paymentMethod.message}</p>}
              </div>

              {/* Card details are collected securely by Stripe Checkout after order creation. */}
              <div className="border-t border-gold-hairline pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50 pointer-events-none">
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
            <div className="bg-raised-lacquer border border-gold-hairline sm:rounded-[4px] shadow-panel p-8 sticky top-8">
              <h2 className="font-display text-3xl uppercase tracking-wider text-champagne border-b border-gold-hairline pb-4 mb-6">Your <span className="text-kinpaku-gold">Order</span></h2>
              
              <ul className="space-y-4 mb-6 border-b border-gold-hairline pb-6 overflow-y-auto max-h-64">
                {items.map((item) => (
                  <li key={item._id} className="flex justify-between">
                    <div className="flex text-[0.95rem] text-text-muted overflow-hidden pr-4">
                      <span className="font-mono text-champagne min-w-6 mr-2">{item.quantity}x</span>
                      <span className="truncate">{item.productId?.title}</span>
                    </div>
                    <span className="text-champagne font-mono ml-4">${(item.priceSnapshot * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-3 text-[0.95rem] text-text-muted mt-4">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-champagne font-mono">${subtotal.toFixed(2)}</dd>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-kinpaku-gold font-medium">
                    <dt>Discount ({appliedPromo.discountPercentage}%)</dt>
                    <dd className="font-mono">-${discountAmount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="text-champagne font-mono">${shippingCost.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd className="text-champagne font-mono">${tax.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-gold-hairline pt-6 text-[1.25rem] font-medium text-champagne mt-6">
                  <dt className="font-display text-2xl uppercase tracking-widest">Total</dt>
                  <dd className="text-kinpaku-gold font-mono">${totalAmount.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-8 pt-8 border-t border-gold-hairline">
                <label className="ks-section-eyebrow mb-3 block">Have a promo code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="ENTER CODE"
                    className="flex-1 input-field py-2 uppercase !mt-0 font-mono"
                    disabled={!!appliedPromo}
                  />
                  {!appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={validateCoupon.isPending || !promoCodeInput}
                      className="ks-button ks-button-secondary px-6"
                    >
                      {validateCoupon.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setAppliedPromo(null); setPromoCodeInput(''); }}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2 rounded-[2px] font-medium transition-colors border border-red-500/50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={form.formState.isSubmitting || createOrder.isPending || checkoutSession.isPending}
                className="ks-button ks-button-primary w-full mt-8 py-4 text-[1.18rem] justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                {(createOrder.isPending || checkoutSession.isPending) ? <Loader2 className="w-6 h-6 animate-spin text-lacquer-deep mx-auto" /> : `Pay $${totalAmount.toFixed(2)}`}
              </button>
              <p className="text-[0.75rem] font-mono text-center text-text-muted mt-6 uppercase tracking-[0.1em] leading-relaxed">
                By placing your order, you agree to our<br/><span className="text-champagne">Terms of Sale and Privacy Policy</span>.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
