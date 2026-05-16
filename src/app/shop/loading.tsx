import { Loader2 } from 'lucide-react';

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
      <h2 className="text-xl font-bold italic uppercase tracking-widest text-textMuted">Loading Catalog...</h2>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-surface border border-white/5 rounded-xl h-[400px] w-full" />
        ))}
      </div>
    </div>
  );
}
