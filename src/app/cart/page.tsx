'use client';

import Link from 'next/link';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCategoryImage } from '@/utils/images';
import OptimizedImage from '@/components/OptimizedImage';
import { getErrorMessage } from '@/utils/errors';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const handleUpdateQuantity = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await updateCartItem.mutateAsync({ itemId, quantity: newQty });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to update quantity'));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem.mutateAsync(itemId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-lacquer-black">
        <Loader2 className="w-10 h-10 text-kinpaku-gold animate-spin" />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.priceSnapshot * item.quantity), 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% placeholder tax
  const total = Math.round((subtotal + tax) * 100) / 100;

  return (
    <div className="bg-lacquer-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
        <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-champagne mb-12 border-b border-gold-hairline pb-6 leading-none">
          Shopping <span className="text-kinpaku-gold">Cart</span>
        </h1>

        {items.length === 0 ? (
          <div className="empty-state mt-10">
            <div className="empty-state-icon">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="empty-state-title">Your cart is empty</h2>
            <p className="empty-state-desc mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added any gear yet. Find your next piece.</p>
            <Link href="/shop" className="ks-button ks-button-primary inline-flex items-center gap-3">
              Browse Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              <ul className="divide-y divide-gold-hairline border-y border-gold-hairline">
                {items.map((item) => (
                  <li key={item._id} className="flex py-8">
                    <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-[2px] border border-gold-hairline bg-lacquer-deep">
                      <OptimizedImage
                        src={item.productId?.images?.[0] || ''}
                        alt={item.productId?.title || 'Product item'}
                        fallback={getCategoryImage(item.productId?.category || '')}
                        type="product"
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-xl font-display uppercase tracking-wider text-champagne">
                          <h3><Link href={`/product/${item.productId?._id}`} className="hover:text-kinpaku-gold transition-colors">{item.productId?.title || 'Unknown Product'}</Link></h3>
                          <p className="ml-4 text-kinpaku-gold font-mono">${(item.priceSnapshot * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-2 text-[0.8rem] font-mono text-text-muted uppercase tracking-[0.1em]">
                          {item.selectedSize && `Size: ${item.selectedSize}`} 
                          {item.selectedSize && item.selectedColor && ' | '}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm mt-4">
                        <div className="flex items-center gap-1 bg-lacquer-deep border border-gold-hairline w-fit rounded-[2px] overflow-hidden">
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                            disabled={updateCartItem.isPending || item.quantity <= 1}
                            className="px-3 py-1.5 text-text-muted hover:text-champagne transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-mono font-medium text-champagne w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                            disabled={updateCartItem.isPending}
                            className="px-3 py-1.5 text-text-muted hover:text-champagne transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={removeCartItem.isPending}
                          aria-label={`Remove ${item.productId?.title || 'item'} from cart`}
                          className="font-mono text-[0.8rem] uppercase tracking-[0.1em] text-red-500 hover:text-red-400 transition-colors flex items-center min-h-[44px] min-w-[44px]"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-raised-lacquer border border-gold-hairline sm:rounded-[4px] p-8 shadow-panel sticky top-8">
                <h2 className="font-display text-3xl uppercase tracking-wider text-champagne mb-8 pb-4 border-b border-gold-hairline">Order <span className="text-kinpaku-gold">Summary</span></h2>
                <div className="flow-root">
                  <dl className="space-y-4 text-[0.95rem] text-text-muted">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd className="text-champagne font-mono">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Tax (8% Est.)</dt>
                      <dd className="text-champagne font-mono">${tax.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd className="text-kinpaku-gold font-medium">Calculated at checkout</dd>
                    </div>
                    <div className="flex justify-between border-t border-gold-hairline pt-6 text-[1.25rem] font-medium text-champagne mt-6">
                      <dt className="uppercase tracking-widest font-display text-2xl">Total</dt>
                      <dd className="text-kinpaku-gold font-mono">${total.toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <input type="text" placeholder="Promo code" className="input-field flex-1 !mt-0" />
                  <button type="button" onClick={() => toast('Promo codes can be applied at checkout!', { icon: '💡' })} className="ks-button ks-button-secondary whitespace-nowrap">Apply</button>
                </div>

                <div className="mt-8">
                  <Link href="/checkout" className="ks-button ks-button-primary w-full text-[1.18rem] justify-center">
                    Proceed to Checkout
                  </Link>
                  <p className="text-[0.75rem] font-mono text-center text-text-muted mt-4 uppercase tracking-[0.1em]">🔒 Secure checkout &nbsp;·&nbsp; 30-day returns</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
