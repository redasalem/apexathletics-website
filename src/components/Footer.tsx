import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-lacquer-deep border-t border-gold-hairline mt-auto">
      <div className="max-w-[1320px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 border border-gold-hairline rounded-[2px] group-hover:border-kinpaku-gold transition-colors">
                <ShoppingBag className="w-5 h-5 text-kinpaku-gold" />
              </div>
              <span className="text-xl font-wordmark tracking-[0.15em] uppercase text-champagne group-hover:text-kinpaku-gold transition-colors">IMPECCABLE</span>
            </Link>
            <p className="text-sm text-text-muted leading-[1.8] max-w-xs">
              Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-champagne mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Athletic+Shoes" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Athletic Shoes</Link></li>
              <li><Link href="/shop?category=Sportswear" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Sportswear</Link></li>
              <li><Link href="/shop?category=Sports+Equipment" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Sports Equipment</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-champagne mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Create Account</Link></li>
              <li><Link href="/account/orders" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-champagne mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/shipping" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Shipping Policy</Link></li>
              <li><Link href="/contact" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold-hairline mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted font-sans">
            &copy; {new Date().getFullYear()} Impeccable Athletics. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted font-sans border border-gold-hairline px-3 py-1.5 rounded-[2px] bg-lacquer-black">
              Secure Payments via <span className="text-kinpaku-gold">Stripe</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
