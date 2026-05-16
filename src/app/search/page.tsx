'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { data: products, isLoading, error } = useSearch(query);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[70vh]">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tight">
          Search Results
        </h1>
        <div className="flex items-center gap-2 text-textMuted font-bold uppercase tracking-widest text-sm">
          <span>Results for &quot;{query}&quot;</span>
          {products && <span className="bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded-md ml-2">{products.length} found</span>}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
          <p className="text-textMuted font-black uppercase tracking-widest text-xs">Scanning Gear...</p>
        </div>
      ) : error ? (
        <div className="py-24 text-center">
           <h2 className="text-2xl font-black uppercase italic text-white mb-4">Error Searching</h2>
           <p className="text-textMuted">Something went wrong. Please try again.</p>
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-textMuted" />
          </div>
          <h2 className="text-2xl font-black uppercase italic text-white mb-2">No gear found</h2>
          <p className="text-textMuted mb-8 max-w-sm">
            We couldn&apos;t find any products matching your search. Try different keywords or browse our shop.
          </p>
          <Link href="/shop" className="btn-primary px-8 flex items-center gap-2">
            Browse All Gear <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Suggested Categories if no results or just for discovery */}
      <div className="mt-24 border-t border-white/5 pt-12">
         <h3 className="text-sm font-black uppercase tracking-[0.2em] text-textMuted mb-8">Popular Gear Categories</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Sportswear', 'Athletic Shoes', 'Sports Equipment'].map(cat => (
              <Link 
                key={cat} 
                href={`/shop?category=${cat}`}
                className="group relative h-32 rounded-2xl overflow-hidden border border-white/10 hover:border-primary-500 transition-all"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-10" />
                 <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                    <span className="text-lg font-black italic uppercase text-white group-hover:text-primary-500 transition-colors">{cat}</span>
                 </div>
              </Link>
            ))}
         </div>
      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
