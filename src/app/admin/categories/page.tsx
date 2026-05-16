'use client';

import { useCategories } from '@/hooks/useProducts';
import { Loader2, Tag as TagIcon, LayoutGrid } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-500" /></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Taxonomy Management</h2>
          <p className="text-textMuted">Review the product categories currently supported by the marketplace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories?.map((cat) => (
          <div key={cat._id} className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surfaceHighlight flex items-center justify-center text-primary-500">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white group-hover:text-primary-500 transition-colors uppercase tracking-tight italic">{cat.name}</h4>
                <p className="text-xs text-textMuted line-clamp-1">{cat.description || 'No description provided.'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <TagIcon className="w-12 h-12 text-textMuted/20 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-1">No Categories Found</h3>
          <p className="text-sm text-textMuted">Start by creating your first product category.</p>
        </div>
      )}
    </div>
  );
}
