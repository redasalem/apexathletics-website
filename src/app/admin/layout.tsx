'use client';

import { LayoutDashboard, Users, ShoppingBag, Store, Package, Tag, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Vendors', href: '/admin/vendors', icon: Store },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Admins', href: '/admin/admins', icon: ShieldCheck },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Global Orders', href: '/admin/orders', icon: ShoppingBag }
  ];

  return (
    <DashboardLayout
      allowedRoles={['admin']}
      title="Apex Admin"
      subtitle="Platform Control"
      links={links}
    >
      {children}
    </DashboardLayout>
  );
}
