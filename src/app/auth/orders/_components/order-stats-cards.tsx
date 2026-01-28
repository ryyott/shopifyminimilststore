"use client";

import { Package, Truck, CheckCircle2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Order } from "@/types/order";

interface OrderStatsCardsProps {
  orders: Order[];
}

export function OrderStatsCards({ orders }: OrderStatsCardsProps) {
  // Calculate stats
  const totalOrders = orders.length;
  const processingOrders = orders.filter((o) => o.status === "processing" || o.status === "pending").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  // Calculate revenue
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate percentages (mock trending data)
  const processingTrend = 15;
  const shippedTrend = 8;
  const deliveredTrend = 12;
  const revenueTrend = 23;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: Package,
      iconBgColor: "bg-purple-100 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: null,
    },
    {
      title: "Processing",
      value: processingOrders,
      icon: Package,
      iconBgColor: "bg-yellow-100 dark:bg-yellow-950/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      trend: {
        value: processingTrend,
        isPositive: true,
      },
    },
    {
      title: "Shipped",
      value: shippedOrders,
      icon: Truck,
      iconBgColor: "bg-blue-100 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: {
        value: shippedTrend,
        isPositive: true,
      },
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle2,
      iconBgColor: "bg-green-100 dark:bg-green-950/30",
      iconColor: "text-green-600 dark:text-green-400",
      trend: {
        value: deliveredTrend,
        isPositive: true,
      },
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      iconBgColor: "bg-emerald-100 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      trend: {
        value: revenueTrend,
        isPositive: true,
      },
      isRevenue: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title} className="from-primary/5 bg-gradient-to-t p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className={cn("font-bold tracking-tight", stat.isRevenue ? "text-2xl" : "text-3xl")}>
                  {stat.value}
                </h3>
                {stat.trend && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-1",
                      stat.trend.isPositive
                        ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
                    )}
                  >
                    {stat.trend.isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {stat.trend.value}%
                  </Badge>
                )}
              </div>
            </div>
            <div className={cn("flex size-12 items-center justify-center rounded-lg", stat.iconBgColor)}>
              <stat.icon className={cn("size-6", stat.iconColor)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
