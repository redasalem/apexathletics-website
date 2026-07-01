'use client';

import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/ProductCard';
import { Heart, Loader2, Search } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-kinpaku-gold" />
      </div>
    );
  }

  const items = wishlist?.items || [];

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gold-hairline">
        <h2 className="font-display text-4xl text-champagne uppercase tracking-wider mb-2">My <span className="text-kinpaku-gold">Wishlist</span></h2>
        <p className="text-text-muted text-[0.95rem]">Saved items you want to buy later.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-raised-lacquer border border-gold-hairline shadow-panel sm:rounded-[4px]">
          <div className="p-4 bg-lacquer-deep border border-gold-hairline rounded-full mb-6">
            <Heart className="w-8 h-8 text-kinpaku-gold" />
          </div>
          <h3 className="font-display text-3xl text-champagne uppercase tracking-wider mb-2">Your wishlist is empty</h3>
          <p className="text-text-muted max-w-sm mb-8 font-mono text-[0.9rem]">You haven&apos;t saved any items yet. Browse our shop to find gear you love.</p>
          <Link href="/shop" className="ks-button ks-button-primary px-8 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Explore Gear
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ProductCard key={item.productId._id} product={item.productId} />
          ))}
        </div>
      )}
    </div>
  );
}
