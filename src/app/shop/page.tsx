'use client';

import { Suspense, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product, usePublicProducts, useCategories } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Filter, X, Loader2, SearchX } from 'lucide-react';

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
    <div className="space-y-10">
      <div>
        <span className="ks-section-eyebrow mb-4">Category</span>
        {categoriesLoading ? (
          <div className="animate-pulse flex flex-col gap-3">
             {[1,2,3].map(i => <div key={i} className="h-6 bg-raised-lacquer rounded-[2px] w-full border border-gold-hairline"></div>)}
          </div>
        ) : (
          <div className="space-y-1.5">
            <button 
              onClick={() => updateFilters('category', '')}
              className={`block w-full text-left px-3 py-2 rounded-[2px] transition-colors font-medium text-[0.95rem] ${!selectedCategory ? 'text-lacquer-deep bg-kinpaku-gold border border-kinpaku-gold' : 'text-text-muted hover:text-champagne border border-transparent hover:border-gold-hairline bg-transparent'}`}
            >
              All Categories
            </button>
            {categories?.map((c) => (
               <button 
                key={c.slug}
                onClick={() => updateFilters('category', c.name)}
                className={`block w-full text-left px-3 py-2 rounded-[2px] transition-colors font-medium text-[0.95rem] ${selectedCategory === c.name ? 'text-lacquer-deep bg-kinpaku-gold border border-kinpaku-gold' : 'text-text-muted hover:text-champagne border border-transparent hover:border-gold-hairline bg-transparent'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <span className="ks-section-eyebrow mb-4">Price Range</span>
        <div className="flex items-center gap-3">
          <input 
             type="number" 
             placeholder="Min" 
             value={minPrice}
             onChange={(e) => updateFilters('minPrice', e.target.value)}
             className="input-field"
          />
          <span className="text-text-muted">-</span>
          <input 
             type="number" 
             placeholder="Max" 
             value={maxPrice}
             onChange={(e) => updateFilters('maxPrice', e.target.value)}
             className="input-field"
          />
        </div>
      </div>
      
      {(selectedCategory || minPrice || maxPrice) && (
        <button 
          onClick={clearFilters}
          className="text-[0.72rem] font-mono uppercase tracking-[0.22em] text-kinpaku-gold hover:text-champagne font-medium transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-lacquer-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
        <div className="flex items-end justify-between mb-10 border-b border-gold-hairline pb-6">
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-champagne leading-none">
            Shop <span className="text-kinpaku-gold">Collection</span>
          </h1>
          <button 
            className="md:hidden flex items-center gap-2 bg-lacquer-deep border border-gold-hairline hover:border-kinpaku-gold px-4 py-2 rounded-[2px] text-[0.8rem] font-medium text-kinpaku-gold transition-colors"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-[260px] flex-shrink-0">
            <FiltersBlock />
          </div>

          {/* Mobile Sidebar */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-lacquer-black/80 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-lacquer-deep border-l border-gold-hairline p-6 overflow-y-auto animate-in slide-in-from-right-full duration-300">
                <div className="flex justify-between items-center mb-8 border-b border-gold-hairline pb-4">
                  <span className="font-mono text-[0.8rem] uppercase tracking-[0.22em] text-kinpaku-gold">Filters</span>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 border border-transparent hover:border-gold-hairline rounded-[2px] text-text-muted hover:text-champagne transition-colors">
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
                   <div key={i} className="bg-raised-lacquer rounded-[4px] aspect-[3/4] animate-pulse border border-gold-hairline"></div>
                 ))}
              </div>
            ) : !products?.data || products.data.length === 0 ? (
              <div className="empty-state mt-4">
                 <div className="empty-state-icon">
                   <SearchX className="w-8 h-8" />
                 </div>
                 <h3 className="empty-state-title">No Products Found</h3>
                 <p className="empty-state-desc mb-6">Try adjusting your filters or category selection to see more gear.</p>
                 <button onClick={clearFilters} className="ks-button ks-button-secondary">
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
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-kinpaku-gold" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
