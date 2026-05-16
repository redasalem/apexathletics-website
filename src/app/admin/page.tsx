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
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="border border-error/20 bg-error/10 text-error p-8 rounded-xl text-center">
        <h3 className="font-bold text-lg mb-2">Metrics Unavailable</h3>
        <p className="text-sm">Cannot load platform stats at this time.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Orders', value: stats.ordersCount, icon: ShoppingBag, color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { label: 'Registered Vendors', value: stats.vendorsCount, icon: Store, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Active Customers', value: stats.customersCount, icon: Users, color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { label: 'Marketplace Products', value: stats.productsCount, icon: Package, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Accounts', value: stats.usersCount, icon: Activity, color: 'text-textMuted', bg: 'bg-surfaceHighlight' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Platform Overview</h2>
        <p className="text-textMuted">Real-time metrics and platform health at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-surface border border-border p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textMuted uppercase tracking-wider mb-1">{card.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{card.value}</h3>
            </div>
            <div className={`p-4 rounded-full ${card.bg}`}>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <SalesChart data={stats.salesTrend} />
        </div>
        <div className="border border-border bg-surface rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/orders" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary-500/50 hover:bg-surfaceHighlight transition-colors group">
              <span className="font-medium text-white group-hover:text-primary-500 transition-colors">Review Global Orders</span>
              <ArrowRight className="w-5 h-5 text-textMuted group-hover:text-primary-500 transition-colors" />
            </Link>
            <Link href="/admin/products" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary-500/50 hover:bg-surfaceHighlight transition-colors group">
              <span className="font-medium text-white group-hover:text-primary-500 transition-colors">Moderate Products</span>
              <ArrowRight className="w-5 h-5 text-textMuted group-hover:text-primary-500 transition-colors" />
            </Link>
            <Link href="/admin/vendors" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary-500/50 hover:bg-surfaceHighlight transition-colors group">
              <span className="font-medium text-white group-hover:text-primary-500 transition-colors">Manage Vendors</span>
              <ArrowRight className="w-5 h-5 text-textMuted group-hover:text-primary-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
