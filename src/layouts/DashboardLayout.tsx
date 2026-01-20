import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import { useNotificationStore } from "../stores/notificationStore";
import { useOrderStore } from "../stores/orderStore";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/toast";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  Warehouse,
  DollarSign,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils";
import {
  requestNotificationPermission,
  showOrderNotification,
  playNotificationSound,
  playUrgentSound,
} from "../services/notificationService";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Package },
  { path: "/orders", label: "Orders", icon: ShoppingCart },
  { path: "/inventory", label: "Inventory", icon: Warehouse },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/finances", label: "Finances", icon: DollarSign },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/support", label: "Support", icon: HelpCircle },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const { orders } = useOrderStore();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const slaBreachAlertedOrders = useRef<Set<string>>(new Set());

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Monitor for new orders
  useEffect(() => {
    if (orders.length > previousOrderCount && previousOrderCount > 0) {
      const newOrders = orders.slice(0, orders.length - previousOrderCount);

      newOrders.forEach((order) => {
        if (order.status === "pending") {
          // Play notification sound
          playNotificationSound();

          // Show browser notification
          showOrderNotification(
            order.orderNumber,
            order.customer.name,
            order.total,
          );

          // Show toast notification
          toast({
            title: "🛒 New Order Received!",
            description: `Order ${order.orderNumber} from ${order.customer.name} - ₦${order.total.toLocaleString("en-NG")}`,
          });
        }
      });
    }

    setPreviousOrderCount(orders.length);
  }, [orders, previousOrderCount, toast]);

  // Monitor for SLA breaches across all active orders
  useEffect(() => {
    const checkSLABreaches = () => {
      orders.forEach((order) => {
        // Skip completed, cancelled, or handed to rider orders
        if (
          order.status === "completed" ||
          order.status === "cancelled" ||
          order.status === "handed_to_rider"
        ) {
          // Clean up tracking for completed orders
          slaBreachAlertedOrders.current.delete(order.id);
          return;
        }

        // Check if order has breached SLA
        const now = new Date().getTime();
        const orderTime = new Date(order.createdAt).getTime();
        const elapsedMinutes = (now - orderTime) / 60000;
        const slaTime = order.slaTime || 20;

        if (
          elapsedMinutes >= slaTime &&
          !slaBreachAlertedOrders.current.has(order.id)
        ) {
          // Mark as alerted
          slaBreachAlertedOrders.current.add(order.id);

          // Play urgent sound
          playUrgentSound();

          // Show toast
          toast({
            title: "⚠️ SLA Breach Alert!",
            description: `Order ${order.orderNumber} has exceeded ${slaTime}min SLA. Status: ${order.status}`,
            variant: "destructive",
          });

          // Browser notification
          if (Notification.permission === "granted") {
            new Notification("⚠️ SLA Breach - Immediate Action Required!", {
              body: `Order ${order.orderNumber} from ${order.customer.name} is ${Math.round(elapsedMinutes - slaTime)} minutes overdue`,
              icon: "/icon-192.png",
              badge: "/badge-72.png",
              tag: `sla-breach-${order.id}`,
              requireInteraction: true,
              vibrate: [200, 100, 200, 100, 200],
            });
          }
        }
      });
    };

    // Check immediately
    checkSLABreaches();

    // Check every 30 seconds for SLA breaches
    const interval = setInterval(checkSLABreaches, 30000);

    return () => clearInterval(interval);
  }, [orders, toast]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg">QuickMart Vendor</h1>
              <p className="text-xs text-muted-foreground">{user?.storeName}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r bg-background pt-16 transition-transform md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
