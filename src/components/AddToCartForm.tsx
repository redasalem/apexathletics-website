'use client';

import { useState } from 'react';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';

interface AddToCartFormProps {
  product: {
    _id: string;
    stock: number;
    price: number;
    colors?: string[];
    sizes?: string[];
  };
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const addToCartMutation = useAddToCart();
  const { data: user } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 500);
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCartMutation.mutate(
      { 
        productId: product._id, 
        quantity, 
        selectedSize: selectedSize || undefined, 
        selectedColor: selectedColor || undefined 
      },
      {
        onSuccess: () => {
          toast.success('Added to cart!');
        },
        onError: (err: unknown) => {
          const errorMessage = getErrorMessage(err, 'Failed to add to cart');
          toast.error(errorMessage);
        }
      }
    );
  };

  return (
    <div className="space-y-8 mb-10">
      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h4 className="ks-section-eyebrow !mb-3">Select Color</h4>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button 
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-pressed={selectedColor === color}
                className={`px-4 py-2 border rounded-[2px] text-[0.8rem] font-mono uppercase tracking-[0.1em] transition-all ${selectedColor === color ? 'bg-kinpaku-gold text-lacquer-deep border-kinpaku-gold font-bold' : 'bg-lacquer-deep border-gold-hairline text-text-muted hover:border-kinpaku-gold hover:text-champagne font-medium'}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h4 className="ks-section-eyebrow !mb-3">Select Size</h4>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`min-w-[48px] px-3 py-2 border rounded-[2px] text-[0.8rem] font-mono uppercase tracking-[0.1em] transition-all ${selectedSize === size ? 'bg-kinpaku-gold text-lacquer-deep border-kinpaku-gold font-bold' : 'bg-lacquer-deep border-gold-hairline text-text-muted hover:border-kinpaku-gold hover:text-champagne font-medium'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
         <h4 className="ks-section-eyebrow !mb-3">Quantity</h4>
         <div className="flex items-center gap-1 bg-lacquer-deep border border-gold-hairline w-fit rounded-[2px] overflow-hidden">
           <button type="button" aria-label="Decrease quantity" className="px-4 py-2 text-text-muted hover:text-champagne transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
           <span className="font-mono font-medium text-champagne w-8 text-center">{quantity}</span>
           <button type="button" aria-label="Increase quantity" className="px-4 py-2 text-text-muted hover:text-champagne transition-colors" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
         </div>
      </div>

      <button 
        disabled={addToCartMutation.isPending || product.stock === 0}
        onClick={handleAddToCart}
        className="ks-button ks-button-primary w-full text-[1.18rem] mt-8 flex items-center justify-center gap-3"
      >
        {addToCartMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin text-lacquer-deep" /> : <ShoppingCart className="w-5 h-5" />}
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart — $' + (product.price * quantity).toFixed(2)}
      </button>
    </div>
  );
}
