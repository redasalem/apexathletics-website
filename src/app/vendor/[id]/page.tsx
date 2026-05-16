import { Store, Package, Calendar, Info } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { format } from 'date-fns';
import { Metadata } from 'next';
import Image from 'next/image';
import { Product } from '@/hooks/useProducts';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'https://apexathletics-apis.vercel.app/api';

async function getVendor(id: string) {
  try {
    const res = await fetch(`${API()}/vendors/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch { return null; }
}

async function getVendorProducts(vendorId: string) {
  try {
    const res = await fetch(`${API()}/products?vendorId=${vendorId}`, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] };
    const json = await res.json();
    return json;
  } catch { return { data: [] }; }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const vendor = await getVendor(params.id);
  if (!vendor) return { title: 'Vendor Not Found' };

  return {
    title: `${vendor.storeName} - Apex Athletics`,
    description: vendor.storeDescription,
  };
}

export default async function VendorStorefront({ params }: { params: { id: string } }) {
  const vendor = await getVendor(params.id);
  const products = await getVendorProducts(params.id);

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Vendor Not Found</h2>
        <p className="text-textMuted">The storefront you are looking for does not exist or has been deactivated.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="relative py-20 bg-surface border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-10 blur-3xl bg-primary-500 rounded-full -translate-y-1/2 w-[500px] h-[500px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-surfaceHighlight border-2 border-primary-500/20 flex items-center justify-center p-4 shadow-2xl relative">
              {vendor.storeLogo ? (
                <Image src={vendor.storeLogo} alt={vendor.storeName} width={160} height={160} className="max-w-full max-h-full object-contain rounded-2xl" />
              ) : (
                <Store className="w-16 h-16 text-primary-500" />
              )}
              <div className="absolute -bottom-4 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                Official Vendor
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase underline decoration-primary-500/30 decoration-8 underline-offset-8">
                {vendor.storeName}
              </h1>
              <p className="text-lg text-textMuted max-w-2xl font-medium leading-relaxed">
                {vendor.storeDescription}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white bg-surfaceHighlight px-4 py-2 rounded-xl border border-border">
                  <Package className="w-4 h-4 text-primary-500" />
                  {vendor.productCount} Products
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white bg-surfaceHighlight px-4 py-2 rounded-xl border border-border">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  Joined {format(new Date(vendor.createdAt), 'MMMM yyyy')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 italic">
            <Info className="w-6 h-6 text-primary-500" /> Collection
          </h2>
          <span className="text-sm font-medium text-textMuted uppercase tracking-widest">
            Showing all items by this vendor
          </span>
        </div>

        {products?.data && products.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.data.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-textMuted text-lg font-medium">This vendor hasn&apos;t uploaded any products yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
