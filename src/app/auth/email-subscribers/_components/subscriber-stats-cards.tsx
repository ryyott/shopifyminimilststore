"use client";

import { Mail, UserPlus, TrendingUp, TrendingDown, UserCheck, BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type EmailSubscriber } from "@/types/email-subscriber";
import { type Customer } from "@/types/customer";
import { calculateEmailSubscriberStats } from "@/lib/analytics/email-metrics";

interface SubscriberStatsCardsProps {
  subscribers: EmailSubscriber[];
  customers: Customer[];
}

export function SubscriberStatsCards({ subscribers, customers }: SubscriberStatsCardsProps) {
  const stats = calculateEmailSubscriberStats(subscribers, customers);

  const statCards = [
    {
      title: "Total Subscribers",
      value: stats.totalSubscribers,
      icon: Mail,
      iconBgColor: "bg-blue-100 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: null,
    },
    {
      title: "Active Subscribers",
      value: stats.activeSubscribers,
      icon: UserCheck,
      iconBgColor: "bg-green-100 dark:bg-green-950/30",
      iconColor: "text-green-600 dark:text-green-400",
      trend: null,
    },
    {
      title: "New (Last 7 Days)",
      value: stats.newSubscribersLast7Days,
      icon: UserPlus,
      iconBgColor: "bg-purple-100 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: {
        value: Math.round(stats.growthRate7d),
        isPositive: stats.growthRate7d > 0,
      },
    },
    {
      title: "New (Last 30 Days)",
      value: stats.newSubscribersLast30Days,
      icon: BarChart3,
      iconBgColor: "bg-indigo-100 dark:bg-indigo-950/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      trend: {
        value: Math.round(stats.growthRate30d),
        isPositive: stats.growthRate30d > 0,
      },
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      iconBgColor: "bg-emerald-100 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      trend: null,
      subtitle: `${stats.subscribersWhoPurchased} converted`,
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
                <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
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
              {stat.subtitle && <p className="text-muted-foreground mt-1 text-xs">{stat.subtitle}</p>}
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
