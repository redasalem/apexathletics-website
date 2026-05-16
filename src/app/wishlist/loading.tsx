import { Loader2 } from 'lucide-react';

export default function WishlistLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
      <h2 className="text-xl font-bold italic uppercase tracking-widest text-textMuted">Loading Wishlist...</h2>
    </div>
  );
}
