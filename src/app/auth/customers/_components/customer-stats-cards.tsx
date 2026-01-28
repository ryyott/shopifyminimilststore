"use client";

import { Users, UserPlus, Star, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Customer } from "@/types/customer";
import { calculateCustomerStats } from "@/lib/analytics/customer-metrics";
import { type Order } from "@/types/order";

interface CustomerStatsCardsProps {
  customers: Customer[];
  orders: Order[];
}

export function CustomerStatsCards({ customers, orders }: CustomerStatsCardsProps) {
  // Calculate stats using analytics function
  const stats = calculateCustomerStats(customers, orders);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Mock trending data (in future, calculate from historical data)
  const totalCustomersTrend = 12;
  const newCustomersTrend = 18;
  const vipCustomersTrend = 8;
  const avgCLVTrend = 15;
  const avgAOVTrend = 5;

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      iconBgColor: "bg-purple-100 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: {
        value: totalCustomersTrend,
        isPositive: true,
      },
    },
    {
      title: "New Customers",
      value: stats.newCustomers,
      icon: UserPlus,
      iconBgColor: "bg-blue-100 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: {
        value: newCustomersTrend,
        isPositive: true,
      },
    },
    {
      title: "VIP Customers",
      value: stats.vipCustomers,
      icon: Star,
      iconBgColor: "bg-yellow-100 dark:bg-yellow-950/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      trend: {
        value: vipCustomersTrend,
        isPositive: true,
      },
    },
    {
      title: "At Risk",
      value: stats.atRiskCustomers,
      icon: AlertTriangle,
      iconBgColor: "bg-orange-100 dark:bg-orange-950/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      trend: null,
    },
    {
      title: "Avg Lifetime Value",
      value: formatCurrency(stats.averageLifetimeValue),
      icon: DollarSign,
      iconBgColor: "bg-emerald-100 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      trend: {
        value: avgCLVTrend,
        isPositive: true,
      },
      isRevenue: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat) => (
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
