import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendApi from '../lib/axios';
import { Product } from './useProducts';

export interface CartItem {
  _id: string; // The cart item ID
  productId: Product; // Populated from backend
  vendorId: string;
  quantity: number;
  priceSnapshot: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  _id: string;
  customerId: string;
  items: CartItem[];
}

export const useCart = (enabled = true) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await backendApi.get('/cart');
      return data.data as Cart;
    },
    enabled,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { productId: string; quantity: number; selectedSize?: string; selectedColor?: string }) => {
      const { data } = await backendApi.post('/cart', payload);
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const { data } = await backendApi.put(`/cart/${itemId}`, { quantity });
      return data;
    },
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<Cart>(['cart']);
      if (previousCart) {
        queryClient.setQueryData<Cart>(['cart'], {
          ...previousCart,
          items: previousCart.items.map(item =>
            item._id === itemId ? { ...item, quantity } : item
          ),
        });
      }
      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { data } = await backendApi.delete(`/cart/${itemId}`);
      return data;
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<Cart>(['cart']);
      if (previousCart) {
        queryClient.setQueryData<Cart>(['cart'], {
          ...previousCart,
          items: previousCart.items.filter(item => item._id !== itemId),
        });
      }
      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};
