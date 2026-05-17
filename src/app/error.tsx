'use client';

import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-background text-textMain min-h-screen flex flex-col items-center justify-center text-center px-6">
        <AlertTriangle className="w-16 h-16 text-warning mb-6" />
        <h2 className="text-3xl font-black italic uppercase text-white mb-4">Something Went Wrong</h2>
        <p className="text-textMuted max-w-md mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => reset()}
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest transition-colors"
          >
            Try Again
          </button>
          <a href="/" className="text-textMuted hover:text-white transition-colors uppercase tracking-widest font-bold">
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
