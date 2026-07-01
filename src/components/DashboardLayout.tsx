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
      <div className="p-6 border-b border-gold-hairline">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-lacquer-black border border-gold-hairline sm:rounded-[2px] shadow-panel">
            <ShoppingBag className="w-5 h-5 text-kinpaku-gold" />
          </div>
          <span className="font-display text-2xl uppercase tracking-wider text-champagne">{title}</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 sm:rounded-[2px] transition-all duration-300 border ${
                isActive
                  ? 'bg-lacquer-black border-gold-hairline text-kinpaku-gold shadow-panel font-medium'
                  : 'border-transparent text-text-muted hover:text-champagne hover:bg-lacquer-black/50 hover:border-gold-hairline/30'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-mono text-[0.85rem] uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gold-hairline space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 sm:rounded-[2px] font-mono text-[0.85rem] uppercase tracking-wider border border-transparent text-text-muted hover:text-champagne hover:bg-lacquer-black/50 hover:border-gold-hairline/30 transition-all duration-300">
          <ShoppingBag className="w-5 h-5" />
          Back to Store
        </Link>
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-3 w-full px-4 py-3 sm:rounded-[2px] font-mono text-[0.85rem] uppercase tracking-wider border border-transparent text-red-400 hover:bg-red-950/30 hover:border-red-900/50 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex h-screen bg-lacquer-black overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 flex-col bg-lacquer-deep border-r border-gold-hairline flex-shrink-0 z-10 shadow-panel">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40" 
              onClick={() => setSidebarOpen(false)} 
              role="button"
              aria-label="Close sidebar"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') setSidebarOpen(false); }}
            />
            <aside className="absolute z-50 left-0 top-0 bottom-0 w-72 flex flex-col bg-lacquer-deep border-r border-gold-hairline shadow-2xl animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-champagne transition-colors"
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
          <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-lacquer-deep border-b border-gold-hairline">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-text-muted hover:text-champagne transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-display text-xl uppercase tracking-wider text-champagne">{title}</span>
          </div>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative">
            {/* Subtle glow effect behind content */}
            <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-kinpaku-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
