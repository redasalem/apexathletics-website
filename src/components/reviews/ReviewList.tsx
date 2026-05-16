'use client';

import { Star } from 'lucide-react';
import { Review } from '@/hooks/useReviews';
import { format } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-surface/30">
        <p className="text-textMuted font-bold uppercase tracking-widest text-sm">No reviews yet</p>
        <p className="text-xs text-textMuted mt-1 italic">Be the first to share your experience</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-white/5 pb-8 last:border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-xs border border-primary-500/20">
                {review.userId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{review.userId.name}</h4>
                <p className="text-[10px] text-textMuted uppercase font-black tracking-widest">
                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < review.rating ? 'fill-primary-500 text-primary-500' : 'text-white/10'}`} 
                />
              ))}
            </div>
          </div>
          <p className="text-textMuted text-sm leading-relaxed italic">
            &quot;{review.comment}&quot;
          </p>
        </div>
      ))}
    </div>
  );
}
