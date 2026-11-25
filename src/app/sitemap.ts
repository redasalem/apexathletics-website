import { MetadataRoute } from 'next';
import { getSiteUrl, getServerApiUrl } from '@/lib/config';

const BASE_URL = getSiteUrl();
const API_URL = getServerApiUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/vendors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/products?limit=1000`);
    if (res.ok) {
      const json = await res.json();
      const products = json.data || [];
      productPages = products.map((p: { _id: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/product/${p._id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch { /* Silently continue if API unavailable */ }

  // Dynamic vendor pages
  let vendorPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/vendors`);
    if (res.ok) {
      const json = await res.json();
      const vendors = json.data || [];
      vendorPages = vendors.map((v: { _id: string }) => ({
        url: `${BASE_URL}/vendor/${v._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch { /* Silently continue */ }

  return [...staticPages, ...productPages, ...vendorPages];
}
