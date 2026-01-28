"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { DetailedOrderTimeline } from "@/components/orders/order-timeline";
import { type Order } from "@/types/order";

interface CustomerOrdersTableProps {
  orders: Order[];
}

export function CustomerOrdersTable({ orders }: CustomerOrdersTableProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedOrders.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        No orders yet
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="text-xs border-b">
            <TableHead className="w-[28px] pl-3 py-3"></TableHead>
            <TableHead className="w-[32px] py-3"></TableHead>
            <TableHead className="py-3 font-semibold text-[10px]">Order</TableHead>
            <TableHead className="py-3 font-semibold text-[10px]">Date</TableHead>
            <TableHead className="py-3 font-semibold text-[10px]">Status</TableHead>
            <TableHead className="w-[35px] py-3 text-center font-semibold text-[10px]">Qty</TableHead>
            <TableHead className="pr-3 py-3 text-right font-semibold text-[10px]">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <React.Fragment key={order.id}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50 text-xs"
                  onClick={() => toggleExpand(order.id)}
                >
                  <TableCell className="pl-3 py-2">
                    {isExpanded ? (
                      <ChevronDown className="size-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-3 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    {order.items[0]?.imageUrl && (
                      <div className="size-6 overflow-hidden rounded bg-muted">
                        <img
                          src={order.items[0].imageUrl}
                          alt={order.items[0].productName}
                          className="size-full object-cover"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium py-2 text-[10px]">{order.orderId}</TableCell>
                  <TableCell className="py-2">
                    <div className="text-muted-foreground whitespace-nowrap text-[10px]">
                      {formatDate(order.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="py-2 text-center text-[10px]">
                    {order.items.length}
                  </TableCell>
                  <TableCell className="pr-3 py-2 text-right font-semibold whitespace-nowrap text-[10px]">
                    {formatCurrency(order.total)}
                  </TableCell>
                </TableRow>

                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/30 p-0">
                      <div className="space-y-2 px-3 py-2.5">
                        {/* Order Items */}
                        <div>
                          <h4 className="mb-1.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Items Purchased</h4>
                          <div className="space-y-1.5">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 rounded border border-border bg-background p-1.5"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {item.imageUrl && (
                                    <div className="size-9 overflow-hidden rounded bg-muted flex-shrink-0">
                                      <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="size-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-medium leading-tight truncate">{item.productName}</p>
                                    <p className="text-[9px] text-muted-foreground">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-[11px] font-semibold whitespace-nowrap">{formatCurrency(item.price)}</p>
                                  <p className="text-[9px] text-muted-foreground whitespace-nowrap">
                                    {formatCurrency(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="rounded border border-border bg-background p-2">
                          <div className="space-y-0.5">
                            <div className="flex justify-between gap-4 text-[11px]">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span className="font-medium whitespace-nowrap">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-[11px]">
                              <span className="text-muted-foreground">Shipping</span>
                              <span className="font-medium whitespace-nowrap">{formatCurrency(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-[11px]">
                              <span className="text-muted-foreground">Tax</span>
                              <span className="font-medium whitespace-nowrap">{formatCurrency(order.tax)}</span>
                            </div>
                            <div className="flex justify-between gap-4 border-t border-border pt-1 text-[11px] font-semibold">
                              <span>Total</span>
                              <span className="whitespace-nowrap">{formatCurrency(order.total)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Info */}
                        {order.shippingAddress && (
                          <div className="rounded border border-border bg-background p-2">
                            <h4 className="mb-1 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Shipping Address</h4>
                            <p className="text-[11px] mb-1 leading-tight">{order.shippingAddress}</p>
                            {order.trackingNumber && (
                              <div className="text-[11px]">
                                <span className="text-muted-foreground">Tracking: </span>
                                <HoverCard openDelay={200}>
                                  <HoverCardTrigger asChild>
                                    <span className="font-mono font-medium cursor-help hover:underline break-all">{order.trackingNumber}</span>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80" side="left" align="start" sideOffset={5}>
                                    <div className="space-y-3">
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <h4 className="text-sm font-semibold">{order.orderId}</h4>
                                          <OrderStatusBadge status={order.status} />
                                        </div>
                                        <p className="text-muted-foreground text-xs">{order.customerName}</p>
                                      </div>

                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-muted-foreground">Total Amount</span>
                                          <span className="font-medium">{formatCurrency(order.total)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-muted-foreground">Items</span>
                                          <span className="font-medium">{order.items.length} item(s)</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-muted-foreground">Tracking</span>
                                          <span className="font-mono text-xs font-medium">{order.trackingNumber}</span>
                                        </div>
                                        {order.expectedDelivery && (
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Expected Delivery</span>
                                            <span className="font-medium">{formatDateTime(order.expectedDelivery)}</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="space-y-2 border-t pt-2">
                                        <h5 className="text-muted-foreground text-xs font-semibold">Progress Timeline</h5>
                                        <DetailedOrderTimeline events={order.events} />
                                      </div>
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
