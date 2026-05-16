'use client';

import { useAdminProducts } from '@/hooks/useAdmin';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryImage } from '@/utils/images';

export default function AdminProductsPage() {
  const { data: products, isLoading, isError } = useAdminProducts();

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (isError || !products) return <div className="text-center text-error">Failed to pull product index</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-primary-500" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Global Products Content</h2>
          <p className="text-textMuted mt-1">Regulate and monitor all active catalog assets</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surfaceHighlight border-b border-border text-xs uppercase tracking-wider text-textMuted font-medium">
              <th className="p-4 rounded-tl-xl text-center w-20">Media</th>
              <th className="p-4">SKU Title</th>
              <th className="p-4">Vendor Ownership</th>
              <th className="p-4">Pricing</th>
              <th className="p-4">System Status</th>
              <th className="p-4 text-right rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                <td className="p-4">
                  <div className="relative w-12 h-12 bg-surfaceHighlight border border-border rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={product.images?.[0] || getCategoryImage(product.category)} 
                      alt={product.title || 'Product'} 
                      fill 
                      sizes="48px"
                      className="object-cover" 
                    />
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-white truncate max-w-[200px]">{product.title}</p>
                </td>
                <td className="p-4">
                  <p className="text-white text-xs">{typeof product.vendorId === 'object' ? product.vendorId.storeName : 'Orphaned'}</p>
                  {typeof product.vendorId === 'object' && (
                    <p className="text-textMuted text-xs mt-0.5">ID: {product.vendorId._id}</p>
                  )}
                </td>
                <td className="p-4 text-white font-semibold">
                  ${product.price?.toFixed(2)}
                </td>
                <td className="p-4">
                  <span className={`capitalize inline-block px-2.5 py-1 text-[10px] font-bold tracking-wide rounded border ${
                    product.status === 'active' ? 'bg-success/10 text-success border-success/20' :
                    product.status === 'archived' ? 'bg-error/10 text-error border-error/20' :
                    'bg-surfaceHighlight text-textMuted border-border'
                  }`}>
                    {product.status || 'draft'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/admin/products/${product._id}`}
                    className="inline-flex items-center btn-secondary py-1 text-xs font-medium"
                  >
                    Moderate <ChevronRight className="w-4 h-4 ml-1 opacity-50" />
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-textMuted">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
