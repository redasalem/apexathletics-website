'use client';

import Link from 'next/link';
import { useAdminOrders } from '@/hooks/useOrders';
import { Loader2, Database, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();

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
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <span className="bg-primary-500/20 text-primary-500 p-2 rounded-lg"><Database className="w-6 h-6" /></span>
          Global Orders LEDGER
        </h2>
        <p className="text-textMuted mt-1">Full platform transaction history across all vendors and customers.</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="border border-border bg-surface rounded-xl p-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">No global transactions found.</h3>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surfaceHighlight border-b border-border text-xs uppercase tracking-wider text-textMuted font-medium">
                <th className="p-4 rounded-tl-xl">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Global Status</th>
                <th className="p-4 text-right rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                  <td className="p-4 font-mono text-white">
                    {order._id.substring(order._id.length - 8).toUpperCase()}
                    <span className="block text-xs font-sans text-textMuted">{format(new Date(order.createdAt), 'MM/dd/yy HH:mm')}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{order.customerId?.name || 'Customer'}</p>
                    <p className="text-xs text-textMuted">{order.customerId?.email || 'No email'}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white">${order.totalAmount.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`capitalize inline-block px-2.5 py-1 text-xs rounded-full font-bold border ${
                      order.globalOrderStatus === 'delivered' ? 'bg-success/10 text-success border-success/20' :
                      order.globalOrderStatus === 'shipped' ? 'bg-primary-500/10 text-primary-500 border-primary-500/20' :
                      order.globalOrderStatus === 'cancelled' ? 'bg-error/10 text-error border-error/20' :
                      'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {order.globalOrderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/orders/${order._id}`}
                      className="inline-flex items-center btn-secondary py-1 text-xs font-medium"
                    >
                      Audit Order <ChevronRight className="w-4 h-4 ml-1 opacity-50" />
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
