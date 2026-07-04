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
    e.stopPropagation();
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
    <div className="bg-raised-lacquer border border-gold-hairline rounded-[4px] overflow-hidden hover:border-gold-hairline-strong transition-colors group flex flex-col h-full relative">
      <div className="relative aspect-square overflow-hidden block flex-shrink-0 border-b border-gold-hairline">
        <Link href={`/product/${product._id}`} className="absolute inset-0 z-0 block" aria-label={`View ${product.title}`}>
          <OptimizedImage
            src={imageSrc}
            alt={product.title}
            fallback={getCategoryImage(product.category)}
            type="product"
            priority={false}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 mix-blend-luminosity hover:mix-blend-normal"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={wishlistPending}
          className="absolute top-3 left-3 z-10 p-2 bg-lacquer-deep/80 border border-gold-hairline backdrop-blur-md rounded-[2px] hover:border-kinpaku-gold transition-colors disabled:opacity-50"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-kinpaku-gold fill-kinpaku-gold' : 'text-champagne'} ${wishlistPending ? 'animate-pulse' : ''}`} />
        </button>

        {/* Sale Badge */}
        {product.discountPrice && product.discountPrice < product.price && (
          <div className="absolute top-3 right-3 z-10 bg-kinpaku-gold text-lacquer-deep font-bold text-[0.7rem] px-2.5 py-1 rounded-[2px] uppercase tracking-[0.18em] pointer-events-none">
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 bg-raised-lacquer">
        {/* Category & Star Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[0.72rem] font-mono text-text-muted uppercase tracking-[0.22em] truncate max-w-[55%]">{product.category}</span>
          <div className="flex items-center gap-1 flex-shrink-0" title={`${product.numReviews || 0} reviews`}>
            <Star className="w-3.5 h-3.5 text-kinpaku-gold fill-kinpaku-gold" />
            <span className="text-[0.72rem] font-mono text-champagne">{product.averageRating?.toFixed(1) || '0.0'}</span>
            {product.numReviews ? <span className="text-[0.72rem] font-mono text-text-muted">({product.numReviews})</span> : null}
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/${product._id}`}>
          <h4 className="font-medium text-champagne text-[1.18rem] mb-2 line-clamp-2 hover:text-kinpaku-gold transition-colors leading-[1.35]">{product.title}</h4>
        </Link>
        
        <div className="mt-auto pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gold-hairline">
          <div className="flex flex-col">
             {product.discountPrice ? (
                <>
                  <span className="text-[0.72rem] font-mono text-text-muted line-through">${product.price.toFixed(2)}</span>
                  <span className="text-xl font-mono font-medium text-champagne tracking-tight">${product.discountPrice.toFixed(2)}</span>
                </>
             ) : (
                <span className="text-xl font-mono font-medium text-champagne tracking-tight">${product.price.toFixed(2)}</span>
             )}
          </div>
          
          {/* Add to Cart Button */}
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            onClick={(e) => {
              e.preventDefault();
              if (onAddToCart) onAddToCart();
              else router.push(`/product/${product._id}`);
            }}
            className="flex items-center justify-center gap-2 border border-gold-hairline text-kinpaku-gold bg-transparent hover:bg-kinpaku-gold hover:text-lacquer-deep px-4 py-2 rounded-[2px] font-medium text-sm transition-colors w-full sm:w-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
