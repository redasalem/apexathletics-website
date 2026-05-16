'use client';

import { useParams } from 'next/navigation';
import { useCustomerOrder } from '@/hooks/useOrders';
import { CheckCircle2, ChevronRight, ShoppingBag, Truck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useCustomerOrder(id);

  if (isLoading) return <div className="h-screen flex items-center justify-center text-textMuted animate-pulse">Confirming transaction...</div>;
  if (isError || !order) return <div className="h-screen flex items-center justify-center text-error">Receipt could not be loaded. Please check your Orders page.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-surface border border-border rounded-xl p-8 md:p-12 text-center shadow-lg">
        <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-white tracking-tight">You&apos;re All Set!</h1>
        <p className="text-lg text-textMuted mt-2">Your order is confirmed. Time to get ready to perform.</p>
        
        <div className="bg-surfaceHighlight inline-block px-6 py-3 rounded-md mt-6 border border-border mb-12">
          <p className="text-sm text-textMuted font-medium uppercase tracking-wider mb-1">Order Confirmation Number</p>
          <p className="text-xl font-mono text-primary-500 font-bold">{order._id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
          {/* Shipping Node */}
          <div className="bg-background border border-border p-6 rounded-lg space-y-4">
            <h3 className="flex items-center text-lg font-semibold text-white border-b border-border pb-3">
              <Truck className="w-5 h-5 mr-2 text-primary-500" /> Delivery Target
            </h3>
            <div className="flex items-start text-textMuted text-sm leading-relaxed">
              <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
              <p>
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.zip}<br />
                {order.shippingAddress.country}
              </p>
            </div>
            <div className="pt-2 border-t border-border mt-4">
              <p className="text-sm font-medium text-textMuted">Status: <span className="text-white capitalize">{order.globalOrderStatus}</span></p>
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="bg-background border border-border p-6 rounded-lg space-y-4">
            <h3 className="flex items-center text-lg font-semibold text-white border-b border-border pb-3">
              <ShoppingBag className="w-5 h-5 mr-2 text-primary-500" /> Order Summary
            </h3>
            <ul className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-textMuted truncate mr-4">{item.quantity}x {item.productId?.title || 'Product'}</span>
                  <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 flex justify-between font-bold text-lg text-white">
              <span>Total Paid</span>
              <span className="text-primary-500">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/account/orders/${order._id}`} className="btn-primary w-full sm:w-auto px-8 py-3">
            Track Order Status
          </Link>
          <Link href="/" className="btn-secondary w-full sm:w-auto px-8 py-3 font-semibold group flex items-center justify-center">
            Continue Shopping <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
}
