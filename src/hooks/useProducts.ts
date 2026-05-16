import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendApi from '../lib/axios';

export interface Product {
  _id: string;
  vendorId?: { _id: string; storeName: string } | string; // Populated from backend or string
  title: string;
  description: string;
  category: string;
  subcategory: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  SKU?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  material?: string;
  status: 'draft' | 'active' | 'archived' | 'out_of_stock';
  averageRating?: number;
  numReviews?: number;
  images: string[];
  vendor?: {
    _id: string;
    storeName: string;
    storeLogo?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['vendorProducts'],
    queryFn: async () => {
      const { data } = await backendApi.get('/vendors/products');
      return data.data as Product[];
    }
  });
};

/**
 * Private hook for Vendor Dashboard (manage specific product)
 */
export const useVendorProduct = (id: string) => {
  return useQuery({
    queryKey: ['vendorProduct', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      const { data } = await backendApi.get(`/vendors/products/${id}`);
      return data.data as Product;
    },
    enabled: !!id && id !== 'new'
  });
};

/**
 * Public hook for Customer Shop (view product details)
 */
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['publicProduct', id],
    queryFn: async () => {
      const { data } = await backendApi.get(`/products/${id}`);
      return data.data as Product;
    },
    enabled: !!id
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      const { data } = await backendApi.post('/vendors/products', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
    }
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      const { data } = await backendApi.put(`/vendors/products/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
      queryClient.invalidateQueries({ queryKey: ['vendorProduct', id] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await backendApi.delete(`/vendors/products/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProducts'] });
    }
  });
};

// --- CATEGORIES ---
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await backendApi.get('/products/categories');
      const categories = data.data as string[];
      return categories.map((name) => ({
        _id: name,
        name,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      })) as Category[];
    }
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Category>) => {
      const { data } = await backendApi.post('/categories', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Category>) => {
      const { data } = await backendApi.put(`/categories/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await backendApi.delete(`/categories/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const usePublicProducts = (filters: Record<string, string> = {}) => {
  return useQuery({
    queryKey: ['publicProducts', filters],
    queryFn: async () => {
      const { data } = await backendApi.get('/products', { params: filters });
      return data as PaginatedResponse<Product>;
    }
  });
};
