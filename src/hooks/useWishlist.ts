import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendApi from '../lib/axios';
import { Product } from './useProducts';

export interface WishlistItem {
  productId: Product;
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  customerId: string;
  items: WishlistItem[];
}

export const useWishlist = (enabled = true) => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await backendApi.get('/wishlist');
      return data.data as Wishlist;
    },
    enabled,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await backendApi.post('/wishlist', { productId });
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await backendApi.delete(`/wishlist/${productId}`);
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });
};
