"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Calendar, DollarSign, Package, TrendingUp, ChevronRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { Customer } from "@/types/customer";
import type { Order } from "@/types/order";
import { CustomerSegmentBadge } from "./customer-segment-badge";
import { CustomerOrdersTable } from "./customer-orders-table";
import { calculateCustomerMetrics } from "@/lib/analytics/customer-metrics";

interface CustomerDetailSheetProps {
  customer: Customer | null;
  orders: Order[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailSheet({ customer, orders, open, onOpenChange }: CustomerDetailSheetProps) {
  const router = useRouter();
  const [contactInfoOpen, setContactInfoOpen] = useState(true);
  const [metricsOpen, setMetricsOpen] = useState(true);

  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const metrics = calculateCustomerMetrics(customer, customerOrders);

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

  const handleViewFullProfile = () => {
    onOpenChange(false);
    router.push(`/auth/customers/${customer.id}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl p-0 [&>button]:z-50" side="right">
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <SheetHeader className="pr-12">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-2xl font-bold truncate">{customer.name}</SheetTitle>
                <SheetDescription className="mt-1 text-sm truncate">{customer.email}</SheetDescription>
              </div>
              <CustomerSegmentBadge segment={customer.segment} />
            </div>
          </SheetHeader>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <Package className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Total Orders</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{customer.totalOrders}</div>
            </div>

            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <DollarSign className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Total Spent</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{formatCurrency(customer.totalSpent)}</div>
            </div>

            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <TrendingUp className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Avg Order</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{formatCurrency(customer.averageOrderValue)}</div>
            </div>

            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <Calendar className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Frequency</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{metrics?.purchaseFrequency.toFixed(1)}</div>
              <p className="text-muted-foreground text-xs mt-1">orders/month</p>
            </div>
          </div>

          {/* Contact Information - Collapsible */}
          <Collapsible open={contactInfoOpen} onOpenChange={setContactInfoOpen} className="border rounded-xl bg-card shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors rounded-xl">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                Contact Information
              </h3>
              <ChevronRight className={`size-4 text-muted-foreground transition-transform duration-200 ${contactInfoOpen ? "rotate-90" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <Separator className="mb-4" />
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <Mail className="text-muted-foreground size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{customer.email}</p>
                  </div>
                </div>

                {customer.phone && (
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <Phone className="text-muted-foreground size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <Calendar className="text-muted-foreground size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Customer Since</p>
                    <p className="text-sm font-medium">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <Calendar className="text-muted-foreground size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Last Order</p>
                    <p className="text-sm font-medium">{formatDate(customer.lastOrderDate)}</p>
                  </div>
                </div>

                {customer.tags && customer.tags.length > 0 && (
                  <div className="pt-2">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-medium border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Customer Metrics - Collapsible */}
          <Collapsible open={metricsOpen} onOpenChange={setMetricsOpen} className="border rounded-xl bg-card shadow-sm">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors rounded-xl">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                Customer Metrics
              </h3>
              <ChevronRight className={`size-4 text-muted-foreground transition-transform duration-200 ${metricsOpen ? "rotate-90" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Lifetime Value</p>
                  <p className="text-2xl font-bold tracking-tight">{formatCurrency(metrics?.clv || 0)}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Predicted CLV</p>
                  <p className="text-2xl font-bold tracking-tight">{formatCurrency(metrics?.predictedClv || 0)}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Days Since Last Order</p>
                  <p className="text-2xl font-bold tracking-tight">{metrics?.daysSinceLastOrder ?? "N/A"}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Days Since First Order</p>
                  <p className="text-2xl font-bold tracking-tight">{metrics?.daysSinceFirstOrder ?? "N/A"}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Order History */}
          <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Package className="size-4 text-muted-foreground" />
                Order History ({customerOrders.length} order{customerOrders.length !== 1 ? "s" : ""})
              </h3>
            </div>
            <div className="bg-background">
              <CustomerOrdersTable orders={customerOrders} />
            </div>
          </div>

          {/* View Full Profile Button */}
          <Button onClick={handleViewFullProfile} className="w-full gap-2 h-12 text-sm font-medium shadow-sm hover:shadow" size="lg">
            View Full Customer Profile
            <ExternalLink className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
