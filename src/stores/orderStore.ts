import { create } from 'zustand';
import type { Order } from '../types';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  filter: 'all' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  setFilter: (filter: OrderState['filter']) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getFilteredOrders: () => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  filter: 'all',
  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setFilter: (filter) => set({ filter }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
      ),
    })),
  getFilteredOrders: () => {
    const { orders, filter } = get();
    if (filter === 'all') return orders;
    return orders.filter((order) => order.status === filter);
  },
}));
