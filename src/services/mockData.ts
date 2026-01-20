import type {
  Product,
  Order,
  DashboardStats,
  AnalyticsData,
  InventoryItem,
  Notification,
  StoreSettings,
  Vendor,
  AuthResponse,
  LoginCredentials,
  SignupData,
} from "../types";

// Mock Vendor Data
export const mockVendor: Vendor = {
  id: "vendor-1",
  email: "vendor@quickmart.com",
  storeName: "Fresh Groceries Store",
  storeId: "store-1",
  phoneNumber: "+1 (555) 123-4567",
  address: "123 Market Street, Downtown, NY 10001",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Fresh Groceries",
  isActive: true,
  createdAt: "2024-01-15T10:00:00Z",
};

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Fresh Organic Tomatoes",
    slug: "fresh-organic-tomatoes",
    description: "Premium quality organic tomatoes, locally sourced",
    category: "Vegetables",
    price: 3.99,
    images: ["https://images.unsplash.com/photo-1546470427-227e7f1b5dc2?w=400"],
    stock: 150,
    sku: "VEG-TOM-001",
    isActive: true,
    size: "1kg",
    unit: "kg",
    tags: ["organic", "fresh", "local"],
    vendorId: "vendor-1",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
  },
  {
    id: "prod-2",
    name: "Fresh Milk - Whole",
    slug: "fresh-milk-whole",
    description: "Farm-fresh whole milk, pasteurized",
    category: "Dairy",
    price: 4.5,
    images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"],
    stock: 45,
    sku: "DAIRY-MLK-001",
    isActive: true,
    size: "1L",
    unit: "l",
    tags: ["dairy", "fresh", "whole milk"],
    vendorId: "vendor-1",
    variants: [
      {
        id: "var-1",
        name: "1L",
        price: 4.5,
        sku: "DAIRY-MLK-001-1L",
        stock: 45,
      },
      {
        id: "var-2",
        name: "2L",
        price: 8.0,
        sku: "DAIRY-MLK-001-2L",
        stock: 30,
      },
    ],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
  },
  {
    id: "prod-3",
    name: "Brown Bread - Whole Wheat",
    slug: "brown-bread-whole-wheat",
    description: "Freshly baked whole wheat bread",
    category: "Bakery",
    price: 2.99,
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    ],
    stock: 12,
    sku: "BAK-BRD-001",
    isActive: true,
    size: "500g",
    unit: "pcs",
    tags: ["bakery", "fresh", "whole wheat"],
    vendorId: "vendor-1",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
  },
  {
    id: "prod-4",
    name: "Fresh Chicken Breast",
    slug: "fresh-chicken-breast",
    description: "Premium boneless chicken breast",
    category: "Meat",
    price: 8.99,
    images: [
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
    ],
    stock: 25,
    sku: "MEAT-CHK-001",
    isActive: true,
    size: "500g",
    unit: "kg",
    tags: ["meat", "chicken", "fresh", "boneless"],
    vendorId: "vendor-1",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
  },
  {
    id: "prod-5",
    name: "Basmati Rice",
    slug: "basmati-rice",
    description: "Premium long-grain basmati rice",
    category: "Grains",
    price: 12.99,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    ],
    stock: 8,
    sku: "GRN-RICE-001",
    isActive: true,
    size: "5kg",
    unit: "kg",
    tags: ["grains", "rice", "basmati"],
    vendorId: "vendor-1",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
  },
  {
    id: "prod-6",
    name: "Fresh Oranges",
    slug: "fresh-oranges",
    description: "Sweet and juicy oranges",
    category: "Fruits",
    price: 5.99,
    images: ["https://images.unsplash.com/photo-1547514701-42782101795e?w=400"],
    stock: 80,
    sku: "FRT-ORG-001",
    isActive: true,
    size: "1kg",
    unit: "kg",
    tags: ["fruits", "fresh", "citrus"],
    vendorId: "vendor-1",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "ORD-2024-001",
    customer: {
      id: "cust-1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Avenue, Apt 3B, NY 10002",
    },
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        productName: "Fresh Organic Tomatoes",
        productImage:
          "https://images.unsplash.com/photo-1546470427-227e7f1b5dc2?w=400",
        quantity: 2,
        price: 3.99,
        subtotal: 7.98,
      },
      {
        id: "item-2",
        productId: "prod-2",
        productName: "Fresh Milk - Whole",
        variantName: "1L",
        quantity: 1,
        price: 4.5,
        subtotal: 4.5,
      },
    ],
    subtotal: 12.48,
    tax: 1.25,
    deliveryFee: 2.99,
    discount: 0,
    total: 16.72,
    status: "pending",
    paymentMethod: "card",
    paymentStatus: "paid",
    deliveryAddress: "456 Oak Avenue, Apt 3B, NY 10002",
    notes: "Please ring the doorbell twice",
    vendorId: "vendor-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-2",
    orderNumber: "ORD-2024-002",
    customer: {
      id: "cust-2",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 234-5678",
      address: "789 Pine Street, NY 10003",
    },
    items: [
      {
        id: "item-3",
        productId: "prod-3",
        productName: "Brown Bread - Whole Wheat",
        quantity: 2,
        price: 2.99,
        subtotal: 5.98,
      },
      {
        id: "item-4",
        productId: "prod-4",
        productName: "Fresh Chicken Breast",
        quantity: 1,
        price: 8.99,
        subtotal: 8.99,
      },
    ],
    subtotal: 14.97,
    tax: 1.5,
    deliveryFee: 2.99,
    discount: 0,
    total: 19.46,
    status: "preparing",
    paymentMethod: "card",
    paymentStatus: "paid",
    deliveryAddress: "789 Pine Street, NY 10003",
    vendorId: "vendor-1",
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    updatedAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
  },
  {
    id: "order-3",
    orderNumber: "ORD-2024-003",
    customer: {
      id: "cust-3",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      address: "321 Maple Drive, NY 10004",
    },
    items: [
      {
        id: "item-5",
        productId: "prod-5",
        productName: "Basmati Rice",
        quantity: 1,
        price: 12.99,
        subtotal: 12.99,
      },
    ],
    subtotal: 12.99,
    tax: 1.3,
    deliveryFee: 2.99,
    discount: 0,
    total: 17.28,
    status: "ready",
    paymentMethod: "cash",
    paymentStatus: "pending",
    deliveryAddress: "321 Maple Drive, NY 10004",
    vendorId: "vendor-1",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  todayOrders: 8,
  todayRevenue: 245.8,
  pendingOrders: 3,
  lowStockItems: 2,
  totalProducts: 45,
  activeProducts: 42,
};

// Mock Analytics
export const mockAnalytics: AnalyticsData = {
  sales: {
    totalRevenue: 8456.5,
    totalOrders: 142,
    averageOrderValue: 59.55,
    periodComparison: {
      revenue: 12.5,
      orders: 8.3,
    },
  },
  topProducts: [
    {
      productId: "prod-1",
      productName: "Fresh Organic Tomatoes",
      quantitySold: 245,
      revenue: 977.55,
    },
    {
      productId: "prod-2",
      productName: "Fresh Milk - Whole",
      quantitySold: 189,
      revenue: 850.5,
    },
    {
      productId: "prod-3",
      productName: "Brown Bread - Whole Wheat",
      quantitySold: 156,
      revenue: 466.44,
    },
    {
      productId: "prod-6",
      productName: "Fresh Oranges",
      quantitySold: 134,
      revenue: 802.66,
    },
    {
      productId: "prod-4",
      productName: "Fresh Chicken Breast",
      quantitySold: 98,
      revenue: 880.02,
    },
  ],
  revenueChart: [
    { date: "2024-01-14", revenue: 1245.5, orders: 21 },
    { date: "2024-01-15", revenue: 1356.8, orders: 24 },
    { date: "2024-01-16", revenue: 1189.3, orders: 19 },
    { date: "2024-01-17", revenue: 1467.9, orders: 27 },
    { date: "2024-01-18", revenue: 1298.4, orders: 22 },
    { date: "2024-01-19", revenue: 1452.6, orders: 25 },
    { date: "2024-01-20", revenue: 446.0, orders: 8 },
  ],
};

// Mock Inventory
export const mockInventory: InventoryItem[] = [
  {
    id: "inv-1",
    productId: "prod-3",
    productName: "Brown Bread - Whole Wheat",
    currentStock: 12,
    lowStockThreshold: 20,
    unit: "pcs",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "inv-2",
    productId: "prod-5",
    productName: "Basmati Rice",
    currentStock: 8,
    lowStockThreshold: 15,
    unit: "kg",
    lastUpdated: new Date().toISOString(),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-2024-001 from John Smith",
    isRead: false,
    actionUrl: "/orders/order-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-2",
    type: "inventory",
    title: "Low Stock Alert",
    message: "Brown Bread - Whole Wheat is running low (12 units remaining)",
    isRead: false,
    actionUrl: "/inventory",
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "notif-3",
    type: "order",
    title: "Order Ready for Pickup",
    message: "Order #ORD-2024-003 is ready for rider pickup",
    isRead: true,
    actionUrl: "/orders/order-3",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Mock Store Settings
export const mockStoreSettings: StoreSettings = {
  id: "store-1",
  storeName: "Fresh Groceries Store",
  description:
    "Your trusted source for fresh, organic groceries delivered to your doorstep",
  logo: "https://api.dicebear.com/7.x/initials/svg?seed=Fresh Groceries",
  images: [
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800",
  ],
  address: "123 Market Street",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "USA",
  phoneNumber: "+1 (555) 123-4567",
  email: "vendor@quickmart.com",
  operatingHours: [
    { day: "Monday", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    { day: "Tuesday", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    { day: "Wednesday", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    { day: "Thursday", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    { day: "Friday", isOpen: true, openTime: "08:00", closeTime: "22:00" },
    { day: "Saturday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Sunday", isOpen: true, openTime: "10:00", closeTime: "18:00" },
  ],
  isOpen: true,
  isVacationMode: false,
  deliveryRadius: 10,
  serviceAreas: ["Downtown", "Midtown", "Upper East Side", "Brooklyn Heights"],
  taxRate: 10,
  currency: "NGN",
};

// Mock API delay to simulate network
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Auth
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);
    if (
      credentials.email === mockVendor.email &&
      credentials.password === "password"
    ) {
      return {
        user: mockVendor,
        token: "mock-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
      };
    }
    throw new Error("Invalid credentials");
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    await delay(1000);
    const newVendor: Vendor = {
      ...mockVendor,
      id: "vendor-" + Date.now(),
      email: data.email,
      storeName: data.storeName,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };
    return {
      user: newVendor,
      token: "mock-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
    };
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(500);
    return mockDashboardStats;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    await delay(600);
    return mockProducts;
  },

  getProduct: async (id: string): Promise<Product> => {
    await delay(400);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    await delay(600);
    return mockOrders;
  },

  getOrder: async (id: string): Promise<Order> => {
    await delay(400);
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  updateOrderStatus: async (
    id: string,
    status: Order["status"],
  ): Promise<Order> => {
    await delay(500);
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return { ...order, status, updatedAt: new Date().toISOString() };
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    await delay(700);
    return mockAnalytics;
  },

  // Inventory
  getInventory: async (): Promise<InventoryItem[]> => {
    await delay(500);
    return mockInventory;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(400);
    return mockNotifications;
  },

  // Store Settings
  getStoreSettings: async (): Promise<StoreSettings> => {
    await delay(500);
    return mockStoreSettings;
  },
};
