'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import ProductCard from '@/components/ProductCard';
import { Loader2, ArrowRight, SearchX } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { data: products, isLoading, error } = useSearch(query);

  return (
    <div className="bg-lacquer-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
        
        {/* Header */}
        <div className="mb-12 border-b border-gold-hairline pb-6">
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-champagne leading-none mb-4">
            Search <span className="text-kinpaku-gold">Results</span>
          </h1>
          <div className="flex items-center gap-2 text-text-muted font-mono uppercase tracking-[0.22em] text-[0.8rem]">
            <span>Results for &quot;{query}&quot;</span>
            {products && <span className="bg-kinpaku-gold text-lacquer-deep px-2 py-0.5 rounded-[2px] ml-2 font-bold">{products.length} found</span>}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-kinpaku-gold" />
            <p className="font-mono text-text-muted uppercase tracking-[0.22em] text-[0.72rem]">Scanning Collection...</p>
          </div>
        ) : error ? (
          <div className="empty-state mt-10">
             <h2 className="empty-state-title">Error Searching</h2>
             <p className="empty-state-desc mb-6">Something went wrong. Please try again.</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state mt-10">
            <div className="empty-state-icon">
              <SearchX className="w-8 h-8" />
            </div>
            <h2 className="empty-state-title">No items found</h2>
            <p className="empty-state-desc mb-8 max-w-sm mx-auto">
              We couldn&apos;t find any items matching your search. Try different keywords or browse our collection.
            </p>
            <Link href="/shop" className="ks-button ks-button-primary inline-flex items-center gap-3">
              Browse Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Suggested Categories */}
        <div className="mt-24 border-t border-gold-hairline pt-16">
           <h3 className="ks-section-eyebrow mb-8">Popular Categories</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Sportswear', 'Athletic Shoes', 'Sports Equipment'].map(cat => (
                <Link 
                  key={cat} 
                  href={`/shop?category=${cat}`}
                  className="group block h-32 rounded-[2px] border border-gold-hairline hover:border-kinpaku-gold bg-raised-lacquer transition-all relative overflow-hidden"
                >
                   <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="font-display text-3xl uppercase tracking-widest text-champagne group-hover:text-kinpaku-gold transition-colors">{cat}</span>
                   </div>
                </Link>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-20 bg-lacquer-black min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-kinpaku-gold" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
