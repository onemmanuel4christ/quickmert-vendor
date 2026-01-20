import { create } from "zustand";
import type { Order, OrderTimeline } from "../types";

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  filter: "all" | "pending" | "preparing" | "ready" | "completed" | "cancelled";
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  setFilter: (filter: OrderState["filter"]) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string, reason?: string) => void;
  startPreparation: (orderId: string) => void;
  markAsReady: (orderId: string) => void;
  getFilteredOrders: () => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  filter: "all",
  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setFilter: (filter) => set({ filter }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order,
      ),
    })),

  acceptOrder: (orderId) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        orders: state.orders.map((order) => {
          if (order.id === orderId) {
            const timelineEntry: OrderTimeline = {
              status: "accepted",
              timestamp: now,
              notes: "Order accepted by vendor",
            };
            return {
              ...order,
              status: "accepted" as Order["status"],
              acceptedAt: now,
              updatedAt: now,
              timeline: [...(order.timeline || []), timelineEntry],
            };
          }
          return order;
        }),
      };
    }),

  rejectOrder: (orderId, reason) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        orders: state.orders.map((order) => {
          if (order.id === orderId) {
            const timelineEntry: OrderTimeline = {
              status: "cancelled",
              timestamp: now,
              notes: reason || "Order rejected by vendor",
            };
            return {
              ...order,
              status: "cancelled" as Order["status"],
              updatedAt: now,
              timeline: [...(order.timeline || []), timelineEntry],
            };
          }
          return order;
        }),
      };
    }),

  startPreparation: (orderId) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        orders: state.orders.map((order) => {
          if (order.id === orderId) {
            const timelineEntry: OrderTimeline = {
              status: "preparing",
              timestamp: now,
              notes: "Preparation started",
            };
            return {
              ...order,
              status: "preparing" as Order["status"],
              prepStartedAt: now,
              updatedAt: now,
              timeline: [...(order.timeline || []), timelineEntry],
            };
          }
          return order;
        }),
      };
    }),

  markAsReady: (orderId) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        orders: state.orders.map((order) => {
          if (order.id === orderId) {
            // Calculate actual prep time if we have prepStartedAt
            let actualPrepTime: number | undefined;
            if (order.prepStartedAt) {
              const prepStartTime = new Date(order.prepStartedAt).getTime();
              const readyTime = new Date(now).getTime();
              actualPrepTime = Math.round((readyTime - prepStartTime) / 60000); // Convert to minutes
            }

            const timelineEntry: OrderTimeline = {
              status: "ready",
              timestamp: now,
              notes: `Order ready for pickup${actualPrepTime ? ` (Prep time: ${actualPrepTime}min)` : ""}`,
            };
            return {
              ...order,
              status: "ready" as Order["status"],
              readyAt: now,
              actualPrepTime,
              updatedAt: now,
              timeline: [...(order.timeline || []), timelineEntry],
            };
          }
          return order;
        }),
      };
    }),

  getFilteredOrders: () => {
    const { orders, filter } = get();
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  },
}));
