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
    <div className="bg-lacquer-black min-h-screen">
      {/* Trust Banner */}
      <div className="bg-lacquer-deep border-b border-gold-hairline py-3 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-text-muted">
        🏆 Free Shipping on Orders Over $50 &nbsp;·&nbsp; 30-Day Returns &nbsp;·&nbsp; Authentic Gear Guaranteed
      </div>

      {/* Hero Section */}
      <section className="ks-section relative pt-24 pb-32 text-center border-b border-gold-hairline">
        <OptimizedImage
          src="/images/outdoor_gear.jpg"
          alt="Outdoor Gear"
          className="object-cover opacity-10 mix-blend-luminosity -z-20 pointer-events-none"
          priority
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-lacquer-deep border border-gold-hairline px-4 py-1.5 text-[0.7rem] font-mono font-medium uppercase tracking-[0.18em] text-kinpaku-gold mb-10">
            <Star className="w-3.5 h-3.5 text-kinpaku-gold" />
            New Season Gear
          </div>
          <h1 className="font-display text-6xl md:text-8xl lg:text-[7.5rem] mb-6 leading-[0.95] tracking-tight uppercase text-champagne">
            Gear Up.<br />
            <span className="text-kinpaku-gold">Perform Better.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-text-muted text-[1.18rem] mb-12 font-sans leading-[1.8]">
            Shop thousands of products from verified vendors — athletic shoes, pro equipment, and performance apparel all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/shop" className="ks-button ks-button-primary w-full sm:w-auto text-[1.18rem]">
                Shop Now
             </Link>
             <Link href="/register" className="ks-button ks-button-secondary w-full sm:w-auto text-[1.18rem]">
                Create Account
             </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="ks-section border-b border-gold-hairline">
        <div className="ks-section-head flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="ks-section-eyebrow">Shop by Category</span>
            <h2 className="text-champagne">Find Your <span className="text-kinpaku-gold">Sport</span></h2>
          </div>
          <Link href="/register" className="inline-flex items-center gap-2 text-[0.72rem] font-mono uppercase tracking-[0.22em] text-kinpaku-gold hover:text-champagne transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories?.map((cat: string, i: number) => {
              return (
                <Link key={i} href={`/shop?category=${encodeURIComponent(cat)}`} className="group bg-raised-lacquer border border-gold-hairline p-0 rounded-[4px] hover:border-gold-hairline-strong overflow-hidden transition-all block">
                  <div className="relative w-full h-[240px] overflow-hidden border-b border-gold-hairline">
                    <OptimizedImage
                      src={getCategoryImage(cat)}
                      alt={cat}
                      fallback={getCategoryImage(cat)}
                      type="category"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-lacquer-deep to-transparent" />
                    <span className="absolute bottom-6 left-6 font-display text-[2.6rem] tracking-tight text-champagne uppercase leading-none">{cat}</span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-5 bg-lacquer-deep">
                    <p className="text-text-muted text-[0.72rem] font-mono uppercase tracking-[0.22em]">Explore collection</p>
                    <ArrowRight className="w-4 h-4 text-kinpaku-gold group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
      </section>

      {/* Latest Arrivals Section */}
      <section className="ks-section border-b border-gold-hairline">
        <div className="ks-section-head flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
             <span className="ks-section-eyebrow">New In</span>
             <h2 className="text-champagne">Latest <span className="text-kinpaku-gold">Arrivals</span></h2>
           </div>
           <Link href="/shop" className="inline-flex items-center gap-2 text-[0.72rem] font-mono uppercase tracking-[0.22em] text-kinpaku-gold hover:text-champagne transition-colors">
              View All <ArrowRight className="w-4 h-4" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {latestProducts?.map((product: Product) => (
             <ProductCard key={product._id} product={product} />
           ))}
        </div>
      </section>

      {/* Platform Stats */}
      {(stats.vendorCount > 0 || stats.productCount > 0) && (
        <section className="py-20 border-b border-gold-hairline bg-lacquer-deep">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center divide-x divide-gold-hairline">
              {stats.vendorCount > 0 && (
                <div className="space-y-2">
                  <p className="font-display text-[4rem] md:text-[5rem] leading-none text-kinpaku-gold tracking-tight">{stats.vendorCount}</p>
                  <p className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-text-muted">Active Vendors</p>
                </div>
              )}
              {stats.productCount > 0 && (
                <div className="space-y-2">
                  <p className="font-display text-[4rem] md:text-[5rem] leading-none text-kinpaku-gold tracking-tight">{stats.productCount}</p>
                  <p className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-text-muted">Products Listed</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="font-display text-[4rem] md:text-[5rem] leading-none text-kinpaku-gold tracking-tight">24/7</p>
                <p className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-text-muted">Vendor Support</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Apex */}
      <section className="ks-section">
        <div className="ks-section-head text-center">
          <span className="ks-section-eyebrow mx-auto">Value</span>
          <h2 className="text-champagne">Why <span className="text-kinpaku-gold">Impeccable</span></h2>
        </div>
        
        <div className="ks-bento">
          <div className="ks-bento-tile ks-bento-tile--span-4 group text-center">
            <div className="inline-flex p-4 border border-gold-hairline rounded-[2px] mb-6 bg-lacquer-deep group-hover:border-kinpaku-gold transition-colors">
              <Shield className="w-6 h-6 text-kinpaku-gold" />
            </div>
            <h4 className="font-medium text-champagne text-[1.18rem] mb-3">Authentic Gear</h4>
            <p className="text-sm text-text-muted leading-[1.8]">Every vendor is verified. Every product is genuine. Zero counterfeits, zero compromises.</p>
          </div>
          <div className="ks-bento-tile ks-bento-tile--span-4 group text-center">
            <div className="inline-flex p-4 border border-gold-hairline rounded-[2px] mb-6 bg-lacquer-deep group-hover:border-kinpaku-gold transition-colors">
              <Truck className="w-6 h-6 text-kinpaku-gold" />
            </div>
            <h4 className="font-medium text-champagne text-[1.18rem] mb-3">Fast Shipping</h4>
            <p className="text-sm text-text-muted leading-[1.8]">Free shipping on orders over $50. Most orders processed within 24 hours.</p>
          </div>
          <div className="ks-bento-tile ks-bento-tile--span-4 group text-center">
            <div className="inline-flex p-4 border border-gold-hairline rounded-[2px] mb-6 bg-lacquer-deep group-hover:border-kinpaku-gold transition-colors">
              <RotateCcw className="w-6 h-6 text-kinpaku-gold" />
            </div>
            <h4 className="font-medium text-champagne text-[1.18rem] mb-3">Easy Returns</h4>
            <p className="text-sm text-text-muted leading-[1.8]">30-day hassle-free returns on all purchases. Your satisfaction is guaranteed.</p>
          </div>
        </div>
      </section>

      {/* Note: Footer was removed from here because it's already rendered globally by Layout.tsx */}
    </div>
  );
}
