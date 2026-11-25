import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/config';

const BASE_URL = getSiteUrl();

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
