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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.priceSnapshot * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% placeholder tax
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-16 text-center">
          <ShoppingBag className="w-16 h-16 text-textMuted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-textMuted mb-8 max-w-xs mx-auto">Looks like you haven&apos;t added any gear yet. Find your next favourite piece.</p>
          <Link href="/" className="btn-primary px-8 py-3 text-base">Browse Collection <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item._id} className="flex py-6">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border bg-surfaceHighlight">
                    <OptimizedImage
                      src={item.productId?.images?.[0] || ''}
                      alt={item.productId?.title || 'Product item'}
                      fallback={getCategoryImage(item.productId?.category || '')}
                      type="product"
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-white">
                        <h3><Link href={`/product/${item.productId?._id}`}>{item.productId?.title || 'Unknown Product'}</Link></h3>
                        <p className="ml-4">${(item.priceSnapshot * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-textMuted">
                        {item.selectedSize && `Size: ${item.selectedSize}`} 
                        {item.selectedSize && item.selectedColor && ' | '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-border rounded-md bg-surfaceHighlight">
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                          disabled={updateCartItem.isPending || item.quantity <= 1}
                          className="p-2 text-textMuted hover:text-white disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-white">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                          disabled={updateCartItem.isPending}
                          className="p-2 text-textMuted hover:text-white disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={removeCartItem.isPending}
                        aria-label={`Remove ${item.productId?.title || 'item'} from cart`}
                        className="font-medium text-error hover:text-error/80 flex items-center min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-surface border border-border rounded-xl p-6 sticky top-8">
              <h2 className="text-lg font-medium text-white mb-4">Order Summary</h2>
              <div className="flow-root">
                <dl className="space-y-4 text-sm text-textMuted">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="text-white">${subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Tax (8% Est.)</dt>
                    <dd className="text-white">${tax.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="text-success font-medium">Calculated at checkout</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4 text-base font-medium text-white">
                    <dt>Total</dt>
                    <dd className="text-primary-500">${total.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <input type="text" placeholder="Promo code" className="input-field flex-1" />
                <button className="btn-secondary whitespace-nowrap">Apply</button>
              </div>

              <div className="mt-6">
                <Link href="/checkout" className="btn-primary w-full text-lg py-3.5">
                  Proceed to Checkout
                </Link>
                <p className="text-xs text-center text-textMuted mt-3">🔒 Secure checkout &nbsp;·&nbsp; 30-day returns</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
