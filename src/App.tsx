import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// Dashboard Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProductsPage from "./pages/products/ProductsPage";
import AddProductPage from "./pages/products/AddProductPage";
import EditProductPage from "./pages/products/EditProductPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailsPage from "./pages/orders/OrderDetailsPage";
import InventoryPage from "./pages/inventory/InventoryPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import FinancesPage from "./pages/finances/FinancesPage";
import ReportsPage from "./pages/reports/ReportsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import SupportPage from "./pages/support/SupportPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Set initial theme
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<AddProductPage />} />
            <Route
              path="products/edit/:productId"
              element={<EditProductPage />}
            />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="finances" element={<FinancesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
