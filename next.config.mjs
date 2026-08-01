// --- Production env validation (warn if required public env vars missing) ---
const requiredPublicEnv = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_SITE_URL',
];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredPublicEnv.filter((k) => !process.env[k] || process.env[k].trim() === '');
  if (missing.length > 0) {
    const msg = `Missing required public environment variables: ${missing.join(', ')}. Set them in Vercel dashboard or .env for the build.`;
    console.warn('⚠️ ' + msg);
  }
}

import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
});
