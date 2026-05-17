'use client';

import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/ProductCard';
import { Loader2, HeartCrack, Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

  if (wishlistLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight">
          Your <span className="text-primary-500">Wishlist</span>
        </h1>
      </div>

      {!wishlist?.items || wishlist.items.length === 0 ? (
        <div className="text-center py-24 bg-surface border border-border rounded-xl">
          <HeartCrack className="w-16 h-16 text-border mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-textMuted mb-6">Discover our latest gear and save your favorites.</p>
          <Link href="/shop" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Explore Products
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
  );
}
