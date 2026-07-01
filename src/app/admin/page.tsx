'use client';

import { useAdminStats } from '@/hooks/useAdmin';
import { ArrowRight, Loader2, Users, Store, Package, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const SalesChart = dynamic(() => import('@/components/SalesChart'), { ssr: false });

export default function AdminDashboardOverview() {
  const { data: stats, isLoading, isError } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-kinpaku-gold animate-spin" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="border border-red-900/50 bg-red-950/20 text-red-400 p-8 sm:rounded-[4px] text-center shadow-panel">
        <h3 className="font-display text-2xl uppercase tracking-wider mb-2">Metrics Unavailable</h3>
        <p className="font-mono text-[0.85rem]">Cannot load platform stats at this time.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-kinpaku-gold', bg: 'bg-kinpaku-gold/10', border: 'border-kinpaku-gold/30' },
    { label: 'Total Orders', value: stats.ordersCount, icon: ShoppingBag, color: 'text-champagne', bg: 'bg-lacquer-deep', border: 'border-gold-hairline' },
    { label: 'Registered Vendors', value: stats.vendorsCount, icon: Store, color: 'text-champagne', bg: 'bg-lacquer-deep', border: 'border-gold-hairline' },
    { label: 'Active Customers', value: stats.customersCount, icon: Users, color: 'text-text-muted', bg: 'bg-lacquer-deep', border: 'border-gold-hairline/50' },
    { label: 'Marketplace Products', value: stats.productsCount, icon: Package, color: 'text-champagne', bg: 'bg-lacquer-deep', border: 'border-gold-hairline' },
    { label: 'Total Accounts', value: stats.usersCount, icon: Activity, color: 'text-text-muted', bg: 'bg-lacquer-deep', border: 'border-gold-hairline/50' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="pb-4 border-b border-gold-hairline">
        <h2 className="font-display text-4xl text-champagne tracking-wider uppercase leading-none mb-2">Platform <span className="text-kinpaku-gold">Overview</span></h2>
        <p className="text-text-muted text-[0.95rem]">Real-time metrics and platform health at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
           <SalesChart data={stats.salesTrend} />
        </div>
        <div className="border border-gold-hairline bg-raised-lacquer shadow-panel sm:rounded-[4px] p-8">
          <h3 className="text-[0.75rem] font-mono text-champagne mb-5 uppercase tracking-[0.2em]">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/orders" className="flex items-center justify-between p-4 rounded-[2px] bg-lacquer-deep border border-gold-hairline/50 hover:border-kinpaku-gold transition-colors group">
              <span className="font-mono text-[0.85rem] uppercase tracking-wider text-text-muted group-hover:text-champagne transition-colors">Review Global Orders</span>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-kinpaku-gold transition-colors" />
            </Link>
            <Link href="/admin/products" className="flex items-center justify-between p-4 rounded-[2px] bg-lacquer-deep border border-gold-hairline/50 hover:border-kinpaku-gold transition-colors group">
              <span className="font-mono text-[0.85rem] uppercase tracking-wider text-text-muted group-hover:text-champagne transition-colors">Moderate Products</span>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-kinpaku-gold transition-colors" />
            </Link>
            <Link href="/admin/vendors" className="flex items-center justify-between p-4 rounded-[2px] bg-lacquer-deep border border-gold-hairline/50 hover:border-kinpaku-gold transition-colors group">
              <span className="font-mono text-[0.85rem] uppercase tracking-wider text-text-muted group-hover:text-champagne transition-colors">Manage Vendors</span>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-kinpaku-gold transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
