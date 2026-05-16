import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendApi from '../lib/axios';

export interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await backendApi.get(`/products/${productId}/reviews`);
      return data.data as Review[];
    },
    enabled: !!productId
  });
};

export const useAddReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) => {
      const { data } = await backendApi.post(`/products/${productId}/review`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['publicProduct', productId] });
    }
  });
};
