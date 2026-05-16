'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'vendor' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { data: user, isLoading, isFetched, isError } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthorized = !!user && (!allowedRoles || allowedRoles.includes(user.role));

  useEffect(() => {
    if (isLoading || !isFetched) return;

    if (!user) {
      const retryMs = 2000;
      const timeout = setTimeout(() => {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }, isError ? retryMs : 0);
      return () => clearTimeout(timeout);
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'admin') router.replace('/admin');
      else if (user.role === 'vendor') router.replace('/vendor-dashboard');
      else router.replace('/account');
    }
  }, [user, isLoading, isFetched, isError, router, pathname, allowedRoles]);

  if (isLoading || !isFetched || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          {isError && (
            <p className="text-sm text-textMuted">Connection issue. Retrying...</p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
