'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingBag, Heart, LogOut, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useLogout } from '@/hooks/useAuth';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push('/login');
  };

  const links = [
    { name: 'Profile Overview', href: '/account', icon: User },
    { name: 'Order History', href: '/account/orders', icon: ShoppingBag },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  ];

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Your Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-primary-500/20 text-primary-500 font-medium' 
                        : 'text-textMuted hover:bg-surfaceHighlight hover:text-white'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              
              <button 
                onClick={handleLogout}
                disabled={logout.isPending}
                className="w-full mt-4 flex items-center space-x-3 px-4 py-3 rounded-xl text-textMuted hover:bg-error/10 hover:text-error transition-colors text-left"
              >
                {logout.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 bg-surface border border-border rounded-2xl p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
