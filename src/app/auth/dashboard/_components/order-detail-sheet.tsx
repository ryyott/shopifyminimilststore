"use client"

import { Package, MapPin, CreditCard, Calendar, User, Mail, Truck, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { type Order } from "@/types/order"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CopyableField } from "@/components/ui/copyable-field"

interface OrderDetailSheetProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "shipped":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "processing":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "pending":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "cancelled":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "failed":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "refunded":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function OrderDetailSheet({ order, open, onOpenChange }: OrderDetailSheetProps) {
  if (!order) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl p-0 [&>button]:z-50" side="right">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <SheetHeader className="pr-12">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl font-bold">Order {order.orderId}</SheetTitle>
                <SheetDescription className="mt-1 text-sm">
                  Placed on {formatDate(order.createdAt)}
                </SheetDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={cn("capitalize", getStatusColor(order.status))}>
                  {order.status}
                </Badge>
                <Badge className={cn("capitalize", getPaymentStatusColor(order.paymentStatus))}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Customer Information */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                Customer Information
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <CopyableField value={order.customerName} label="Name">
                <div className="flex items-start gap-3 p-2 pr-10 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <User className="text-muted-foreground size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{order.customerName}</p>
                  </div>
                </div>
              </CopyableField>

              <CopyableField value={order.customerEmail} label="Email">
                <div className="flex items-start gap-3 p-2 pr-10 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <Mail className="text-muted-foreground size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{order.customerEmail}</p>
                  </div>
                </div>
              </CopyableField>

              <CopyableField value={order.shippingAddress} label="Shipping Address">
                <div className="flex items-start gap-3 p-2 pr-10 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <MapPin className="text-muted-foreground size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Shipping Address</p>
                    <p className="text-sm font-medium">{order.shippingAddress}</p>
                  </div>
                </div>
              </CopyableField>
            </div>
          </div>

          {/* Order Items */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Package className="size-4 text-muted-foreground" />
                Order Items ({order.items.length})
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                  {item.imageUrl && (
                    <div className="relative size-16 overflow-hidden rounded-md flex-shrink-0 border">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CreditCard className="size-4 text-muted-foreground" />
                Order Summary
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatCurrency(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Truck className="size-4 text-muted-foreground" />
                  Tracking Information
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <CopyableField value={order.trackingNumber} label="Tracking Number">
                  <div className="flex items-center justify-between p-3 pr-10 rounded-lg bg-muted/20 border">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Tracking Number</p>
                      <p className="text-sm font-mono font-semibold">{order.trackingNumber}</p>
                    </div>
                    {order.expectedDelivery && (
                      <div className="text-right">
                        <p className="text-xs font-medium text-muted-foreground">Expected Delivery</p>
                        <p className="text-sm font-medium">
                          {new Date(order.expectedDelivery).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CopyableField>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                Order Timeline
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {order.events.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "size-8 rounded-full border-2 flex items-center justify-center",
                          event.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : event.status === "in_progress"
                              ? "bg-blue-500 border-blue-500"
                              : "bg-muted border-muted"
                        )}
                      >
                        {event.status === "completed" && (
                          <CheckCircle2 className="size-4 text-white" />
                        )}
                      </div>
                      {index < order.events.length - 1 && (
                        <div
                          className={cn(
                            "w-0.5 h-12 my-1",
                            event.status === "completed" ? "bg-green-500" : "bg-muted"
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">{event.label}</p>
                      {event.timestamp && (
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.timestamp)}
                        </p>
                      )}
                      {event.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="size-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
                <h3 className="font-semibold text-sm">Notes</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
