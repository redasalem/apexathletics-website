'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { Plus, Edit2, Trash2, Loader2, PackageOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCategoryImage } from '@/utils/images';

export default function VendorProductsPage() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success('Product deleted strictly');
      } catch {
        toast.error('Failed to delete product');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Products</h2>
          <p className="text-textMuted mt-1">Manage your storefront inventory</p>
        </div>
        <Link href="/vendor-dashboard/products/new" className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      {(!products || products.length === 0) ? (
        <div className="border border-border bg-surface rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-surfaceHighlight p-4 rounded-full mb-4">
            <PackageOpen className="w-10 h-10 text-primary-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
          <p className="text-textMuted max-w-md mx-auto mb-6">You haven&apos;t added any athletic gear to your store yet. Start selling by creating your first product.</p>
          <Link href="/vendor-dashboard/products/new" className="btn-primary">
            Create Product
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surfaceHighlight border-b border-border text-sm text-textMuted font-medium">
                <th className="p-4 rounded-tl-xl min-w-[300px]">Product / SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-surfaceHighlight border border-border rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={product.images?.[0] || getCategoryImage(product.category)} 
                          alt={product.title} 
                          fill 
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{product.title}</p>
                        <p className="text-xs text-textMuted">{product.SKU || 'No SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-textMuted">{product.category}</td>
                  <td className="p-4">
                    <p className="font-medium text-white">${product.price.toFixed(2)}</p>
                    {product.discountPrice && (
                      <p className="text-xs text-primary-500 line-through">${product.discountPrice.toFixed(2)}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      product.stock > 10 
                      ? 'bg-success/10 text-success border-success/20' 
                      : product.stock > 0 
                      ? 'bg-warning/10 text-warning border-warning/20' 
                      : 'bg-error/10 text-error border-error/20'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`capitalize inline-block px-2 py-1 text-xs rounded-md ${
                      product.status === 'active' ? 'bg-primary-500/20 text-primary-500' : 
                      product.status === 'draft' ? 'bg-surfaceHighlight text-textMuted' :
                      'bg-error/10 text-error'
                    }`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/vendor-dashboard/products/${product._id}/edit`}
                        className="p-2 text-textMuted hover:text-white hover:bg-surfaceHighlight rounded-md transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id, product.title)}
                        className="p-2 text-textMuted hover:text-error hover:bg-error/10 rounded-md transition-colors"
                        title="Delete Product"
                        disabled={deleteProduct.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
