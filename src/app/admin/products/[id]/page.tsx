'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAdminProducts, useModerateProductStatus } from '@/hooks/useAdmin';
import { ChevronLeft, Loader2, User, Hash, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getCategoryImage } from '@/utils/images';

export default function AdminProductModerationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Quick fetch from cache. In a real app we'd have a specific get by ID query, 
  // but since adminProducts fetches all, we just filter it.
  const { data: products, isLoading } = useAdminProducts();
  const moderateStatus = useModerateProductStatus();

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>;
  if (!products) return null;

  const product = products.find((p) => p._id === id);
  if (!product) return <div className="p-8 text-center text-error bg-error/10 border border-error/20 mx-auto mt-10 rounded-xl max-w-2xl">Asset signature missing from platform index.</div>;

  const handleModeration = async (status: string) => {
    try {
      await moderateStatus.mutateAsync({ id, status });
      toast.success(`Platform scope enforced: Asset ${status}`);
    } catch {
      toast.error('Failed to commit moderation action');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <button onClick={() => router.back()} className="p-2 bg-surfaceHighlight hover:bg-border rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Asset Moderation
            <AlertTriangle className="w-6 h-6 text-warning" />
          </h1>
          <p className="text-xs text-textMuted font-mono mt-1">ID: {product._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl flex gap-6">
            <div className="relative w-32 h-32 bg-surfaceHighlight border border-border rounded-lg overflow-hidden flex-shrink-0">
               <Image 
                 src={product.images?.[0] || getCategoryImage(product.category)} 
                 alt={product.title} 
                 fill 
                 sizes="128px"
                 className="object-cover" 
               />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{product.title}</h2>
              <p className="text-xl font-bold text-primary-500 mb-4">${product.price.toFixed(2)}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-textMuted" />
                <span className="text-sm font-medium text-textMuted">Stock Tracking:</span>
                <span className="text-sm font-bold text-white">{product.stock} Units</span>
              </div>
              
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border pb-3">
                <User className="w-5 h-5 text-primary-500" /> Vendor Ownership Matrix
             </h3>
             <div className="pt-2">
               <p className="text-xs uppercase tracking-wider text-textMuted font-bold mb-1">Company / Name</p>
               <p className="text-white font-medium">{product.vendorId?.storeName || 'N/A'}</p>
               <p className="text-xs text-textMuted font-mono bg-background p-2 rounded mt-3 inline-block">ID: {product.vendorId?._id}</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl">
             <h3 className="text-lg font-bold text-white border-b border-border pb-3 mb-4">Platform Scope Control</h3>
             
             <div className="mb-6">
               <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-2">Current Status</p>
               <span className={`capitalize inline-block px-3 py-1.5 text-sm font-bold tracking-wide rounded border ${
                    product.status === 'active' ? 'bg-success/10 text-success border-success/20' :
                    product.status === 'archived' ? 'bg-error/10 text-error border-error/20' :
                    'bg-surfaceHighlight text-textMuted border-border'
                  }`}>
                  {product.status || 'draft'}
                </span>
             </div>

             <div className="space-y-3 pt-4 border-t border-border">
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-2">Execute Override</p>
                <button 
                  onClick={() => handleModeration('active')} 
                  disabled={moderateStatus.isPending || product.status === 'active'}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  Force Activate
                </button>
                <button 
                  onClick={() => handleModeration('archived')}
                  disabled={moderateStatus.isPending || product.status === 'archived'}
                  className="w-full bg-error text-white font-bold p-3 rounded-xl disabled:opacity-50 hover:bg-error/80 transition-colors"
                >
                  Archive Asset
                </button>
                <p className="text-xs text-textMuted leading-tight mt-3 text-center">Archived products are hidden from public searches and marketplace categories.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
