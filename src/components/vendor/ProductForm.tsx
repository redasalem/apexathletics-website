'use client';

import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateProduct, useUpdateProduct, Product } from '@/hooks/useProducts';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import backendApi from '@/lib/axios';
import Image from 'next/image';
import { getErrorMessage } from '@/utils/errors';

const productSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is too short'),
  category: z.enum(['Athletic Shoes', 'Sportswear', 'Sports Equipment']),
  subcategory: z.string().min(2, 'Subcategory is required'),
  brand: z.string().optional(),
  price: z.coerce.number().positive('Must be > 0'),
  discountPrice: z.coerce.number().nonnegative().optional().or(z.literal('')),
  stock: z.coerce.number().int().nonnegative('Cannot be negative'),
  SKU: z.string().optional(),
  tags: z.string().optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  material: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived', 'out_of_stock']).default('draft'),
});

type ProductFormData = z.infer<typeof productSchema>;
type ProductCategory = ProductFormData['category'];

const productCategories: ProductCategory[] = ['Athletic Shoes', 'Sportswear', 'Sports Equipment'];

const getProductCategory = (category?: string): ProductCategory => {
  return productCategories.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : 'Athletic Shoes';
};

interface Props {
  initialData?: Product;
}

export default function ProductForm({ initialData }: Props) {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(initialData?._id || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mountRef = useRef(true);

  useEffect(() => {
    mountRef.current = true;
    return () => {
      mountRef.current = false;
    };
  }, []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormData>,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: getProductCategory(initialData?.category),
      subcategory: initialData?.subcategory || '',
      brand: initialData?.brand || '',
      price: initialData?.price || 0,
      discountPrice: initialData?.discountPrice || '',
      stock: initialData?.stock || 0,
      SKU: initialData?.SKU || '',
      tags: initialData?.tags?.join(', ') || '',
      sizes: initialData?.sizes?.join(', ') || '',
      colors: initialData?.colors?.join(', ') || '',
      material: initialData?.material || '',
      status: initialData?.status || 'draft',
    }
  });

  const onSubmit = async (data: ProductFormData) => {
    if (isUploading) {
      toast.error('Please wait for image upload to finish before saving');
      return;
    }
    try {
      // Transform comma separated values
      const payload = {
        ...data,
        discountPrice: data.discountPrice === '' ? undefined : Number(data.discountPrice),
        tags: data.tags ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        sizes: data.sizes ? data.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: data.colors ? data.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
        images
      };

      if (initialData) {
        await updateProduct.mutateAsync(payload);
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(payload);
        toast.success('Product created successfully');
      }
      router.push('/vendor-dashboard/products');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Something went wrong'));
    }
  };

  const handleRealUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(false);

    let file: File | undefined;
    if ('files' in e.target && e.target.files?.[0]) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files?.[0]) {
      file = e.dataTransfer.files[0];
    }

    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      type UploadedResponse = { success: boolean; url: string };
      let attempt = 0;
      let uploaded: UploadedResponse | null = null;
      while (attempt < 2 && !uploaded) {
        try {
          const { data } = await backendApi.post<UploadedResponse>('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 0,
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || file.size;
              const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
              if (mountRef.current) setUploadProgress(percentCompleted);
            }
          });
          uploaded = data;
        } catch {
          attempt += 1;
          if (attempt >= 2) throw new Error('Upload failed after multiple attempts');
        }
      }

      if (uploaded?.success && mountRef.current) {
        setImages(prev => [...prev, uploaded.url]);
        toast.success('Image uploaded successfully');
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Upload failed'));
    } finally {
      if (mountRef.current) setIsUploading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface p-8 border border-border rounded-xl max-w-4xl">
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-textMuted text-sm mt-1">Manage hardware, clothes, and shoe listings.</p>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button 
            type="submit" 
            disabled={form.formState.isSubmitting || updateProduct.isPending || createProduct.isPending || isUploading}
            className="btn-primary"
          >
            {initialData ? 'Save Changes' : 'Publish Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">General Information</h3>
            <div>
              <label className="label">Product Title</label>
              <input {...form.register('title')} className="input-field" placeholder="Nike Air Max 2026" />
              {form.formState.errors.title && <p className="text-error text-sm mt-1">{form.formState.errors.title.message}</p>}
            </div>
            <div>
              <label className="label">Description</label>
              <textarea {...form.register('description')} rows={4} className="input-field" placeholder="Detailed product description..." />
              {form.formState.errors.description && <p className="text-error text-sm mt-1">{form.formState.errors.description.message}</p>}
            </div>
          </div>

          {/* Media Images */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-white">Media</h3>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsHoveringDrop(true); }}
              onDragLeave={() => setIsHoveringDrop(false)}
              onDrop={handleRealUpload}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${isHoveringDrop ? 'border-primary-500 bg-primary-500/10' : 'border-border bg-surfaceHighlight hover:border-primary-500'}`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="image/png,image/jpeg,image/webp" 
                onChange={handleRealUpload} 
              />
              {isUploading ? (
                <div className="w-full flex flex-col items-center max-w-xs mx-auto">
                  <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                  <div className="w-full bg-surface border border-border rounded-full h-2.5 mb-2">
                    <div className="bg-primary-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-sm font-medium text-white">{uploadProgress}% Uploading...</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-textMuted mb-2" />
                  <p className="text-sm font-medium text-white">Click or drag images to upload</p>
                  <p className="text-xs text-textMuted mt-1">High-quality PNG, JPG supported</p>
                </>
              )}
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-md overflow-hidden border border-border bg-surfaceHighlight aspect-square">
                    <Image src={img} alt={`Product image ${idx + 1}`} fill className="object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 bg-error text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-white">Variants & Materials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Sizes (comma separated)</label>
                <input {...form.register('sizes')} className="input-field" placeholder="S, M, L, XL or 10, 11, 12" />
              </div>
              <div>
                <label className="label">Colors (comma separated)</label>
                <input {...form.register('colors')} className="input-field" placeholder="Red, Blue, Green" />
              </div>
            </div>
            <div>
              <label className="label">Material</label>
              <input {...form.register('material')} className="input-field" placeholder="100% Cotton, Kevlar, etc." />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-surfaceHighlight p-5 rounded-lg border border-border space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Status & Organization</h3>
            <div>
              <label className="label">Status</label>
              <select {...form.register('status')} className="input-field cursor-pointer">
                <option value="draft">Draft (Hidden)</option>
                <option value="active">Active (Published)</option>
                <option value="archived">Archived</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            
            <div>
              <label className="label">Category</label>
              <select {...form.register('category')} className="input-field cursor-pointer">
                <option value="Athletic Shoes">Athletic Shoes</option>
                <option value="Sportswear">Sportswear</option>
                <option value="Sports Equipment">Sports Equipment</option>
              </select>
              {form.formState.errors.category && <p className="text-error text-sm mt-1">{form.formState.errors.category.message}</p>}
            </div>

            <div>
              <label className="label">Subcategory</label>
              <input {...form.register('subcategory')} className="input-field" placeholder="Running, Basketball..." />
              {form.formState.errors.subcategory && <p className="text-error text-sm mt-1">{form.formState.errors.subcategory.message}</p>}
            </div>

            <div>
              <label className="label">Brand</label>
              <input {...form.register('brand')} className="input-field" placeholder="Nike, Adidas..." />
            </div>
            
            <div>
              <label className="label">Tags (comma separated)</label>
              <input {...form.register('tags')} className="input-field" placeholder="summer, clearance" />
            </div>
          </div>

          <div className="bg-surfaceHighlight p-5 rounded-lg border border-border space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Pricing & Inventory</h3>
            <div>
              <label className="label">Price ($)</label>
              <input type="number" step="0.01" {...form.register('price')} className="input-field" />
              {form.formState.errors.price && <p className="text-error text-sm mt-1">{form.formState.errors.price.message}</p>}
            </div>

            <div>
              <label className="label">Discounted Price ($) (Optional)</label>
              <input type="number" step="0.01" {...form.register('discountPrice')} className="input-field" />
              {form.formState.errors.discountPrice && <p className="text-error text-sm mt-1">{form.formState.errors.discountPrice.message}</p>}
            </div>

            <div>
              <label className="label">Stock Quantity</label>
              <input type="number" {...form.register('stock')} className="input-field" />
              {form.formState.errors.stock && <p className="text-error text-sm mt-1">{form.formState.errors.stock.message}</p>}
            </div>

            <div>
              <label className="label">SKU</label>
              <input {...form.register('SKU')} className="input-field" placeholder="e.g. SH-001" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
