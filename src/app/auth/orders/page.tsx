"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Plus, FileDown, Check, Copy, ExternalLink, Package, MapPin, Calendar, Clock, DollarSign } from "lucide-react";

import { AddOrderForm } from "@/components/orders/add-order-form";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { DetailedOrderTimeline } from "@/components/orders/order-timeline";
import { OrdersTable } from "@/components/orders/orders-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockOrders } from "@/lib/mock/orders";
import type { Order } from "@/types/order";

import { OrderStatsCards } from "./_components/order-stats-cards";

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleEdit = (order: Order) => {
    console.log("Edit order:", order.orderId);
    // TODO: Implement edit functionality
  };

  const handleDuplicate = (order: Order) => {
    console.log("Duplicate order:", order.orderId);
    // TODO: Implement duplicate functionality
  };

  const handleDelete = (order: Order) => {
    console.log("Delete order:", order.orderId);
    // TODO: Implement delete functionality
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatShortDate = (date: Date) => {
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

  const copyTrackingNumber = () => {
    if (selectedOrder?.trackingNumber) {
      navigator.clipboard.writeText(selectedOrder.trackingNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      paid: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
      refunded: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Track and manage all your orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown className="size-4 text-foreground" />
            <span className="hidden text-foreground sm:inline">Export</span>
          </Button>
          <Button className="gap-2" onClick={() => setIsAddFormOpen(true)}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Order</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <OrderStatsCards orders={orders} />

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        onView={handleView}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-none bg-[oklch(0.16_0_0)] p-0 shadow-2xl">
          {selectedOrder && (
            <>
              <DialogHeader className="space-y-2 border-b border-white/10 bg-gradient-to-br from-[oklch(0.18_0_0)] to-[oklch(0.15_0_0)] p-5">
                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                    <Package className="size-5 text-white" />
                  </div>
                  {selectedOrder.orderId}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="font-medium text-white">Order:</span>
                  <span>{selectedOrder.customerName}</span>
                </div>
              </DialogHeader>

              <div className="grid gap-5 p-5 md:grid-cols-1 lg:grid-cols-[1fr_1.5fr]">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-white">Status</h3>
                    <OrderStatusBadge status={selectedOrder.status} />
                  </motion.div>

                  {/* Carrier */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-white">Carrier</h3>
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-purple-600">
                        <Package className="size-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">FedEx</span>
                    </div>
                  </motion.div>

                  {/* Tracking Number */}
                  {selectedOrder.trackingNumber && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Tracking Number</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyTrackingNumber}
                          className="h-6 text-xs text-white hover:bg-white/10 hover:text-white"
                        >
                          Copy tracking number
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-[oklch(0.14_0_0)] p-3">
                        <p className="flex-1 font-mono text-lg font-bold text-white">{selectedOrder.trackingNumber}</p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyTrackingNumber}
                            className="size-8 hover:bg-white/10"
                          >
                            {isCopied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4 text-gray-400" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 hover:bg-white/10"
                          >
                            <ExternalLink className="size-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Route Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-white">Route Information</h3>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-[oklch(0.14_0_0)] p-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400">Origin</p>
                            <p className="text-sm font-medium text-white">{selectedOrder.shippingAddress.split(',')[1]?.trim() || 'Sydney, NSW'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-[oklch(0.14_0_0)] p-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400">Destination</p>
                            <p className="text-sm font-medium text-white">{selectedOrder.shippingAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-white">Timeline</h3>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-[oklch(0.14_0_0)] p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                            <Calendar className="size-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Created</p>
                            <p className="text-sm font-medium text-white">{formatShortDate(selectedOrder.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      {selectedOrder.expectedDelivery && (
                        <div className="rounded-lg bg-[oklch(0.14_0_0)] p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/20">
                              <Clock className="size-4 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-400">Expected Arrival</p>
                              <p className="text-sm font-medium text-white">{formatDate(selectedOrder.expectedDelivery)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Shipment Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white">Shipment Progress</h3>
                  <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[oklch(0.18_0_0)] to-[oklch(0.14_0_0)] p-4">
                    <DetailedOrderTimeline events={selectedOrder.events} />
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Order Form */}
      <AddOrderForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSubmit={(data) => {
          console.log("New order data:", data);
          // TODO: Add order to the list
        }}
      />
    </div>
  );
}
