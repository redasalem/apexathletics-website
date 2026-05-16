'use client';

import { useVendorStats } from '@/hooks/useVendor';
import { Loader2, Package, ShoppingBag, DollarSign, ArrowRight, Zap, CreditCard } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const SalesChart = dynamic(() => import('@/components/SalesChart'), { ssr: false });

export default function VendorDashboardOverview() {
  const { data: stats, isLoading, isError } = useVendorStats();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="border border-error/20 bg-error/10 text-error p-8 rounded-xl text-center">
        <h3 className="font-bold text-lg mb-2">Metrics Unavailable</h3>
        <p className="text-sm">Cannot load your store stats at this time.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Store Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { label: 'Live Products', value: stats.productsCount, icon: Package, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Store Performance</h2>
          <p className="text-textMuted">Track your sales activity and inventory levels.</p>
        </div>
        <Link href="/vendor-dashboard/products/new" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-primary-500/20 w-fit">
          <Zap className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-surface border border-border p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tight italic">{card.value}</h3>
            </div>
            <div className={`p-4 rounded-full ${card.bg}`}>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <SalesChart data={stats.salesTrend} title="Your Sales Trend (Last 7 Days)" />
        </div>
        
        <div className="space-y-6">
          <div className="border border-border bg-surface rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Management</h3>
            <div className="space-y-3">
              <Link href="/vendor-dashboard/orders" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary-500/50 hover:bg-surfaceHighlight transition-colors group">
                <span className="font-bold text-sm text-textMuted group-hover:text-white">Active Orders</span>
                <ArrowRight className="w-4 h-4 text-textMuted group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/vendor-dashboard/products" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary-500/50 hover:bg-surfaceHighlight transition-colors group">
                <span className="font-bold text-sm text-textMuted group-hover:text-white">Inventory Management</span>
                <ArrowRight className="w-4 h-4 text-textMuted group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/vendor-dashboard/payouts" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-indigo-500/50 hover:bg-surfaceHighlight transition-colors group">
                <div className="flex items-center gap-3">
                   <CreditCard className="w-4 h-4 text-indigo-500" />
                   <span className="font-bold text-sm text-textMuted group-hover:text-white">Payout Settings</span>
                </div>
                <ArrowRight className="w-4 h-4 text-textMuted group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          <div className="bg-primary-500/5 border border-primary-500/10 rounded-2xl p-6">
            <h4 className="font-bold text-white mb-2">Vendor Tips</h4>
            <p className="text-xs text-textMuted leading-loose">
              High-quality images and detailed descriptions can increase your conversion rate by up to 40%. Keep your inventory updated to avoid order cancellations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
