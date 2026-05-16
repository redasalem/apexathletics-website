import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendApi from '../lib/axios';

export interface PopulatedProduct {
  _id: string;
  title: string;
  images?: string[];
  category?: string;
}

export interface PopulatedCustomer {
  _id: string;
  name: string;
  email: string;
}

export interface OrderItem {
  _id: string;
  productId: PopulatedProduct; // Populated product
  vendorId: string;
  quantity: number;
  price: number;
  itemStatus: 'pending' | 'processing' | 'shipped' | 'cancelled';
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  comment?: string;
}

export interface Order {
  _id: string;
  customerId: PopulatedCustomer; // Populated user
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  globalOrderStatus: OrderStatus;
  statusHistory?: OrderStatusHistory[];
  createdAt: string;
}

// === CUSTOMER ===
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { shippingAddress: { street: string; city: string; zip: string; country: string }; paymentMethod: string }) => {
      const { data } = await backendApi.post('/orders/customer', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // Clear cart state
    }
  });
};

export const useCustomerOrders = () => {
  return useQuery({
    queryKey: ['customerOrders'],
    queryFn: async () => {
      const { data } = await backendApi.get('/orders/customer');
      return data.data as Order[];
    }
  });
};

export const useCustomerOrder = (id: string) => {
  return useQuery({
    queryKey: ['customerOrder', id],
    queryFn: async () => {
      const { data } = await backendApi.get(`/orders/customer/${id}`);
      return data.data as Order;
    },
    enabled: !!id
  });
};

// === VENDOR ===
export const useVendorOrders = () => {
  return useQuery({
    queryKey: ['vendorOrders'],
    queryFn: async () => {
      const { data } = await backendApi.get('/vendors/orders');
      return data.data as Order[];
    }
  });
};

export const useVendorOrder = (id: string) => {
  return useQuery({
    queryKey: ['vendorOrder', id],
    queryFn: async () => {
      const { data } = await backendApi.get(`/vendors/orders/${id}`);
      return data.data as Order;
    },
    enabled: !!id
  });
};

export const useUpdateVendorItemStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, itemId, status }: { orderId: string, itemId: string, status: string }) => {
      const { data } = await backendApi.put(`/vendors/orders/${orderId}/item/${itemId}/status`, { itemStatus: status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      queryClient.invalidateQueries({ queryKey: ['vendorOrder', variables.orderId] });
    }
  });
};

// === ADMIN ===
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const { data } = await backendApi.get('/orders/admin');
      return data.data as Order[];
    }
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['adminOrder', id],
    queryFn: async () => {
      const { data } = await backendApi.get(`/orders/admin/${id}`);
      return data.data as Order;
    },
    enabled: !!id
  });
};

export const useUpdateGlobalOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      const { data } = await backendApi.put(`/orders/admin/${orderId}/status`, { globalOrderStatus: status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrder', variables.orderId] });
    }
  });
};
