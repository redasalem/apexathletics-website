'use client';

import { Package, Home, ShoppingBag, Settings } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { name: 'Dashboard', href: '/vendor-dashboard', icon: Home },
    { name: 'Products', href: '/vendor-dashboard/products', icon: Package },
    { name: 'Orders', href: '/vendor-dashboard/orders', icon: ShoppingBag },
    { name: 'Settings', href: '/vendor-dashboard/settings', icon: Settings },
  ];

  return (
    <DashboardLayout
      allowedRoles={['vendor']}
      title="Apex Vendor"
      subtitle="Your storefront control panel"
      links={links}
    >
      {children}
    </DashboardLayout>
  );
}
