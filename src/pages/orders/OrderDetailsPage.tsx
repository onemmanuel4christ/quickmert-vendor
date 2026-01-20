import { useEffect, useState } from "react";
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
} from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { updateOrderStatus } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await mockApi.updateOrderStatus(order.id, newStatus);
      setOrder(updated);
      updateOrderStatus(order.id, newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (
    currentStatus: Order["status"],
  ): Order["status"] | null => {
    const statusFlow: Record<Order["status"], Order["status"] | null> = {
      pending: "preparing",
      accepted: "preparing",
      preparing: "ready",
      ready: "handed_to_rider",
      handed_to_rider: "completed",
      completed: null,
      cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      {/* Status Actions */}
      {nextStatus &&
        order.status !== "completed" &&
        order.status !== "cancelled" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Update Order Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Move this order to the next stage
                  </p>
                </div>
                <Button
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={updating}
                  size="lg"
                >
                  {updating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as {nextStatus.replace("_", " ")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
