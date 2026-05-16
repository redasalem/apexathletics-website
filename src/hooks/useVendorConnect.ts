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
