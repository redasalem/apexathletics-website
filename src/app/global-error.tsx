'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="bg-bg font-sans text-textMain min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-card p-8 rounded-2xl border border-border shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-textMain">Something went wrong!</h2>
          <p className="text-textMuted mb-6">An unexpected error occurred. Our team has been notified.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primaryHover transition-all shadow-lg shadow-primary/25"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
