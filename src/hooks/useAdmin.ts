import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendApi from '../lib/axios';

// Interfaces mapping to backend outputs
export interface AdminStats {
  usersCount: number;
  vendorsCount: number;
  customersCount: number;
  productsCount: number;
  ordersCount: number;
  totalRevenue: number;
  salesTrend: { date: string, revenue: number }[];
}

export interface UserDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductDetail {
  _id: string;
  vendorId: { _id: string, storeName: string };
  title: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  images: string[];
  createdAt: string;
}

// Hooks
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await backendApi.get('/admin/stats');
      return data.data as AdminStats;
    }
  });
};

export const useAdminUsers = (role?: string) => {
  return useQuery({
    queryKey: ['adminUsers', role],
    queryFn: async () => {
      const url = role ? `/admin/users?role=${role}` : `/admin/users`;
      const { data } = await backendApi.get(url);
      return data.data as UserDetail[];
    }
  });
};

export const useAdminUserDetail = (id: string) => {
  return useQuery({
    queryKey: ['adminUserDetail', id],
    queryFn: async () => {
      const { data } = await backendApi.get(`/admin/users/${id}`);
      return data.data as UserDetail;
    },
    enabled: !!id
  });
};

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const { data } = await backendApi.get('/admin/products');
      return data.data as ProductDetail[];
    }
  });
};

export const useModerateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data } = await backendApi.put(`/admin/products/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    }
  });
};

export const useAdminSuspendVendor = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await backendApi.patch(`/admin/users/${id}/suspend`);
      return data;
    }
  });
};

export const useAdminBanCustomer = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await backendApi.patch(`/admin/users/${id}/ban`);
      return data;
    }
  });
};

export const useAdminForceReset = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await backendApi.post(`/admin/users/${id}/force-reset`);
      return data;
    }
  });
};
