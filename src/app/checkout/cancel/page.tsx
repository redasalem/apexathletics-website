'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ShoppingBag, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-20 h-20 rounded-full bg-error/10 border border-error/20 flex items-center justify-center mb-6 animate-pulse">
        <XCircle className="w-10 h-10 text-error" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black italic uppercase text-white tracking-tight mb-3">
        Payment Cancelled
      </h1>

      <p className="text-textMuted max-w-md mb-8 leading-relaxed">
        Your payment process was cancelled or was not completed. Don’t worry — your cart items are safe, and no charges were made.
      </p>

      {orderId && (
        <div className="bg-card border border-border px-4 py-3 rounded-xl mb-8 font-mono text-xs text-textMuted">
          Order Reference: <span className="text-white font-bold">{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
        <Link
          href="/cart"
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white font-bold rounded-xl uppercase tracking-wider text-sm hover:bg-primaryHover transition-all shadow-lg shadow-primary/20"
        >
          <RefreshCw className="w-4 h-4" /> Return to Cart & Retry
        </Link>

        <Link
          href="/shop"
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-card border border-border text-textMuted hover:text-white font-bold rounded-xl uppercase tracking-wider text-sm hover:bg-cardHover transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center text-textMuted">
        Loading cancellation details...
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
