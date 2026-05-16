'use client';

import { useState } from 'react';
import { useAddToCart } from '@/hooks/useCart';
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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
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
    <div className="space-y-6 mb-10">
      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3">Select Color</h4>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button 
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-pressed={selectedColor === color}
                className={`px-4 py-2 border rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${selectedColor === color ? 'bg-white text-black border-white' : 'bg-surface border-white/10 text-textMuted hover:border-white/30 hover:text-white'}`}
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
          <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3">Select Size</h4>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`min-w-[48px] px-3 py-2 border rounded-lg text-sm font-bold uppercase transition-all ${selectedSize === size ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20' : 'bg-surface border-white/10 text-textMuted hover:border-white/30 hover:text-white'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
         <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3">Quantity</h4>
         <div className="flex items-center gap-1 bg-surface border border-white/10 w-fit rounded-lg overflow-hidden">
           <button type="button" aria-label="Decrease quantity" className="px-3 py-2 text-textMuted hover:text-white transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
           <span className="font-bold text-white w-8 text-center">{quantity}</span>
           <button type="button" aria-label="Increase quantity" className="px-3 py-2 text-textMuted hover:text-white transition-colors" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
         </div>
      </div>

      <button 
        disabled={addToCartMutation.isPending || product.stock === 0}
        onClick={handleAddToCart}
        className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black uppercase italic tracking-widest shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8"
      >
        {addToCartMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart — $' + (product.price * quantity).toFixed(2)}
      </button>
    </div>
  );
}
