'use client';

import { Suspense, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product, usePublicProducts, useCategories } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Filter, X, Loader2 } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parse filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const filters = {
    ...(selectedCategory && { category: selectedCategory }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
  };

  const { data: products, isLoading: productsLoading } = usePublicProducts(filters);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === 'minPrice' || key === 'maxPrice') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        router.push(`${pathname}?${params.toString()}`);
      }, 500);
    } else {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  const clearFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.replace(pathname);
  };

  const FiltersBlock = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black uppercase italic tracking-widest mb-4">Category</h3>
        {categoriesLoading ? (
          <div className="animate-pulse flex flex-col gap-3">
             {[1,2,3].map(i => <div key={i} className="h-4 bg-white/5 rounded w-full"></div>)}
          </div>
        ) : (
          <div className="space-y-2">
            <button 
              onClick={() => updateFilters('category', '')}
              className={`block w-full text-left px-2 py-1 rounded transition-colors ${!selectedCategory ? 'text-primary-500 font-bold bg-primary-500/10' : 'text-textMuted hover:text-white'}`}
            >
              All Categories
            </button>
            {categories?.map((c) => (
               <button 
                key={c.slug}
                onClick={() => updateFilters('category', c.name)}
                className={`block w-full text-left px-2 py-1 rounded transition-colors ${selectedCategory === c.name ? 'text-primary-500 font-bold bg-primary-500/10' : 'text-textMuted hover:text-white'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-black uppercase italic tracking-widest mb-4">Price Range</h3>
        <div className="flex items-center gap-2">
          <input 
             type="number" 
             placeholder="Min" 
             value={minPrice}
             onChange={(e) => updateFilters('minPrice', e.target.value)}
             className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-500 text-white placeholder-textMuted/50"
          />
          <span className="text-textMuted">-</span>
          <input 
             type="number" 
             placeholder="Max" 
             value={maxPrice}
             onChange={(e) => updateFilters('maxPrice', e.target.value)}
             className="w-full bg-surface border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-500 text-white placeholder-textMuted/50"
          />
        </div>
      </div>
      
      {(selectedCategory || minPrice || maxPrice) && (
        <button 
          onClick={clearFilters}
          className="text-xs uppercase tracking-widest text-primary-500 hover:text-primary-400 font-bold"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight">
          Shop <span className="text-primary-500">Gear</span>
        </h1>
        <button 
          className="md:hidden flex items-center gap-2 bg-surface border border-white/10 px-4 py-2 rounded-xl text-sm font-bold"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FiltersBlock />
        </div>

        {/* Mobile Sidebar */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-background border-l border-white/5 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black italic uppercase tracking-widest">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-white/5 rounded-full text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FiltersBlock />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="bg-surface rounded-xl aspect-[3/4] animate-pulse border border-white/5"></div>
               ))}
            </div>
          ) : !products?.data || products.data.length === 0 ? (
            <div className="py-20 text-center border border-white/5 rounded-3xl bg-surface/30">
               <h3 className="text-2xl font-black italic uppercase text-white mb-2">No Products Found</h3>
               <p className="text-textMuted max-w-sm mx-auto">Try adjusting your filters or category selection to see more gear.</p>
               <button onClick={clearFilters} className="mt-6 btn-primary px-6 py-2 uppercase tracking-widest text-sm">
                  Clear Filters
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.data.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
