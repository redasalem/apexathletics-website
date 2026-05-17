import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-primary-500 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase italic text-white">Apex Sports</span>
            </Link>
            <p className="text-sm text-textMuted leading-relaxed">
              Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-sm text-textMuted hover:text-primary-500 transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Athletic+Shoes" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Athletic Shoes</Link></li>
              <li><Link href="/shop?category=Sportswear" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Sportswear</Link></li>
              <li><Link href="/shop?category=Sports+Equipment" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Sports Equipment</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Create Account</Link></li>
              <li><Link href="/account/orders" className="text-sm text-textMuted hover:text-primary-500 transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-textMuted hover:text-primary-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/shipping" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/contact" className="text-sm text-textMuted hover:text-primary-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-textMuted">
            &copy; {new Date().getFullYear()} Apex Athletics. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-textMuted">Secure Payments via Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
