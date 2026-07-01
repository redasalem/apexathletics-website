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
        <Loader2 className="w-10 h-10 text-kinpaku-gold animate-spin" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="border border-red-900/50 bg-red-950/20 text-red-400 p-8 rounded-[2px] text-center shadow-panel">
        <h3 className="font-display text-2xl uppercase tracking-wider mb-2">Metrics Unavailable</h3>
        <p className="font-mono text-[0.85rem]">Cannot load your store stats at this time.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Store Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-kinpaku-gold', bg: 'bg-kinpaku-gold/10', border: 'border-kinpaku-gold/30' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-champagne', bg: 'bg-lacquer-deep', border: 'border-gold-hairline' },
    { label: 'Live Products', value: stats.productsCount, icon: Package, color: 'text-text-muted', bg: 'bg-lacquer-deep', border: 'border-gold-hairline' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gold-hairline">
        <div>
          <h2 className="font-display text-4xl text-champagne tracking-wider uppercase leading-none mb-2">Store <span className="text-kinpaku-gold">Performance</span></h2>
          <p className="text-text-muted text-[0.95rem]">Track your sales activity and inventory levels.</p>
        </div>
        <Link href="/vendor-dashboard/products/new" className="ks-button ks-button-primary px-6 py-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-raised-lacquer border border-gold-hairline p-6 sm:rounded-[4px] shadow-panel flex items-center justify-between">
            <div>
              <p className="text-[0.7rem] font-mono font-medium text-text-muted uppercase tracking-[0.2em] mb-1">{card.label}</p>
              <h3 className="font-display text-4xl text-champagne tracking-wider">{card.value}</h3>
            </div>
            <div className={`p-4 rounded-full border ${card.bg} ${card.border}`}>
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
          <div className="border border-gold-hairline bg-raised-lacquer shadow-panel sm:rounded-[4px] p-8">
            <h3 className="text-[0.75rem] font-mono text-champagne mb-5 uppercase tracking-[0.2em]">Management</h3>
            <div className="space-y-3">
              <Link href="/vendor-dashboard/orders" className="flex items-center justify-between p-4 rounded-[2px] bg-lacquer-deep border border-gold-hairline/50 hover:border-kinpaku-gold transition-colors group">
                <span className="font-mono text-[0.85rem] uppercase tracking-wider text-text-muted group-hover:text-champagne transition-colors">Active Orders</span>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-kinpaku-gold group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/vendor-dashboard/products" className="flex items-center justify-between p-4 rounded-[2px] bg-lacquer-deep border border-gold-hairline/50 hover:border-kinpaku-gold transition-colors group">
                <span className="font-mono text-[0.85rem] uppercase tracking-wider text-text-muted group-hover:text-champagne transition-colors">Inventory</span>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-kinpaku-gold group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/vendor-dashboard/payouts" className="flex items-center justify-between p-4 rounded-[2px] bg-lacquer-deep border border-gold-hairline/50 hover:border-kinpaku-gold transition-colors group">
                <div className="flex items-center gap-3">
                   <CreditCard className="w-4 h-4 text-text-muted group-hover:text-kinpaku-gold transition-colors" />
                   <span className="font-mono text-[0.85rem] uppercase tracking-wider text-text-muted group-hover:text-champagne transition-colors">Payouts</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-kinpaku-gold group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          <div className="bg-lacquer-deep border border-gold-hairline shadow-panel sm:rounded-[4px] p-8">
            <h4 className="font-display text-2xl text-kinpaku-gold uppercase tracking-wider mb-2">Vendor Tips</h4>
            <p className="font-mono text-[0.8rem] text-text-muted leading-relaxed">
              High-quality images and detailed descriptions can increase your conversion rate by up to 40%. Keep your inventory updated to avoid order cancellations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
