'use client';

import { useParams, useRouter } from 'next/navigation';
import { OrderStatusHistory, useCustomerOrder } from '@/hooks/useOrders';
import { ChevronLeft, Loader2, MapPin, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryImage } from '@/utils/images';
import { Check } from 'lucide-react';

export default function CustomerOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useCustomerOrder(id);

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>;
  if (isError || !order) return <div className="p-8 text-center text-error bg-error/10 rounded-xl border border-error/20">Order not found.</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <button onClick={() => router.back()} className="p-2 bg-surfaceHighlight hover:bg-border rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
            <span className={`text-xs px-2.5 py-1 rounded-full border uppercase tracking-wider font-semibold ${
              order.globalOrderStatus === 'delivered' ? 'bg-success/10 text-success border-success/20' :
              order.globalOrderStatus === 'shipped' ? 'bg-primary-500/10 text-primary-500 border-primary-500/20' :
              order.globalOrderStatus === 'cancelled' ? 'bg-error/10 text-error border-error/20' :
              'bg-warning/10 text-warning border-warning/20'
            }`}>
              {order.globalOrderStatus}
            </span>
          </h1>
          <p className="text-sm text-textMuted mt-1">Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}</p>
        </div>
      </div>

      {/* Order Tracking Timeline */}
      {order.globalOrderStatus !== 'cancelled' && (
        <div className="bg-background border border-border rounded-xl p-6 md:p-8 overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="relative flex items-center justify-between">
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((step, index, arr) => {
                const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                const currentIndex = statuses.indexOf(order.globalOrderStatus);
                // Backwards compatibility + use actual history if available
                const stepHistory = order.statusHistory?.find((h: OrderStatusHistory) => h.status === step);
                const isCompleted = !!stepHistory || index <= currentIndex;
                const isLast = index === arr.length - 1;

                return (
                  <div key={step} className="relative flex flex-col items-center flex-1">
                    {/* Line behind circles */}
                    {!isLast && (
                      <div className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 ${index < currentIndex ? 'bg-primary-500' : 'bg-surfaceHighlight'}`} />
                    )}
                    
                    {/* Circle */}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-surface border-border text-textMuted'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    
                    {/* Label */}
                    <p className={`mt-3 text-sm font-bold uppercase tracking-wider ${isCompleted ? 'text-white' : 'text-textMuted'}`}>
                      {step}
                    </p>
                    
                    {/* Timestamp */}
                    {stepHistory?.timestamp && (
                      <p className="mt-1 text-[10px] text-textMuted text-center max-w-[80px]">
                        {format(new Date(stepHistory.timestamp), 'MMM d, h:mm a')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background border border-border p-6 rounded-xl flex items-start gap-4">
          <div className="bg-surfaceHighlight p-3 rounded-full flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted mb-2">Shipping Address</h3>
            <p className="text-white text-sm leading-relaxed">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="bg-background border border-border p-6 rounded-xl flex items-start gap-4">
          <div className="bg-surfaceHighlight p-3 rounded-full flex-shrink-0">
            <CreditCard className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted mb-2">Payment Info</h3>
            <p className="text-white text-sm mb-1">{order.paymentMethod}</p>
            <p className="text-textMuted text-sm">Status: <span className="text-success font-medium capitalize">{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-surfaceHighlight border-b border-border">
          <h3 className="font-semibold text-white">Items in this order</h3>
        </div>
        <div className="px-6 py-6 divide-y divide-border">
          {order.items.map((item, idx) => (
            <div key={idx} className={`${idx !== 0 ? 'pt-6 mt-6' : ''} flex items-center sm:items-start gap-4 sm:gap-6`}>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-surfaceHighlight border border-border rounded-lg overflow-hidden">
                <Image 
                  src={item.productId?.images?.[0] || getCategoryImage(item.productId?.category)} 
                  alt={item.productId?.title || 'Product'} 
                  fill 
                  sizes="96px"
                  className="object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-white truncate pr-4">
                      <Link href={`/product/${item.productId?._id}`} className="hover:text-primary-500 transition-colors">
                        {item.productId?.title || 'Unknown Product'}
                      </Link>
                    </h4>
                    <p className="text-xs text-textMuted mt-1">Vendor ID: {item.vendorId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${item.price.toFixed(2)}</p>
                    <p className="text-xs text-textMuted mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`capitalize inline-block px-2.5 py-1 text-xs rounded-full font-medium border ${
                    item.itemStatus === 'shipped' ? 'bg-success/10 text-success border-success/20' :
                    item.itemStatus === 'processing' ? 'bg-warning/10 text-warning border-warning/20' :
                    item.itemStatus === 'cancelled' ? 'bg-error/10 text-error border-error/20' :
                    'bg-surfaceHighlight text-textMuted border-border'
                  }`}>
                    {item.itemStatus}
                  </span>
                  
                  <p className="text-sm font-semibold text-white">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-6 bg-surfaceHighlight/50 border-t border-border flex justify-end">
          <div className="w-full sm:w-1/3 space-y-3">
            <div className="flex justify-between text-sm text-textMuted">
              <span>Items Total</span>
              <span className="text-white">${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-textMuted">
              <span>Shipping</span>
              <span className="text-success font-medium">Free</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-bold text-white">
              <span>Total Paid</span>
              <span className="text-primary-500">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
