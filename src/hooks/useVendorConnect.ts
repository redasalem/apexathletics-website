import { useQuery, useMutation } from '@tanstack/react-query';
import backendApi from '../lib/axios';

export const useVendorOnboarding = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await backendApi.post('/vendors/me/onboard');
      return data.url as string;
    }
  });
};

export const useVendorPayoutStatus = () => {
  return useQuery({
    queryKey: ['vendorPayoutStatus'],
    queryFn: async () => {
      const { data } = await backendApi.get('/vendors/me/payout-status');
      return data as { active: boolean; detailsSubmitted: boolean };
    }
  });
};

export const useVendorEarnings = () => {
  return useQuery({
    queryKey: ['vendorEarnings'],
    queryFn: async () => {
      const { data } = await backendApi.get('/vendors/me/earnings');
      return data.data as { availableBalance: number; totalEarnings: number; totalPlatformFees: number };
    }
  });
};

export const useVendorTransfers = () => {
  return useQuery({
    queryKey: ['vendorTransfers'],
    queryFn: async () => {
      const { data } = await backendApi.get('/vendors/me/transfers');
      return data.data as Array<{
        _id: string;
        orderId: string;
        amount: number;
        platformFee: number;
        status: string;
        createdAt: string;
      }>;
    }
  });
};
