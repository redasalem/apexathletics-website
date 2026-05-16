'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingBag, LogIn, User, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import SearchBar from './SearchBar';

export default function Navbar() {
  const pathname = usePathname();
  const { data: user, isLoading } = useAuth();
  const canUseCustomerCollections = user?.role === 'customer';
  const { data: cart } = useCart(canUseCustomerCollections);
  const { data: wishlist } = useWishlist(canUseCustomerCollections);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Don't show global navbar inside admin or vendor dashboards
  if (pathname.startsWith('/admin') || pathname.startsWith('/vendor-dashboard')) {
    return <div className="hidden" aria-hidden="true" />;
  }

  const cartItemsCount = cart?.items?.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0) || 0;
  const wishlistItemsCount = wishlist?.items?.length || 0;

  const navLinks = [
    { href: '/', label: 'Home', active: pathname === '/' },
    { href: '/shop', label: 'Products', active: pathname.startsWith('/shop') || pathname.startsWith('/product') },
  ];

  const accountHref = user?.role === 'admin' ? '/admin' : user?.role === 'vendor' ? '/vendor-dashboard' : '/account/orders';

  return (
    <>
      <nav className="border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="p-1.5 sm:p-2 bg-primary-500 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tighter uppercase italic text-white group-hover:text-primary-500 transition-colors">Apex Sports</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={`text-sm font-bold uppercase tracking-widest transition-colors ${link.active ? 'text-primary-500' : 'text-textMuted hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Cart & Auth & Hamburger */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/wishlist" className="relative text-textMuted hover:text-white transition-colors flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline font-bold text-sm">Wishlist</span>
              {wishlistItemsCount > 0 && (
                <span aria-live="polite" aria-atomic="true" className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  <span className="sr-only">Wishlist items: </span>
                  {wishlistItemsCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative text-textMuted hover:text-white transition-colors flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-bold text-sm">Cart</span>
              {cartItemsCount > 0 && (
                <span aria-live="polite" aria-atomic="true" className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  <span className="sr-only">Cart items: </span>
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {!isLoading && user ? (
              <Link href={accountHref} className="hidden sm:flex items-center gap-2 bg-surfaceHighlight hover:bg-border px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10">
                <User className="w-4 h-4 text-primary-500" />
                <span className="hidden md:inline">Account</span>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/20">
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-textMuted hover:text-white transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/5 bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="md:hidden">
                <SearchBar />
              </div>
              
              {/* Mobile Nav Links */}
              <div className="space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${link.active ? 'text-primary-500 bg-primary-500/10' : 'text-textMuted hover:text-white hover:bg-surfaceHighlight'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth & Wishlist */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white hover:bg-surfaceHighlight transition-colors">
                  <Heart className="w-5 h-5 text-primary-500" />
                  <div>
                    <div>Wishlist</div>
                    <div className="text-xs text-textMuted font-normal">{wishlistItemsCount} Items</div>
                  </div>
                </Link>
                {!isLoading && user ? (
                  <Link href={accountHref} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white hover:bg-surfaceHighlight transition-colors">
                    <User className="w-5 h-5 text-primary-500" />
                    <div>
                      <div>{user.name}</div>
                      <div className="text-xs text-textMuted font-normal capitalize">{user.role} Account</div>
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" className="btn-primary w-full py-3 text-center">
                    <LogIn className="w-4 h-4 mr-2" /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
