"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Star, Mail } from "lucide-react";
import { type Customer } from "@/types/customer";
import { type EmailSubscriber } from "@/types/email-subscriber";
import { calculateCustomerStats } from "@/lib/analytics/customer-metrics";
import { type Order } from "@/types/order";

interface CustomerKPIsProps {
  customers: Customer[];
  orders: Order[];
  subscribers: EmailSubscriber[];
}

export function CustomerKPIs({ customers, orders, subscribers }: CustomerKPIsProps) {
  const stats = calculateCustomerStats(customers, orders);
  const activeSubscribers = subscribers.filter((s) => s.isActive).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const kpis = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-950/30",
    },
    {
      title: "New This Month",
      value: stats.newCustomers,
      icon: UserPlus,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-950/30",
    },
    {
      title: "VIP Customers",
      value: stats.vipCustomers,
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-950/30",
    },
    {
      title: "Email Subscribers",
      value: activeSubscribers,
      icon: Mail,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-950/30",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className={`flex size-10 items-center justify-center rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`size-5 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
