'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/components/vendor/ProductForm';
import { useVendorProduct } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading, isError } = useVendorProduct(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-error/10 text-error p-4 rounded-md border border-error/20 max-w-4xl mx-auto">
        Unable to load product. It may have been deleted or you do not have permission to view it.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProductForm initialData={product} />
    </div>
  );
}
