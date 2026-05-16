'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <AlertTriangle className="w-16 h-16 text-warning mb-6" />
      <h2 className="text-3xl font-black italic uppercase text-white mb-4">Admin Panel Error</h2>
      <p className="text-textMuted max-w-md mb-8">The admin dashboard encountered an error. Our team has been notified.</p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest transition-colors"
        >
          Try Again
        </button>
        <Link href="/admin" className="text-textMuted hover:text-white transition-colors uppercase tracking-widest font-bold">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
