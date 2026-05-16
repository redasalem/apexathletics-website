import { useQuery } from '@tanstack/react-query';
import backendApi from '../lib/axios';
import { Product } from './useProducts';

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const { data } = await backendApi.get('/products/search', {
        params: { q: query }
      });
      return (data.data || data) as Product[];
    },
    enabled: !!query && query.length >= 2
  });
};
