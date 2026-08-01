'use client';

import * as Sentry from '@sentry/nextjs';

export default function SentryExamplePage() {
  return (
    <div className="min-h-screen bg-bg text-textMain flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-textMain">Sentry Frontend Test Page</h1>
        <p className="text-textMuted mb-6 text-sm">
          Click the button below to trigger a test client-side exception for Sentry verification.
        </p>
        <button
          onClick={() => {
            throw new Error('Sentry Frontend Production Verification Test Error');
          }}
          className="w-full px-6 py-3 bg-error text-white font-medium rounded-xl hover:bg-error/90 transition-all shadow-lg shadow-error/20"
        >
          Trigger Test Error
        </button>
      </div>
    </div>
  );
}
