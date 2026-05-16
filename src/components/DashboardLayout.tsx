'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, ShoppingBag } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

interface NavItem {
  href: string;
  name: string;
  icon: React.ElementType; // The icon component itself, not a rendered node
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  links: NavItem[];
  title: string;
  subtitle?: string;
  allowedRoles: ('admin' | 'vendor' | 'customer')[];
}

export default function DashboardLayout({ children, links, title, allowedRoles }: DashboardLayoutProps) {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary-500 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic text-white">{title}</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                  : 'text-textMuted hover:text-white hover:bg-surfaceHighlight'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-textMuted hover:text-white hover:bg-surfaceHighlight transition-all">
          <ShoppingBag className="w-5 h-5" />
          Back to Store
        </Link>
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-error hover:bg-error/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 flex-col bg-surface border-r border-border flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/60 z-40" 
              onClick={() => setSidebarOpen(false)} 
              role="button"
              aria-label="Close sidebar"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') setSidebarOpen(false); }}
            />
            <aside className="absolute z-50 left-0 top-0 bottom-0 w-72 flex flex-col bg-surface border-r border-border shadow-2xl animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-textMuted hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-surface border-b border-border">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-textMuted hover:text-white transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-sm font-bold uppercase tracking-widest text-white">{title}</span>
          </div>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
