import { Loader2 } from 'lucide-react';

export default function AccountLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
      <p className="text-sm font-bold uppercase tracking-widest text-textMuted">Loading Account Data...</p>
    </div>
  );
}
