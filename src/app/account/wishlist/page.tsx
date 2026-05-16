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
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const items = wishlist?.items || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">My Wishlist</h2>
        <p className="text-textMuted">Saved items you want to buy later.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-background/50">
          <div className="p-4 bg-primary-500/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
          <p className="text-textMuted max-w-sm mb-6">You haven&apos;t saved any items yet. Browse our shop to find gear you love.</p>
          <Link href="/shop" className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">
            <Search className="w-5 h-5" />
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
