'use client';

import { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { useAddReview } from '@/hooks/useReviews';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState<number>(0);
  
  const addReviewMutation = useAddReview(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }

    addReviewMutation.mutate(
      { rating, comment },
      {
        onSuccess: () => {
          toast.success('Thank you for your review!');
          setRating(0);
          setComment('');
        },
        onError: (err: unknown) => {
          toast.error(getErrorMessage(err, 'Failed to submit review'));
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface/50 border border-white/5 p-6 rounded-2xl">
      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Leave a Review</h3>
      
      {/* Star Selector */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform active:scale-90"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star 
              className={`w-6 h-6 transition-colors ${
                star <= (hover || rating) 
                  ? 'fill-primary-500 text-primary-500' 
                  : 'text-white/10'
              }`} 
            />
          </button>
        ))}
        <span className="ml-2 text-xs font-bold text-textMuted uppercase tracking-widest">
          {rating > 0 ? `${rating} / 5 Stars` : 'Select Rating'}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this gear..."
        className="w-full bg-background border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-textMuted focus:outline-none focus:border-primary-500 transition-all min-h-[120px] mb-6"
      />

      <button
        type="submit"
        disabled={addReviewMutation.isPending}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        {addReviewMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Submit Review
      </button>

      <p className="mt-4 text-[10px] text-textMuted text-center font-bold uppercase tracking-widest italic">
        * Reviews can only be submitted by verified purchasers
      </p>
    </form>
  );
}
