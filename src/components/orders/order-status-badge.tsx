import { Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string; dotColor: string }> = {
  pending: {
    label: "Pending",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground dark:bg-muted/50",
    dotColor: "text-muted-foreground",
  },
  processing: {
    label: "Processing",
    className:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800/50 dark:bg-yellow-950/50 dark:text-yellow-400",
    dotColor: "text-yellow-600 dark:text-yellow-400",
  },
  shipped: {
    label: "Shipped",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-400",
    dotColor: "text-blue-600 dark:text-blue-400",
  },
  delivered: {
    label: "Delivered",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-950/50 dark:text-green-400",
    dotColor: "text-green-600 dark:text-green-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400",
    dotColor: "text-red-600 dark:text-red-400",
  },
  refunded: {
    label: "Refunded",
    className:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/50 dark:bg-purple-950/50 dark:text-purple-400",
    dotColor: "text-purple-600 dark:text-purple-400",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn("gap-1.5", config.className, className)}>
      <Circle className={cn("size-2 fill-current", config.dotColor)} />
      {config.label}
    </Badge>
  );
}
