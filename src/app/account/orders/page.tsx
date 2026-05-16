'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCustomerOrders } from '@/hooks/useOrders';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { getCategoryImage } from '@/utils/images';

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useCustomerOrders();

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-textMuted mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No orders found</h2>
        <p className="text-textMuted mb-8">You haven&apos;t made any purchases yet.</p>
        <Link href="/" className="btn-primary">Browse Gear</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Order History</h1>
        <p className="text-textMuted mt-1">Check the status of recent orders, manage returns, and download invoices.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-border rounded-xl overflow-hidden bg-background">
            <div className="bg-surfaceHighlight px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border">
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-textMuted uppercase font-medium tracking-wider mb-1">Date placed</p>
                  <p className="text-sm font-semibold text-white">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-textMuted uppercase font-medium tracking-wider mb-1">Total amount</p>
                  <p className="text-sm font-semibold text-white">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-textMuted uppercase font-medium tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-mono text-white">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                </div>
              </div>
              <Link 
                href={`/account/orders/${order._id}`}
                className="btn-secondary py-2 px-4 text-sm group flex items-center"
              >
                View Details <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
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
                    <div className="flex justify-between">
                      <h4 className="text-base font-medium text-white truncate pr-4">
                        <Link href={`/product/${item.productId?._id}`} className="hover:text-primary-500 transition-colors">
                          {item.productId?.title || 'Unknown Product'}
                        </Link>
                      </h4>
                      <p className="font-medium text-white whitespace-nowrap">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <p className="mt-1 text-sm text-textMuted">Qty: {item.quantity}</p>
                    
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="mt-1 text-xs text-textMuted">
                        {item.selectedSize && `Size: ${item.selectedSize}`} 
                        {item.selectedSize && item.selectedColor && ' | '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                    )}

                    <div className="mt-4 flex items-center">
                      <span className={`capitalize inline-block px-2.5 py-1 text-xs rounded-full font-medium border ${
                        item.itemStatus === 'shipped' ? 'bg-success/10 text-success border-success/20' :
                        item.itemStatus === 'processing' ? 'bg-warning/10 text-warning border-warning/20' :
                        item.itemStatus === 'cancelled' ? 'bg-error/10 text-error border-error/20' :
                        'bg-surfaceHighlight text-textMuted border-border'
                      }`}>
                        {item.itemStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
