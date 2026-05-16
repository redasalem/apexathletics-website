import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendApi from '../lib/axios';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'vendor' | 'admin';
  storeName?: string;
  storeDescription?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role?: 'customer' | 'vendor';
  storeName?: string;
  storeDescription?: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const { data } = await backendApi.get('/auth/me');
        return data.data as User;
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          queryClient.setQueryData(['auth'], null);
        }
        return null;
      }
    },
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401) return false;
      if (status && [500, 502, 503].includes(status) && failureCount < 2) return true;
      return false;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await backendApi.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.data);
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await backendApi.post('/auth/register', credentials);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.data);
    }
  });
};

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  storeName?: string;
  storeDescription?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const res = await backendApi.put('/users/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.data);
      toast.success('Profile updated successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await backendApi.post('/auth/logout');
    },
    onSuccess: () => {
      // Set auth to null and selectively invalidate user-related caches instead of clearing everything
      queryClient.setQueryData(['auth'], null);
      const keysToInvalidate = ['cart', 'wishlist', 'customerOrders', 'customerOrder', 'adminOrders', 'vendorOrders'];
      keysToInvalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success('Logged out successfully');
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await backendApi.post('/auth/forgotpassword', { email });
      return data as { success: boolean; message: string };
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const { data } = await backendApi.put(`/auth/resetpassword/${token}`, { password });
      return data as { success: boolean; message: string };
    }
  });
};
