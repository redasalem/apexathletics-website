'use client';

import Link from 'next/link';
import { useVendorOrders } from '@/hooks/useOrders';
import { Loader2, PackageOpen, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function VendorOrdersPage() {
  const { data: orders, isLoading } = useVendorOrders();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Orders Received</h2>
        <p className="text-textMuted mt-1">Manage shipments and update tracking statuses</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="border border-border bg-surface rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-surfaceHighlight p-4 rounded-full mb-4">
            <PackageOpen className="w-10 h-10 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-textMuted max-w-md mx-auto">When customers purchase your gear, those orders will appear here for fulfillment.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surfaceHighlight border-b border-border text-sm text-textMuted font-medium">
                <th className="p-4 rounded-tl-xl">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items (Yours)</th>
                <th className="p-4 text-right rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                  <td className="p-4 font-mono text-white">
                    {order._id.substring(order._id.length - 8).toUpperCase()}
                  </td>
                  <td className="p-4 text-textMuted">
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{order.customerId?.name || 'Customer'}</p>
                    <p className="text-xs text-textMuted">{order.customerId?.email || 'No email'}</p>
                  </td>
                  <td className="p-4 text-white font-medium">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/vendor-dashboard/orders/${order._id}`}
                      className="inline-flex items-center text-primary-500 hover:text-white transition-colors font-medium text-sm"
                    >
                      Process Fulfillment <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
