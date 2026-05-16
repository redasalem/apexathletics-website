// --- Production env validation (fail build if required public env vars missing) ---
const requiredPublicEnv = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_SITE_URL',
];

if (process.env.NODE_ENV === 'production' && process.env.npm_lifecycle_event !== 'lint') {
  const missing = requiredPublicEnv.filter((k) => !process.env[k] || process.env[k].trim() === '');
  if (missing.length > 0) {
    throw new Error(
      `Missing required public environment variables for production build: ${missing.join(', ')}. ` +
        `Set them in your deployment environment (Vercel environment variables) or .env for the build.`
    );
  }
}

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

export default nextConfig;
