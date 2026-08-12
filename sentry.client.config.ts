import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: false,
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Network Error',
    'Object Not Found Matching Id',
    'antifingerprint',
    'Non-Error promise rejection captured with value',
  ],
});
