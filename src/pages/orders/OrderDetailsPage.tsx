import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { mockApi } from "../../services/mockData";
import { useOrderStore } from "../../stores/orderStore";
import { useToast } from "../../components/ui/toast";
import { useOrderTimer, useOrderSLA } from "../../hooks/useOrderTimer";
import { playUrgentSound } from "../../services/notificationService";
import type { Order } from "../../types";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Check,
  X,
  ChefHat,
  PackageCheck,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { acceptOrder, rejectOrder, startPreparation, markAsReady } =
    useOrderStore();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const slaBreachAlerted = useRef(false);

  // Timer hooks
  const timer = useOrderTimer(
    order?.createdAt || new Date().toISOString(),
    order?.slaTime || 20,
    order?.status || "pending",
  );
  const slaStatus = useOrderSLA(
    order?.createdAt || new Date().toISOString(),
    order?.slaTime || 20,
  );

  // Monitor SLA breach and trigger alerts
  useEffect(() => {
    if (timer.isOverdue && !slaBreachAlerted.current && order) {
      slaBreachAlerted.current = true;

      // Play urgent sound alert
      playUrgentSound();

      // Show toast notification
      toast({
        title: "⚠️ SLA Breach!",
        description: `Order ${order.orderNumber} has exceeded the ${order.slaTime || 20}-minute SLA. Immediate action required!`,
        variant: "destructive",
      });

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification("⚠️ SLA Breach - Quick Action Required!", {
          body: `Order ${order.orderNumber} from ${order.customer.name} is overdue by ${timer.totalMinutes - (order.slaTime || 20)} minutes`,
          icon: "/icon-192.png",
          badge: "/badge-72.png",
          tag: `sla-breach-${order.id}`,
          requireInteraction: true,
          vibrate: [200, 100, 200, 100, 200],
        });
      }
    }

    // Reset alert flag when order changes or status changes to completed/cancelled
    if (
      order &&
      (order.status === "completed" || order.status === "cancelled")
    ) {
      slaBreachAlerted.current = false;
    }
  }, [timer.isOverdue, timer.totalMinutes, order, toast]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const data = await mockApi.getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleAccept = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      acceptOrder(order.id);
      const updated = await mockApi.updateOrderStatus(order.id, "accepted");
      setOrder(updated);
      toast({
        title: "Order Accepted",
        description: `Order ${order.orderNumber} has been accepted.`,
      });
    } catch (error) {
      console.error("Failed to accept order:", error);
      toast({
        title: "Error",
        description: "Failed to accept order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!order) return;
    const confirmed = confirm("Are you sure you want to reject this order?");
    if (!confirmed) return;

    setUpdating(true);
    try {
      rejectOrder(order.id, "Rejected by vendor");
      const updated = await mockApi.updateOrderStatus(order.id, "cancelled");
      setOrder(updated);
      toast({
        title: "Order Rejected",
        description: `Order ${order.orderNumber} has been rejected.`,
      });
    } catch (error) {
      console.error("Failed to reject order:", error);
      toast({
        title: "Error",
        description: "Failed to reject order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleStartPreparation = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      startPreparation(order.id);
      const updated = await mockApi.updateOrderStatus(order.id, "preparing");
      setOrder(updated);
      toast({
        title: "Preparation Started",
        description: `Preparing order ${order.orderNumber}.`,
      });
    } catch (error) {
      console.error("Failed to start preparation:", error);
      toast({
        title: "Error",
        description: "Failed to start preparation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkReady = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      markAsReady(order.id);
      const updated = await mockApi.updateOrderStatus(order.id, "ready");
      setOrder(updated);
      toast({
        title: "Order Ready",
        description: `Order ${order.orderNumber} is ready for pickup.`,
      });
    } catch (error) {
      console.error("Failed to mark order as ready:", error);
      toast({
        title: "Error",
        description: "Failed to mark order as ready. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine which action buttons to show based on status
  const showAcceptReject = order.status === "pending";
  const showStartPrep = order.status === "accepted";
  const showMarkReady = order.status === "preparing";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              {formatDate(order.createdAt, "long")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Timer Display */}
          {order.status !== "completed" && order.status !== "cancelled" && (
            <Card
              className={`px-4 py-2 ${timer.isOverdue ? "border-red-500 bg-red-50 dark:bg-red-950" : "border-blue-500"}`}
            >
              <div className="flex items-center gap-2">
                {timer.isOverdue ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-600" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${timer.isOverdue ? "text-red-600" : "text-blue-600"}`}
                  >
                    {timer.isOverdue ? "SLA BREACHED" : "Time Elapsed"}
                  </p>
                  <p
                    className={`text-lg font-bold ${timer.isOverdue ? "text-red-700" : ""}`}
                  >
                    {timer.formattedTime}
                  </p>
                  {!timer.isOverdue && (
                    <p className="text-xs text-muted-foreground">
                      SLA: {slaStatus.remaining}min remaining
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          {showAcceptReject && (
            <>
              <Button
                onClick={handleReject}
                variant="destructive"
                disabled={updating}
              >
                <X className="h-4 w-4 mr-2" />
                Reject Order
              </Button>
              <Button
                onClick={handleAccept}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept Order
              </Button>
            </>
          )}

          {showStartPrep && (
            <Button onClick={handleStartPreparation} disabled={updating}>
              <ChefHat className="h-4 w-4 mr-2" />
              Start Preparation
            </Button>
          )}

          {showMarkReady && (
            <Button
              onClick={handleMarkReady}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700"
            >
              <PackageCheck className="h-4 w-4 mr-2" />
              Mark as Ready
            </Button>
          )}

          <Badge
            variant={
              order.status === "completed"
                ? "success"
                : order.status === "cancelled"
                  ? "destructive"
                  : "warning"
            }
            className="text-base px-4 py-2"
          >
            {order.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      {/* SLA Progress Bar */}
      {order.status !== "completed" && order.status !== "cancelled" && (
        <Card className={slaStatus.isBreached ? "border-red-500" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">SLA Progress</span>
              <span
                className={`text-sm font-medium ${slaStatus.isBreached ? "text-red-600" : ""}`}
              >
                {slaStatus.isBreached
                  ? "Overdue"
                  : `${slaStatus.remaining}min remaining`}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  slaStatus.percentage > 50
                    ? "bg-green-500"
                    : slaStatus.percentage > 25
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${Math.max(0, slaStatus.percentage)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">Customer</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.customer.email}</p>
                <p className="text-sm text-muted-foreground">Email</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.customer.phone}</p>
                <p className="text-sm text-muted-foreground">Phone</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">{order.deliveryAddress}</p>
                <p className="text-sm text-muted-foreground">
                  Delivery Address
                </p>
              </div>
            </div>
            {order.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-1">Order Notes:</p>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium">
                {formatCurrency(order.deliveryFee)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>Discount</span>
                <span className="font-medium">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl">
                {formatCurrency(order.total)}
              </span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Payment Method
                </span>
              </div>
              <p className="font-medium capitalize">{order.paymentMethod}</p>
              <Badge
                variant={order.paymentStatus === "paid" ? "success" : "warning"}
                className="mt-2"
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">
                        Variant: {item.variantName}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(item.subtotal)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
