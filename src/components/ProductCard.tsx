'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { WishlistItem, useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryImage } from '@/utils/images';
import OptimizedImage from './OptimizedImage';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    category: string;
    price: number;
    images?: string[];
    averageRating?: number;
    numReviews?: number;
    discountPrice?: number;
  };
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const imageSrc = product.images?.[0] || getCategoryImage(product.category);
  const { data: user } = useAuth();
  const isCustomer = user?.role === 'customer';
  const { data: wishlistData } = useWishlist(isCustomer);
  const { mutate: addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemoving } = useRemoveFromWishlist();

  const isWishlisted = wishlistData?.items?.some((item: WishlistItem) => item.productId?._id === product._id) || false;
  const wishlistPending = isAdding || isRemoving;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isCustomer) {
      toast.error('Please sign in as a customer to use wishlist');
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group flex flex-col h-full relative hover:shadow-lg hover:shadow-black/30">
      <Link href={`/product/${product._id}`} className="relative aspect-square overflow-hidden block flex-shrink-0">
        <OptimizedImage
          src={imageSrc}
          alt={product.title}
          fallback={getCategoryImage(product.category)}
          type="product"
          priority={false}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={wishlistPending}
          className="absolute top-3 left-3 z-10 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-primary-500 fill-primary-500' : 'text-white'} ${wishlistPending ? 'animate-pulse' : ''}`} />
        </button>

        {/* Sale Badge */}
        {product.discountPrice && product.discountPrice < product.price && (
          <div className="absolute top-3 right-3 z-10 bg-primary-500 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Category & Star Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-textMuted uppercase tracking-widest truncate max-w-[55%]">{product.category}</span>
          <div className="flex items-center gap-0.5 flex-shrink-0" title={`${product.numReviews || 0} reviews`}>
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="text-xs font-bold text-white ml-1">{product.averageRating?.toFixed(1) || '0.0'}</span>
            {product.numReviews ? <span className="text-[10px] text-textMuted ml-1">({product.numReviews})</span> : null}
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/${product._id}`}>
          <h4 className="font-bold text-white text-lg mb-2 line-clamp-2 hover:text-primary-500 transition-colors leading-tight">{product.title}</h4>
        </Link>
        
        <div className="mt-auto pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border">
          <div className="flex flex-col">
             {product.discountPrice ? (
                <>
                  <span className="text-xs text-textMuted line-through">${product.price.toFixed(2)}</span>
                  <span className="text-xl font-black italic text-primary-500 tracking-tight">${product.discountPrice.toFixed(2)}</span>
                </>
             ) : (
                <span className="text-xl font-black italic text-primary-500 tracking-tight">${product.price.toFixed(2)}</span>
             )}
          </div>
          
          {/* Red Add to Cart Button */}
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            onClick={(e) => {
              e.preventDefault();
              if (onAddToCart) onAddToCart();
              else router.push(`/product/${product._id}`);
            }}
            className="btn-primary px-4 py-2 text-sm w-full sm:w-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
