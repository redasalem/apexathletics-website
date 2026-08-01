'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing from the link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data?.message || 'Email verified successfully!');
      } catch (err: unknown) {
        const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Invalid or expired verification token.';
        setStatus('error');
        setMessage(errorMsg);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-xl">
        {status === 'loading' && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying Your Email</h2>
            <p className="text-textMuted text-sm">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-textMuted text-sm mb-6">{message}</p>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white font-bold rounded-xl uppercase tracking-wider text-sm hover:bg-primaryHover transition-all"
            >
              Continue to Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-textMuted text-sm mb-6">{message}</p>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-card border border-border text-white font-bold rounded-xl uppercase tracking-wider text-sm hover:bg-cardHover transition-all"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center text-textMuted">
        Loading verification...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
