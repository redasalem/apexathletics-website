'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <AlertCircle className="w-16 h-16 text-warning mb-6" />
      <h2 className="text-3xl font-black italic uppercase text-white mb-4">Oops! Something went wrong!</h2>
      <p className="text-textMuted max-w-md mb-8">We couldn&apos;t load the catalog. This might be a temporary network issue or a server error.</p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest transition-colors"
        >
          Try Again
        </button>
        <Link href="/" className="text-textMuted hover:text-white transition-colors uppercase tracking-widest font-bold">
          Go Home
        </Link>
      </div>
    </div>
  );
}
