'use client';

import { usePublicVendors } from '@/hooks/useVendor';
import Link from 'next/link';
import { Store, Loader2, ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

export default function VendorsPage() {
  const { data: vendors, isLoading } = usePublicVendors();

  return (
    <div className="bg-lacquer-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-champagne mb-4 leading-none">
            Our <span className="text-kinpaku-gold">Sellers</span>
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            Discover premium gear from our curated community of independent sports vendors and athletes.
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-kinpaku-gold animate-spin" />
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {vendors.map((vendor) => (
              <Link 
                key={vendor._id}
                href={`/vendor/${vendor._id}`}
                className="group flex flex-col bg-raised-lacquer rounded-[4px] border border-gold-hairline overflow-hidden hover:border-kinpaku-gold transition-colors duration-300 shadow-panel"
              >
                <div className="relative aspect-video bg-lacquer-deep flex items-center justify-center p-6 border-b border-gold-hairline">
                  {vendor.storeLogo ? (
                    <OptimizedImage
                      src={vendor.storeLogo}
                      alt={vendor.storeName}
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Store className="w-16 h-16 text-kinpaku-gold opacity-50" />
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display text-2xl uppercase tracking-wider text-champagne mb-2 group-hover:text-kinpaku-gold transition-colors">
                    {vendor.storeName}
                  </h3>
                  <p className="text-text-muted text-sm line-clamp-3 mb-6 flex-grow">
                    {vendor.storeDescription || 'Premium sports vendor on Impeccable Athletics.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gold-hairline">
                    <span className="text-xs uppercase tracking-widest font-mono text-kinpaku-gold">
                      View Store
                    </span>
                    <ArrowRight className="w-4 h-4 text-kinpaku-gold transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state mt-10">
            <div className="empty-state-icon">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="empty-state-title">No sellers found</h2>
            <p className="empty-state-desc">Check back later for new premium sports vendors.</p>
          </div>
        )}
      </div>
    </div>
  );
}
