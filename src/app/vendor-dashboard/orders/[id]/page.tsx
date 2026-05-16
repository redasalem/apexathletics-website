'use client';

import { useParams, useRouter } from 'next/navigation';
import { useVendorOrder, useUpdateVendorItemStatus } from '@/hooks/useOrders';
import { ChevronLeft, Loader2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getCategoryImage } from '@/utils/images';

export default function VendorOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useVendorOrder(id);
  const updateStatus = useUpdateVendorItemStatus();

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (isError || !order) return <div className="p-8 text-center text-error bg-error/10 rounded-xl border border-error/20 max-w-4xl mx-auto">Order not found or unauthorized.</div>;

  const handleStatusChange = async (itemId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId: id, itemId, status });
      toast.success('Line item status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <button onClick={() => router.back()} className="p-2 bg-surfaceHighlight hover:bg-border rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h1>
          <p className="text-sm text-textMuted mt-1">Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy @ h:mm a')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Line Items */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">Fulfillment Items</h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="relative w-24 h-24 flex-shrink-0 bg-surfaceHighlight border border-border rounded-lg overflow-hidden">
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
                      <h4 className="text-lg font-medium text-white truncate pr-4">
                        <Link href={`/product/${item.productId?._id}`} className="hover:text-primary-500 transition-colors">
                          {item.productId?.title || 'Unknown Product'}
                        </Link>
                      </h4>
                      <p className="text-xs text-textMuted mt-1">Snapshot Price: ${item.price.toFixed(2)}</p>
                      <p className="text-sm text-white mt-1">Qty: {item.quantity}</p>
                      
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="mt-2 text-xs font-semibold text-primary-500 bg-primary-500/10 inline-block px-2 py-1 rounded">
                          {item.selectedSize && `Size: ${item.selectedSize}`} 
                          {item.selectedSize && item.selectedColor && ' | '}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      )}
                    </div>
                    
                    <div className="w-40 text-right">
                      <label className="text-xs text-textMuted uppercase font-medium tracking-wider mb-1 block">Line Status</label>
                      <select 
                        value={item.itemStatus}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        disabled={updateStatus.isPending}
                        className={`w-full text-sm font-semibold rounded-md border p-2 bg-background focus:ring-primary-500 transition-colors ${
                          item.itemStatus === 'shipped' ? 'text-success border-success/30' :
                          item.itemStatus === 'cancelled' ? 'text-error border-error/30' :
                          item.itemStatus === 'processing' ? 'text-warning border-warning/30' :
                          'text-white border-border'
                        }`}
                      >
                        <option value="pending" className="text-white">Pending</option>
                        <option value="processing" className="text-white">Processing</option>
                        <option value="shipped" className="text-white">Shipped</option>
                        <option value="cancelled" className="text-white">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Customer Info */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-border pb-3">Customer Profile</h3>
            <div>
              <p className="text-xs text-textMuted uppercase font-medium tracking-wider mb-1">Name</p>
              <p className="text-sm font-semibold text-white">{order.customerId?.name || 'Customer'}</p>
            </div>
            <div>
              <p className="text-xs text-textMuted uppercase font-medium tracking-wider mb-1">Email</p>
              <p className="text-sm text-white break-all"><a href={`mailto:${order.customerId?.email}`} className="text-primary-500 hover:underline">{order.customerId?.email}</a></p>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
            <h3 className="flex items-center text-lg font-bold text-white border-b border-border pb-3">
              <MapPin className="w-5 h-5 mr-2 text-primary-500" /> Destination
            </h3>
            <p className="text-white text-sm leading-relaxed">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
