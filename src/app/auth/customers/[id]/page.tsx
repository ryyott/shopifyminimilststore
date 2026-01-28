"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Package, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCustomers } from "@/lib/mock/customers";
import { mockOrders } from "@/lib/mock/orders";
import { CustomerSegmentBadge } from "../_components/customer-segment-badge";
import { CustomerTimeline } from "../_components/customer-timeline";
import { calculateCustomerMetrics } from "@/lib/analytics/customer-metrics";
import { OrderDetailSheet } from "../../dashboard/_components/order-detail-sheet";
import { type Order } from "@/types/order";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customers] = useState(mockCustomers);
  const [orders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const customer = customers.find((c) => c.id === customerId);
  const customerOrders = useMemo(
    () => orders.filter((o) => o.customerId === customerId),
    [orders, customerId]
  );

  const metrics = useMemo(() => {
    if (!customer) return null;
    return calculateCustomerMetrics(customer, customerOrders);
  }, [customer, customerOrders]);

  if (!customer) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-2xl font-bold">Customer Not Found</h2>
        <Button onClick={() => router.push("/auth/customers")}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Customers
        </Button>
      </div>
    );
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/auth/customers")}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
            <CustomerSegmentBadge segment={customer.segment} />
          </div>
          <p className="text-muted-foreground text-sm">Customer details and order history</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.totalOrders}</div>
            <p className="text-muted-foreground text-xs">
              {customerOrders.filter((o) => o.status === "delivered").length} delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</div>
            <p className="text-muted-foreground text-xs">Lifetime value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(customer.averageOrderValue)}</div>
            <p className="text-muted-foreground text-xs">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchase Frequency</CardTitle>
            <Calendar className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.purchaseFrequency.toFixed(1)}</div>
            <p className="text-muted-foreground text-xs">Orders per month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Contact details and account info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground size-5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground text-sm">{customer.email}</p>
              </div>
            </div>

            {customer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground size-5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-muted-foreground text-sm">{customer.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground size-5" />
              <div>
                <p className="text-sm font-medium">Customer Since</p>
                <p className="text-muted-foreground text-sm">{formatDate(customer.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground size-5" />
              <div>
                <p className="text-sm font-medium">First Order</p>
                <p className="text-muted-foreground text-sm">{formatDate(customer.firstOrderDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground size-5" />
              <div>
                <p className="text-sm font-medium">Last Order</p>
                <p className="text-muted-foreground text-sm">{formatDate(customer.lastOrderDate)}</p>
              </div>
            </div>

            {customer.tags && customer.tags.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Metrics</CardTitle>
            <CardDescription>Analytics and predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Current Lifetime Value</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics?.clv || 0)}</p>
            </div>

            <div>
              <p className="text-sm font-medium">Predicted Lifetime Value</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics?.predictedClv || 0)}</p>
              <p className="text-muted-foreground text-xs">Based on purchase patterns</p>
            </div>

            <div>
              <p className="text-sm font-medium">Days Since Last Order</p>
              <p className="text-2xl font-bold">{metrics?.daysSinceLastOrder ?? "N/A"}</p>
            </div>

            <div>
              <p className="text-sm font-medium">Days Since First Order</p>
              <p className="text-2xl font-bold">{metrics?.daysSinceFirstOrder ?? "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            {customerOrders.length} order{customerOrders.length !== 1 ? "s" : ""} from this customer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTimeline orders={customerOrders} onOrderClick={handleOrderClick} />
        </CardContent>
      </Card>

      <OrderDetailSheet
        order={selectedOrder}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
