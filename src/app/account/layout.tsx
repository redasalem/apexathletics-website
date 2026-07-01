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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 min-h-[70vh]">
        <h1 className="font-display text-5xl text-champagne uppercase tracking-wider mb-10 leading-none">Your <span className="text-kinpaku-gold">Account</span></h1>
        
        <div className="flex flex-col md:flex-row gap-10">
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-3 px-5 py-3.5 transition-all duration-300 sm:rounded-[2px] border ${
                      isActive 
                        ? 'bg-lacquer-deep border-gold-hairline text-kinpaku-gold shadow-panel font-medium' 
                        : 'border-transparent text-text-muted hover:bg-lacquer-deep/50 hover:border-gold-hairline/30 hover:text-champagne'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-mono text-[0.85rem] uppercase tracking-wider">{link.name}</span>
                  </Link>
                );
              })}
              
              <button 
                onClick={handleLogout}
                disabled={logout.isPending}
                className="w-full mt-6 flex items-center space-x-3 px-5 py-3.5 sm:rounded-[2px] border border-transparent text-text-muted hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-400 transition-all duration-300 text-left font-mono text-[0.85rem] uppercase tracking-wider"
              >
                {logout.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
