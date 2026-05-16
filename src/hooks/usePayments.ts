import { useMutation } from '@tanstack/react-query';
import backendApi from '../lib/axios';

export const useCheckoutSession = () => {
  return useMutation({
    mutationFn: async ({ orderId, couponCode }: { orderId: string; couponCode?: string }) => {
      const { data } = await backendApi.post('/payments/checkout', { orderId, couponCode });
      return data; // { success: true, url: string }
    }
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await backendApi.post('/coupons/validate', { code });
      return data.data as { code: string; discountPercentage: number };
    }
  });
};
