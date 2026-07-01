'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCustomerOrders } from '@/hooks/useOrders';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { getCategoryImage } from '@/utils/images';

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useCustomerOrders();

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 text-kinpaku-gold animate-spin" /></div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16 bg-raised-lacquer border border-gold-hairline shadow-panel sm:rounded-[4px]">
        <div className="inline-block p-4 bg-lacquer-deep border border-gold-hairline rounded-full mb-6">
          <Package className="w-10 h-10 text-kinpaku-gold" />
        </div>
        <h2 className="font-display text-3xl text-champagne uppercase tracking-wider mb-2">No orders found</h2>
        <p className="text-text-muted mb-8 font-mono text-[0.9rem]">You haven&apos;t made any purchases yet.</p>
        <Link href="/shop" className="ks-button ks-button-primary px-8">Browse Gear</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gold-hairline">
        <h1 className="font-display text-4xl text-champagne tracking-wider uppercase leading-none mb-2">Order <span className="text-kinpaku-gold">History</span></h1>
        <p className="text-text-muted text-[0.95rem]">Check the status of recent orders, manage returns, and download invoices.</p>
      </div>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="bg-raised-lacquer border border-gold-hairline shadow-panel sm:rounded-[4px] overflow-hidden">
            <div className="bg-lacquer-deep px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-gold-hairline">
              <div className="flex gap-8">
                <div>
                  <p className="text-[0.65rem] font-mono text-text-muted uppercase font-medium tracking-[0.2em] mb-1">Date placed</p>
                  <p className="text-[0.95rem] font-medium text-champagne">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-mono text-text-muted uppercase font-medium tracking-[0.2em] mb-1">Total amount</p>
                  <p className="text-[0.95rem] font-mono text-kinpaku-gold font-medium">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-mono text-text-muted uppercase font-medium tracking-[0.2em] mb-1">Order #</p>
                  <p className="text-[0.95rem] font-mono text-champagne">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                </div>
              </div>
              <Link 
                href={`/account/orders/${order._id}`}
                className="ks-button ks-button-secondary py-2 px-6 text-[0.8rem]"
              >
                View Details <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            <div className="px-6 py-6 divide-y divide-gold-hairline">
              {order.items.map((item, idx) => (
                <div key={idx} className={`${idx !== 0 ? 'pt-6 mt-6' : ''} flex items-center sm:items-start gap-4 sm:gap-6`}>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-lacquer-deep border border-gold-hairline rounded-[2px] overflow-hidden">
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
                      <h4 className="text-[1.1rem] font-display uppercase tracking-wide text-champagne truncate pr-4">
                        <Link href={`/product/${item.productId?._id}`} className="hover:text-kinpaku-gold transition-colors">
                          {item.productId?.title || 'Unknown Product'}
                        </Link>
                      </h4>
                      <p className="font-mono text-champagne whitespace-nowrap">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <p className="mt-1 text-[0.85rem] font-mono text-text-muted">Qty: {item.quantity}</p>
                    
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="mt-1 text-[0.8rem] text-text-muted">
                        {item.selectedSize && `Size: ${item.selectedSize}`} 
                        {item.selectedSize && item.selectedColor && ' | '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                    )}

                    <div className="mt-4 flex items-center">
                      <span className={`font-mono uppercase tracking-widest inline-block px-3 py-1 text-[0.65rem] border ${
                        item.itemStatus === 'shipped' ? 'bg-kinpaku-gold/10 text-kinpaku-gold border-kinpaku-gold/30' :
                        item.itemStatus === 'processing' ? 'bg-lacquer-deep text-champagne border-gold-hairline' :
                        item.itemStatus === 'cancelled' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                        'bg-lacquer-deep text-text-muted border-gold-hairline'
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
