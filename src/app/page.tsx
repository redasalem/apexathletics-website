import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
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

export default async function Home() {
  const categories = await getCategories();
  const latestProducts = await getLatestProducts();

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
<h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-[0.9] tracking-tighter uppercase italic">
             Gear Up. <br />
             <span className="text-primary-500">Perform Better.</span>
           </h1>
          <p className="max-w-xl mx-auto text-textMuted text-lg md:text-xl mb-10">
            Shop thousands of products from verified vendors — athletic shoes, pro equipment, and performance apparel all in one place.
          </p>
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link href="/shop" className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 px-8 sm:px-10 py-4 sm:py-[1.125rem] rounded-xl font-black uppercase italic tracking-widest transition-all shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 min-h-[44px]">
                 Shop Now
              </Link>
              <Link href="/register" className="w-full sm:w-auto border border-white/15 hover:bg-white/5 hover:border-white/30 px-8 sm:px-10 py-4 sm:py-[1.125rem] rounded-xl font-black uppercase italic tracking-widest transition-all backdrop-blur-sm min-h-[44px]">
                 Create Account
              </Link>
           </div>
          <p className="mt-6 text-xs text-textMuted/60 uppercase tracking-widest">Trusted by 10,000+ athletes worldwide</p>
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
              <h3 className="text-4xl font-bold italic uppercase tracking-tight">Find Your <span className="text-primary-500">Sport</span></h3>
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
                      <span className="absolute bottom-5 left-6 text-white font-black italic uppercase tracking-tight text-2xl">{cat}</span>
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

      {/* Latest Arrivals Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-4xl font-black italic uppercase tracking-tight">Latest <span className="text-primary-500">Arrivals</span></h3>
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

      {/* Social Proof Banner */}
      <section className="py-16 border-t border-white/5 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Happy Athletes' },
              { value: '500+', label: 'Verified Vendors' },
              { value: '50K+', label: 'Products Listed' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-4xl font-black text-primary-500 italic">{stat.value}</p>
                <p className="text-xs text-textMuted uppercase tracking-widest font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
