'use client';

import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/ProductCard';
import { Loader2, HeartCrack, Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

  if (wishlistLoading) {
    return (
      <div className="flex justify-center p-20 bg-lacquer-black min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-kinpaku-gold" />
      </div>
    );
  }

  return (
    <div className="bg-lacquer-black min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-10 border-b border-gold-hairline pb-6">
          <div className="p-3 border border-gold-hairline rounded-[2px] bg-lacquer-deep shrink-0">
            <Heart className="w-8 h-8 text-kinpaku-gold fill-kinpaku-gold/20" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wider text-champagne leading-none">
            Your <span className="text-kinpaku-gold">Wishlist</span>
          </h1>
        </div>

        {!wishlist?.items || wishlist.items.length === 0 ? (
          <div className="empty-state mt-10">
            <div className="empty-state-icon">
              <HeartCrack className="w-8 h-8" />
            </div>
            <h2 className="empty-state-title">Your wishlist is empty</h2>
            <p className="empty-state-desc mb-8">Discover our latest gear and save your favorites.</p>
            <Link href="/shop" className="ks-button ks-button-primary">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.items.map((item) => (
              <ProductCard key={item.productId._id} product={item.productId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
