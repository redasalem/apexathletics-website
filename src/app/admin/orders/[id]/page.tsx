'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAdminOrder, useUpdateGlobalOrderStatus } from '@/hooks/useOrders';
import { ChevronLeft, Loader2, User, CreditCard, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useAdminOrder(id);
  const updateStatus = useUpdateGlobalOrderStatus();

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (isError || !order) return <div className="p-8 text-center text-error bg-error/10 border border-error/20 mx-auto mt-10 rounded-xl">Ledger entry not found or restricted.</div>;

  const handleGlobalUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateStatus.mutateAsync({ orderId: id, status: e.target.value });
      toast.success('Global Order Ledger Updated');
    } catch {
      toast.error('Failed to commit ledger update');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-surfaceHighlight hover:bg-border rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Order #{order._id.substring(order._id.length - 8).toUpperCase()}
              <ShieldAlert className="w-5 h-5 text-primary-500" />
            </h1>
            <p className="text-sm text-textMuted mt-1">Transaction logged on {format(new Date(order.createdAt), 'MM/dd/yyyy HH:mm:ss')}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <label className="text-xs uppercase tracking-wider text-textMuted font-bold">Override Global Status</label>
          <select 
            value={order.globalOrderStatus}
            onChange={handleGlobalUpdate}
            disabled={updateStatus.isPending}
            className={`font-semibold rounded-md border p-2 bg-background focus:ring-primary-500 transition-colors ${
              order.globalOrderStatus === 'delivered' ? 'text-success border-success/30' :
              order.globalOrderStatus === 'cancelled' ? 'text-error border-error/30' :
              order.globalOrderStatus === 'shipped' ? 'text-primary-500 border-primary-500/30' :
              'text-warning border-warning/30'
            }`}
          >
            <option value="pending" className="text-warning">Pending</option>
            <option value="confirmed" className="text-white">Confirmed</option>
            <option value="processing" className="text-white">Processing</option>
            <option value="shipped" className="text-primary-500">Shipped</option>
            <option value="delivered" className="text-success">Delivered</option>
            <option value="cancelled" className="text-error">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface border border-border p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-primary-500" /> Buyer Identity
            </h3>
            <p className="text-white font-medium">{order.customerId?.name || 'N/A'}</p>
            <p className="text-textMuted text-sm break-all">{order.customerId?.email || 'N/A'}</p>
          </div>

          <div className="bg-surface border border-border p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-primary-500" /> Payment & Total
            </h3>
            <p className="text-textMuted text-sm mb-1">{order.paymentMethod} - <span className="text-success capitalize font-semibold">{order.paymentStatus}</span></p>
            <p className="text-2xl font-bold text-primary-500 mt-2">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Line Item Deep Audit</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-textMuted">
                    <th className="pb-3 pr-4">Product Snapshot</th>
                    <th className="pb-3 px-4">Vendor ID</th>
                    <th className="pb-3 px-4">Metrics</th>
                    <th className="pb-3 pl-4 text-right">Vendor Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-4 pr-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{item.productId?.title || 'Unknown Asset'}</span>
                          <span className="text-xs text-textMuted mt-1 break-all font-mono">ID: {typeof item.productId === 'object' ? item.productId._id : item.productId}</span>
                          {(item.selectedSize || item.selectedColor) && (
                            <span className="text-xs text-primary-500 mt-1">Variants: {item.selectedSize} / {item.selectedColor}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-mono text-textMuted bg-surfaceHighlight p-1 rounded">{item.vendorId}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white">{item.quantity}x @ ${item.price.toFixed(2)}</p>
                          <p className="text-xs text-textMuted mt-1">LTV: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <span className={`capitalize inline-block px-2.5 py-1 text-xs rounded-full border ${
                          item.itemStatus === 'shipped' ? 'bg-success/10 text-success border-success/20' :
                          item.itemStatus === 'cancelled' ? 'bg-error/10 text-error border-error/20' :
                          item.itemStatus === 'processing' ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-surfaceHighlight text-textMuted border-border'
                        }`}>
                          {item.itemStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
