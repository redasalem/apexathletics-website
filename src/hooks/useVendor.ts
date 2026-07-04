import { useQuery } from '@tanstack/react-query';
import backendApi from '../lib/axios';

export interface VendorStats {
  productsCount: number;
  totalOrders: number;
  totalRevenue: number;
  salesTrend: { date: string, revenue: number }[];
}

export interface PublicVendor {
  _id: string;
  storeName: string;
  storeDescription: string;
  storeLogo?: string;
  createdAt: string;
  productCount: number;
}

/**
 * Get private statistics for the Vendor Dashboard
 */
export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendorStats'],
    queryFn: async () => {
      const { data } = await backendApi.get('/vendors/me/stats');
      return data.data as VendorStats;
    }
  });
};

/**
 * Get a list of all public vendors
 */
export const usePublicVendors = () => {
  return useQuery({
    queryKey: ['publicVendors'],
    queryFn: async () => {
      const { data } = await backendApi.get('/vendors');
      return data.data as PublicVendor[];
    }
  });
};

/**
 * Get a public profile of a vendor
 */
export const usePublicVendor = (id: string) => {
  return useQuery({
    queryKey: ['publicVendor', id],
    queryFn: async () => {
      const { data } = await backendApi.get(`/vendors/${id}`);
      return data.data as PublicVendor;
    },
    enabled: !!id
  });
};
