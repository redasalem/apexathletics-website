'use client';

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status && [401, 403, 404, 422, 429].includes(status)) return false;
  return failureCount < 1;
};

function AuthEventHandler({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData(['auth'], null);
      const keysToInvalidate = ['cart', 'wishlist', 'customerOrders', 'customerOrder', 'adminOrders', 'vendorOrders'];
      keysToInvalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }
  }, [queryClient]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
    },
  }));

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl || apiUrl.includes('localhost')) {
        console.error('Production warning: NEXT_PUBLIC_API_URL is not set to a non-localhost value. Verify environment variables.');
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthEventHandler>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#171717',
              color: '#fff',
              border: '1px solid #333333'
            }
          }} 
        />
        {children}
      </AuthEventHandler>
    </QueryClientProvider>
  );
}
