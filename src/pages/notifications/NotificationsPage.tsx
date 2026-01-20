import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Bell,
  BellOff,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Search,
  Filter,
  Volume2,
  VolumeX,
  CheckCircle,
  Settings,
  ShoppingCart,
  Package,
  DollarSign,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { NotificationHistory, NotificationPreferences } from "../../types";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "archived" | "settings"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: true,
    orderNotifications: true,
    inventoryNotifications: true,
    paymentNotifications: true,
    systemNotifications: false,
  });

  // Mock notifications data
  const notifications: NotificationHistory[] = [
    {
      id: "notif-001",
      type: "order",
      title: "New Order Received",
      message: "Order #ORD-20240120-001 from John Doe - ₦15,000",
      isRead: false,
      isArchived: false,
      actionUrl: "/orders/ORD-20240120-001",
      createdAt: "2024-01-20T10:30:00Z",
    },
    {
      id: "notif-002",
      type: "inventory",
      title: "Low Stock Alert",
      message: "Fresh Tomatoes stock is running low (5 units remaining)",
      isRead: true,
      isArchived: false,
      actionUrl: "/inventory",
      createdAt: "2024-01-20T09:15:00Z",
      readAt: "2024-01-20T09:20:00Z",
    },
    {
      id: "notif-003",
      type: "payment",
      title: "Payout Completed",
      message: "₦500,000 has been transferred to your bank account",
      isRead: true,
      isArchived: true,
      actionUrl: "/finances",
      createdAt: "2024-01-19T14:30:00Z",
      readAt: "2024-01-19T15:00:00Z",
      archivedAt: "2024-01-20T08:00:00Z",
    },
    {
      id: "notif-004",
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance on Jan 25, 2024 from 2:00 AM - 4:00 AM",
      isRead: false,
      isArchived: false,
      createdAt: "2024-01-19T12:00:00Z",
    },
  ];

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (activeTab === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (activeTab === "archived") {
      filtered = filtered.filter((n) => n.isArchived);
    } else if (activeTab === "all") {
      filtered = filtered.filter((n) => !n.isArchived);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      order: ShoppingCart,
      inventory: Package,
      payment: DollarSign,
      system: AlertCircle,
    };
    const Icon = icons[type as keyof typeof icons] || Bell;
    return Icon;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      order: "text-blue-600 bg-blue-100 dark:bg-blue-900",
      inventory: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900",
      payment: "text-green-600 bg-green-100 dark:bg-green-900",
      system: "text-purple-600 bg-purple-100 dark:bg-purple-900",
    };
    return colors[type as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const markAsRead = (id: string) => {
    console.log("Mark as read:", id);
  };

  const markAllAsRead = () => {
    console.log("Mark all as read");
  };

  const archiveNotification = (id: string) => {
    console.log("Archive:", id);
  };

  const deleteNotification = (id: string) => {
    console.log("Delete:", id);
  };

  const updatePreferences = () => {
    console.log("Saving preferences...", preferences);
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(
    (n) => !n.isRead && !n.isArchived,
  ).length;

  // Pagination calculations
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    endIndex,
  );

  // Reset to page 1 when filters change
  const handleTabChange = (tab: "all" | "unread" | "archived" | "settings") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <Badge className="text-base">{unreadCount} unread</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Manage your notifications and preferences
          </p>
        </div>
        {activeTab !== "settings" && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          {
            id: "all",
            label: "All",
            count: notifications.filter((n) => !n.isArchived).length,
          },
          { id: "unread", label: "Unread", count: unreadCount },
          {
            id: "archived",
            label: "Archived",
            count: notifications.filter((n) => n.isArchived).length,
          },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge variant="secondary" className="ml-1">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Customize how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Notification Channels</h3>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Browser push notifications
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {preferences.soundAlerts ? (
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Sound Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Play sound for new notifications
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.soundAlerts}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      soundAlerts: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Notification Types</h3>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Order Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      New orders, updates, and cancellations
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.orderNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      orderNotifications: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Inventory Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Low stock alerts and inventory updates
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.inventoryNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      inventoryNotifications: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Payment Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Payouts, earnings, and transactions
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.paymentNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      paymentNotifications: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">System Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Platform updates and announcements
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.systemNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      systemNotifications: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={updatePreferences}>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      {activeTab !== "settings" && (
        <>
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Notifications */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium">No notifications</p>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up!
                  </p>
                </CardContent>
              </Card>
            ) : (
              paginatedNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <Card
                    key={notification.id}
                    className={`transition-all hover:shadow-md ${
                      !notification.isRead
                        ? "border-l-4 border-l-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                            notification.type,
                          )}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">
                                {notification.title}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <MailOpen className="h-4 w-4 mr-1" />
                                Mark as read
                              </Button>
                            )}
                            {!notification.isArchived && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  archiveNotification(notification.id)
                                }
                              >
                                <Archive className="h-4 w-4 mr-1" />
                                Archive
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                              Delete
                            </Button>
                            {notification.actionUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                              >
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {filteredNotifications.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredNotifications.length)} of{" "}
                {filteredNotifications.length} notifications
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
