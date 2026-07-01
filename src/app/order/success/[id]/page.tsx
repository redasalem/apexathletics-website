'use client';

import { useParams } from 'next/navigation';
import { useCustomerOrder } from '@/hooks/useOrders';
import { CheckCircle2, ChevronRight, ShoppingBag, Truck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useCustomerOrder(id);

  if (isLoading) return <div className="min-h-[80vh] flex items-center justify-center text-text-muted font-mono uppercase tracking-[0.22em] text-[0.8rem] animate-pulse bg-lacquer-black">Confirming transaction...</div>;
  if (isError || !order) return <div className="min-h-[80vh] flex items-center justify-center text-red-500 font-medium bg-lacquer-black">Receipt could not be loaded. Please check your Orders page.</div>;

  return (
    <div className="bg-lacquer-black min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        <div className="bg-raised-lacquer border border-gold-hairline sm:rounded-[4px] p-8 md:p-16 text-center shadow-panel">
          <div className="inline-block p-4 border border-gold-hairline bg-lacquer-deep rounded-full mb-8">
            <CheckCircle2 className="w-16 h-16 text-kinpaku-gold" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-champagne tracking-wider uppercase leading-none mb-4">Order <span className="text-kinpaku-gold">Confirmed</span></h1>
          <p className="text-[1.05rem] text-text-muted">Your order is confirmed. Time to get ready to perform.</p>
          
          <div className="bg-lacquer-deep inline-block px-8 py-4 rounded-[2px] mt-8 border border-gold-hairline mb-14">
            <p className="text-[0.72rem] text-text-muted font-mono uppercase tracking-[0.22em] mb-2">Order Confirmation Number</p>
            <p className="text-2xl font-mono text-kinpaku-gold font-medium">{order._id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-14">
            {/* Shipping Node */}
            <div className="bg-lacquer-deep border border-gold-hairline p-8 rounded-[2px] space-y-6">
              <h3 className="flex items-center text-xl font-display text-champagne uppercase tracking-wider border-b border-gold-hairline pb-4">
                <Truck className="w-5 h-5 mr-3 text-kinpaku-gold" /> Delivery <span className="text-kinpaku-gold ml-1.5">Target</span>
              </h3>
              <div className="flex items-start text-text-muted text-[0.95rem] leading-[1.8]">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-text-muted" />
                <p>
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.zip}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
              <div className="pt-4 border-t border-gold-hairline">
                <p className="text-[0.8rem] font-mono uppercase tracking-[0.1em] text-text-muted">Status: <span className="text-champagne font-medium">{order.globalOrderStatus}</span></p>
              </div>
            </div>

            {/* Receipt Breakdown */}
            <div className="bg-lacquer-deep border border-gold-hairline p-8 rounded-[2px] space-y-6">
              <h3 className="flex items-center text-xl font-display text-champagne uppercase tracking-wider border-b border-gold-hairline pb-4">
                <ShoppingBag className="w-5 h-5 mr-3 text-kinpaku-gold" /> Order <span className="text-kinpaku-gold ml-1.5">Summary</span>
              </h3>
              <ul className="space-y-4 max-h-40 overflow-y-auto pr-2">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-[0.95rem]">
                    <div className="flex text-text-muted overflow-hidden pr-4">
                      <span className="font-mono text-champagne min-w-6 mr-2">{item.quantity}x</span>
                      <span className="truncate">{item.productId?.title || 'Product'}</span>
                    </div>
                    <span className="text-champagne font-mono ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gold-hairline pt-6 flex justify-between font-display text-2xl uppercase tracking-widest text-champagne">
                <span>Total Paid</span>
                <span className="text-kinpaku-gold font-mono">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/account/orders/${order._id}`} className="ks-button ks-button-primary w-full sm:w-auto text-[1.18rem] px-8">
              Track Order Status
            </Link>
            <Link href="/shop" className="ks-button ks-button-secondary w-full sm:w-auto px-8 flex items-center justify-center group">
              Continue Shopping <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
