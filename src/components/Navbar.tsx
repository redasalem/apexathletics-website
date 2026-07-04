'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingBag, LogIn, User, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import SearchBar from './SearchBar';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useAuth();
  const canUseCustomerCollections = user?.role === 'customer';
  const { data: cart } = useCart(canUseCustomerCollections);
  const { data: wishlist } = useWishlist(canUseCustomerCollections);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleProtectedNavigation = (e: React.MouseEvent, destination: string, message: string) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    if (!user) {
      e.preventDefault();
      toast.error(message);
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(destination)}`);
      }, 500);
    }
  };

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
      <nav className="border-b border-gold-hairline bg-lacquer-deep sticky top-0 z-50">
        <div className="max-w-[1320px] mx-auto px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="p-1.5 sm:p-2 border border-transparent group-hover:border-gold-hairline rounded-[2px] transition-colors">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-kinpaku-gold" />
            </div>
            <span className="text-xl sm:text-2xl font-wordmark tracking-[0.15em] uppercase text-champagne group-hover:text-kinpaku-gold transition-colors">IMPECCABLE</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium uppercase tracking-[0.18em] transition-colors ${link.active ? 'text-kinpaku-gold' : 'text-text-muted hover:text-champagne'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Cart & Auth & Hamburger */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/wishlist" onClick={(e) => handleProtectedNavigation(e, '/wishlist', 'Sign in to view your wishlist')} className="relative text-text-muted hover:text-champagne transition-colors flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">Wishlist</span>
              {wishlistItemsCount > 0 && (
                <span aria-live="polite" aria-atomic="true" className="absolute -top-1.5 -right-1.5 bg-kinpaku-gold text-lacquer-deep text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  <span className="sr-only">Wishlist items: </span>
                  {wishlistItemsCount}
                </span>
              )}
            </Link>

            <Link href="/cart" onClick={(e) => handleProtectedNavigation(e, '/cart', 'Sign in to view your cart')} className="relative text-text-muted hover:text-champagne transition-colors flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">Cart</span>
              {cartItemsCount > 0 && (
                <span aria-live="polite" aria-atomic="true" className="absolute -top-1.5 -right-1.5 bg-kinpaku-gold text-lacquer-deep text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  <span className="sr-only">Cart items: </span>
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {!isLoading && user ? (
              <Link href={accountHref} className="hidden sm:flex items-center gap-2 bg-transparent hover:bg-raised-lacquer px-4 py-2 rounded-[2px] text-sm font-medium transition-all border border-gold-hairline hover:border-gold-hairline-strong text-champagne">
                <User className="w-4 h-4 text-kinpaku-gold" />
                <span className="hidden md:inline">Account</span>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 bg-kinpaku-gold hover:bg-kinpaku-pale px-4 py-2 rounded-[2px] text-sm font-medium text-lacquer-deep transition-colors border border-kinpaku-gold">
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-text-muted hover:text-champagne transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gold-hairline bg-lacquer-deep animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-[1320px] mx-auto px-6 py-4 space-y-4">
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
                    className={`block px-4 py-3 rounded-[2px] text-sm font-medium uppercase tracking-[0.18em] transition-colors ${link.active ? 'text-kinpaku-gold bg-raised-lacquer border border-gold-hairline' : 'text-text-muted hover:text-champagne hover:bg-raised-lacquer'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth & Wishlist */}
              <div className="pt-2 border-t border-gold-hairline space-y-3">
                <Link href="/wishlist" onClick={(e) => handleProtectedNavigation(e, '/wishlist', 'Sign in to view your wishlist')} className="flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-medium text-champagne hover:bg-raised-lacquer transition-colors border border-transparent hover:border-gold-hairline">
                  <Heart className="w-5 h-5 text-kinpaku-gold" />
                  <div>
                    <div>Wishlist</div>
                    <div className="text-xs text-text-muted font-normal">{wishlistItemsCount} Items</div>
                  </div>
                </Link>
                {!isLoading && user ? (
                  <Link href={accountHref} className="flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-medium text-champagne hover:bg-raised-lacquer transition-colors border border-transparent hover:border-gold-hairline">
                    <User className="w-5 h-5 text-kinpaku-gold" />
                    <div>
                      <div>{user.name}</div>
                      <div className="text-xs text-text-muted font-normal capitalize">{user.role} Account</div>
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" className="flex items-center justify-center gap-2 bg-kinpaku-gold hover:bg-kinpaku-pale px-4 py-3 rounded-[2px] text-sm font-medium text-lacquer-deep transition-colors w-full">
                    <LogIn className="w-4 h-4" /> Sign In
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
