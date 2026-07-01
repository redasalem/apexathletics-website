import Link from 'next/link';
import { ShoppingBag, Star, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { getCategoryImage } from '@/utils/images';
import ProductCard from '@/components/ProductCard';
import OptimizedImage from '@/components/OptimizedImage';
import { Product } from '@/hooks/useProducts';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'https://apexathletics-apis.vercel.app/api';

async function getCategories() {
  try {
    const res = await fetch(`${API()}/products/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

async function getLatestProducts() {
  try {
    const res = await fetch(`${API()}/products?limit=4`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

async function getPlatformStats() {
  try {
    const [vendorsRes, productsRes] = await Promise.all([
      fetch(`${API()}/vendors`, { next: { revalidate: 3600 } }),
      fetch(`${API()}/products?limit=1`, { next: { revalidate: 3600 } }),
    ]);
    const vendors = vendorsRes.ok ? await vendorsRes.json() : { count: 0 };
    const products = productsRes.ok ? await productsRes.json() : { pagination: { totalItems: 0 } };
    return {
      vendorCount: vendors.count || 0,
      productCount: products.pagination?.totalItems || 0,
    };
  } catch { return { vendorCount: 0, productCount: 0 }; }
}

export default async function Home() {
  const categories = await getCategories();
  const latestProducts = await getLatestProducts();
  const stats = await getPlatformStats();

  return (
    <div className="bg-background min-h-screen text-white selection:bg-primary-500/30">
      {/* Trust Banner */}
      <div className="bg-primary-500/10 border-b border-primary-500/20 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-primary-400">
        🏆 Free Shipping on Orders Over $50 &nbsp;·&nbsp; 30-Day Returns &nbsp;·&nbsp; Authentic Gear Guaranteed
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <OptimizedImage
          src="/images/outdoor_gear.jpg"
          alt="Outdoor Gear"
          className="object-cover opacity-20 -z-20 pointer-events-none"
          priority
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-400 mb-8">
            <Star className="w-3.5 h-3.5" />
            New Season Gear Has Arrived
          </div>
          <h1 className="font-display text-7xl md:text-9xl mb-6 leading-[0.9] tracking-wider uppercase animate-fade-up">
            Gear Up. <br />
            <span className="text-primary-500">Perform Better.</span>
          </h1>
          <p className="max-w-xl mx-auto text-textMuted text-lg md:text-xl mb-10">
            Shop thousands of products from verified vendors — athletic shoes, pro equipment, and performance apparel all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/shop" className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 px-10 py-4 rounded-xl font-black uppercase italic tracking-widest transition-all shadow-glow-primary hover:shadow-[0_0_30px_rgba(216,0,0,0.4),0_0_80px_rgba(216,0,0,0.15)]">
                Shop Now
             </Link>
             <Link href="/register" className="w-full sm:w-auto border border-white/15 hover:bg-white/5 hover:border-white/30 px-10 py-4 rounded-xl font-black uppercase italic tracking-widest transition-all backdrop-blur-sm">
                Create Account
             </Link>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Categories Grid - Dynamic */}
      <section className="py-24 bg-surface/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary-500 mb-2">Shop by Category</h2>
              <h3 className="font-display text-5xl md:text-6xl tracking-wider uppercase">Find Your <span className="text-primary-500">Sport</span></h3>
            </div>
            <Link href="/register" className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-white transition-colors uppercase tracking-wider">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.map((cat: string, i: number) => {
                return (
                  <Link key={i} href={`/shop?category=${encodeURIComponent(cat)}`} className="group bg-surface border border-white/5 p-0 rounded-3xl hover:border-primary-500/50 overflow-hidden transition-all cursor-pointer block">
                    <div className="relative w-full h-52 overflow-hidden">
                      <OptimizedImage
                        src={getCategoryImage(cat)}
                        alt={cat}
                        fallback={getCategoryImage(cat)}
                        type="category"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-5 left-6 font-display text-3xl tracking-wider text-white uppercase">{cat}</span>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4">
                      <p className="text-textMuted text-sm font-medium">Explore collection</p>
                      <ArrowRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
        </div>
      </section>

      {/* Latest Arrivals Section — different background treatment */}
      <section className="py-24 relative overflow-hidden">
        {/* Subtle diagonal gradient instead of the same blur pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800/5 via-transparent to-primary-700/5 -z-10" />
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex items-center justify-between mb-12">
              <h3 className="font-display text-5xl md:text-6xl tracking-wider uppercase">Latest <span className="text-primary-500">Arrivals</span></h3>
              <Link href="/shop" className="text-primary-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 group">
                 View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {latestProducts?.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
             </div>
        </div>
      </section>

      {/* Platform Stats — real data from API, not fake numbers */}
      {(stats.vendorCount > 0 || stats.productCount > 0) && (
        <section className="py-16 border-t border-white/5 bg-surface/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              {stats.vendorCount > 0 && (
                <div className="space-y-1">
                  <p className="font-display text-5xl text-primary-500 tracking-wider">{stats.vendorCount}</p>
                  <p className="text-xs text-textMuted uppercase tracking-widest font-semibold">Active Vendors</p>
                </div>
              )}
              {stats.productCount > 0 && (
                <div className="space-y-1">
                  <p className="font-display text-5xl text-primary-500 tracking-wider">{stats.productCount}</p>
                  <p className="text-xs text-textMuted uppercase tracking-widest font-semibold">Products Listed</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="font-display text-5xl text-primary-500 tracking-wider">24/7</p>
                <p className="text-xs text-textMuted uppercase tracking-widest font-semibold">Vendor Support</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Apex — value props with different visual treatment */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-display text-4xl md:text-5xl tracking-wider uppercase text-center mb-14">Why <span className="text-primary-500">Apex</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface border border-border rounded-2xl p-8 text-center hover:border-primary-500/30 transition-colors group">
              <div className="inline-flex p-4 bg-primary-500/10 rounded-2xl mb-5 group-hover:bg-primary-500/20 transition-colors">
                <Shield className="w-7 h-7 text-primary-500" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Authentic Gear</h4>
              <p className="text-sm text-textMuted leading-relaxed">Every vendor is verified. Every product is genuine. Zero counterfeits, zero compromises.</p>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-8 text-center hover:border-primary-500/30 transition-colors group">
              <div className="inline-flex p-4 bg-primary-500/10 rounded-2xl mb-5 group-hover:bg-primary-500/20 transition-colors">
                <Truck className="w-7 h-7 text-primary-500" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Fast Shipping</h4>
              <p className="text-sm text-textMuted leading-relaxed">Free shipping on orders over $50. Most orders processed within 24 hours.</p>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-8 text-center hover:border-primary-500/30 transition-colors group">
              <div className="inline-flex p-4 bg-primary-500/10 rounded-2xl mb-5 group-hover:bg-primary-500/20 transition-colors">
                <RotateCcw className="w-7 h-7 text-primary-500" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Easy Returns</h4>
              <p className="text-sm text-textMuted leading-relaxed">30-day hassle-free returns on all purchases. Your satisfaction is guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — with working links */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                   <ShoppingBag className="w-5 h-5 text-primary-500" />
                </div>
                <span className="font-display text-2xl tracking-wider uppercase text-white">Apex Sports</span>
              </div>
              <p className="text-sm text-textMuted max-w-xs">The #1 multi-vendor marketplace for sports equipment, fitness tools, and outdoor gear.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
              <Link href="/privacy" className="text-textMuted hover:text-primary-500 transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="text-textMuted hover:text-primary-500 transition-colors">Contact Us</Link>
              <Link href="/terms" className="text-textMuted hover:text-primary-500 transition-colors">Terms of Service</Link>
              <Link href="/shipping" className="text-textMuted hover:text-primary-500 transition-colors">Shipping Policy</Link>
              <Link href="/register" className="text-textMuted hover:text-primary-500 transition-colors">Start Selling</Link>
              <Link href="/register" className="text-textMuted hover:text-primary-500 transition-colors">Create Account</Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-textMuted">&copy; {new Date().getFullYear()} Apex Marketplace Inc. All Rights Reserved.</p>
            <p className="text-xs text-textMuted">🔒 Secure Payments &nbsp;·&nbsp; ✅ 30-Day Returns &nbsp;·&nbsp; 🚚 Fast Shipping</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
