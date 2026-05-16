import { Loader2 } from 'lucide-react';

export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold italic uppercase tracking-widest text-textMuted">Loading Product...</h2>
      </div>
    </div>
  );
}
