export const getSiteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://apexathletics-website.vercel.app').replace(/\/+$/, '');

export const getServerApiUrl = (): string => {
  const explicit = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (explicit && /^https?:\/\//i.test(explicit)) {
    return explicit.replace(/\/+$/, '');
  }
  return 'https://apexathletics-apis.vercel.app/api';
};

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  siteUrl: getSiteUrl(),
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
} as const;
