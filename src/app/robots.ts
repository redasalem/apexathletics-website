import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexathletics.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/vendor-dashboard/', '/account/', '/cart', '/checkout'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
