// User and Authentication Types
export interface Vendor {
  id: string;
  email: string;
  storeName: string;
  storeId: string;
  phoneNumber: string;
  address: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: Vendor;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  storeName: string;
  phoneNumber: string;
  address: string;
}

// Product Types
export interface ProductVariant {
  id: string;
  name: string; // e.g., "Small", "1kg", "500g"
  price: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  stock: number;
  sku: string;
  isActive: boolean;
  variants?: ProductVariant[];
  size?: string; // e.g., "1kg", "500g", "2L", "250ml"
  unit?: string; // kg, g, l, ml, pcs
  tags: string[];
  vendorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  slug?: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  size?: string;
  unit?: string;
  tags?: string[];
  variants?: Omit<ProductVariant, "id">[];
  images?: File[];
}

// Order Types
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "handed_to_rider"
  | "completed"
  | "cancelled";

export type OrderPriority = "normal" | "high" | "urgent";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  performedBy?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  priority?: OrderPriority;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  deliveryAddress: string;
  notes?: string;
  vendorId: string;
  riderId?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
  estimatedPrepTime?: number; // in minutes
  actualPrepTime?: number; // in minutes
  acceptedAt?: string;
  prepStartedAt?: string;
  readyAt?: string;
  completedAt?: string;
  timeline?: OrderTimeline[];
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  slug?: string;
  currentStock: number;
  lowStockThreshold: number;
  size?: string;
  unit: string;
  tags?: string[];
  lastUpdated: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  type: "increase" | "decrease" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

// Analytics Types
export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  periodComparison: {
    revenue: number; // percentage change
    orders: number; // percentage change
  };
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsData {
  sales: SalesAnalytics;
  topProducts: TopProduct[];
  revenueChart: RevenueData[];
}

// Store Settings Types
export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  description: string;
  logo?: string;
  images: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  email: string;
  operatingHours: OperatingHours[];
  isOpen: boolean;
  isVacationMode: boolean;
  deliveryRadius: number; // in km
  serviceAreas: string[];
  taxRate: number;
  currency: string;
}

// Notification Types
export type NotificationType = "order" | "inventory" | "system" | "payment";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
  totalProducts: number;
  activeProducts: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
