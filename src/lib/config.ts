export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://apexathletics-apis.vercel.app/api',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://apexathletics.vercel.app',
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
} as const;
