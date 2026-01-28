"use client";

import { Package, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Order } from "@/types/order";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

interface CustomerTimelineProps {
  orders: Order[];
  className?: string;
  onOrderClick?: (order: Order) => void;
}

export function CustomerTimeline({ orders, className, onOrderClick }: CustomerTimelineProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
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

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedOrders.length === 0) {
    return (
      <div className={cn("text-muted-foreground flex items-center justify-center py-8 text-sm", className)}>
        No orders yet
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {sortedOrders.map((order, index) => (
        <div key={order.id} className="relative flex gap-4 pb-4">
          {/* Timeline line */}
          {index !== sortedOrders.length - 1 && (
            <div className="bg-border absolute left-[15px] top-[36px] h-[calc(100%+0.5rem)] w-[2px]" />
          )}

          {/* Timeline dot */}
          <div className="relative flex size-8 shrink-0 items-center justify-center">
            <div className="bg-primary/20 flex size-8 items-center justify-center rounded-full">
              <Package className="text-primary size-4" />
            </div>
          </div>

          {/* Timeline content */}
          <div
            className={cn(
              "flex-1 space-y-2 pb-2",
              onOrderClick && "cursor-pointer rounded-lg p-2 -m-2 transition-colors hover:bg-muted/50"
            )}
            onClick={() => onOrderClick?.(order)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{order.orderId}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Calendar className="size-3" />
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <DollarSign className="size-4" />
                  {formatCurrency(order.total)}
                </div>
                <div className="text-muted-foreground text-xs">{order.items.length} item(s)</div>
              </div>
            </div>

            {/* Order items */}
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="text-muted-foreground text-xs">
                  • {item.productName} (x{item.quantity})
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-muted-foreground text-xs">
                  +{order.items.length - 2} more item(s)
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
