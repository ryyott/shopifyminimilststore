"use client"

import { useMemo } from "react"
import { TrendingUp, Eye, ShoppingCart, DollarSign, Percent } from "lucide-react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { type ProductPerformance } from "@/types/analytics"
import { Separator } from "@/components/ui/separator"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Area, AreaChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

interface ProductDetailSheetProps {
  product: ProductPerformance | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data generator for last 30 days sales
const generateLast30DaysSales = (totalRevenue: number, totalPurchases: number) => {
  const days = 30
  const data = []
  const baseRevenue = totalRevenue / days
  const basePurchases = totalPurchases / days

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add some variance to make the data look realistic
    const variance = 0.3 + Math.random() * 0.7
    const revenue = Math.round(baseRevenue * variance)
    const orders = Math.max(1, Math.round(basePurchases * variance))

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue,
      orders,
    })
  }

  return data
}

// Mock data generator for conversion funnel
const generateConversionFunnel = (product: ProductPerformance) => {
  return [
    { stage: "Views", count: product.views, percentage: 100 },
    { stage: "Add to Cart", count: product.addToCart, percentage: (product.addToCart / product.views) * 100 },
    { stage: "Purchases", count: product.purchases, percentage: (product.purchases / product.views) * 100 },
  ]
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#8b5cf6",
  },
  orders: {
    label: "Orders",
    color: "#14b8a6",
  },
} satisfies ChartConfig

export function ProductDetailSheet({ product, open, onOpenChange }: ProductDetailSheetProps) {
  const salesData = useMemo(() => {
    if (!product) return []
    return generateLast30DaysSales(product.revenue, product.purchases)
  }, [product])

  const funnelData = useMemo(() => {
    if (!product) return []
    return generateConversionFunnel(product)
  }, [product])

  if (!product) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalSales = salesData.reduce((sum, day) => sum + day.revenue, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
  const maxFunnelCount = Math.max(...funnelData.map(d => d.count))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl p-0 [&>button]:z-50" side="right">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <SheetHeader className="pr-12">
            <div className="flex items-start gap-4">
              {product.imageUrl && (
                <div className="relative size-16 overflow-hidden rounded-lg flex-shrink-0 border">
                  <Image
                    src={product.imageUrl}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl font-bold truncate">{product.productName}</SheetTitle>
                <SheetDescription className="mt-1 text-sm">
                  Detailed performance analytics and insights
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <Eye className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Total Views</span>
              </div>
              <div className="text-2xl font-bold tracking-tight">{product.views.toLocaleString()}</div>
            </div>

            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <ShoppingCart className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Add to Cart</span>
              </div>
              <div className="text-2xl font-bold tracking-tight">{product.addToCart.toLocaleString()}</div>
            </div>

            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <DollarSign className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold tracking-tight">{formatCurrency(product.revenue)}</div>
            </div>

            <div className="group bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="p-1.5 rounded-md bg-background/50">
                  <Percent className="size-3.5" />
                </div>
                <span className="text-xs font-medium">Conv. Rate</span>
              </div>
              <div className="text-2xl font-bold tracking-tight">{product.conversionRate.toFixed(2)}%</div>
            </div>
          </div>

          {/* Sales Chart - Last 30 Days */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                Sales Last 30 Days
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Total Sales</p>
                  <p className="text-lg font-bold tracking-tight">{formatCurrency(totalSales)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Total Orders</p>
                  <p className="text-lg font-bold tracking-tight">{totalOrders}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Avg Order Value</p>
                  <p className="text-lg font-bold tracking-tight">{formatCurrency(avgOrderValue)}</p>
                </div>
              </div>

              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="revenue"
                    type="natural"
                    fill="url(#fillRevenue)"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                Conversion Funnel
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {funnelData.map((stage, index) => {
                const widthPercentage = (stage.count / maxFunnelCount) * 100
                const dropoff = index > 0 ? funnelData[index - 1].percentage - stage.percentage : 0

                return (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {stage.stage}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {stage.percentage.toFixed(1)}% of total
                      </span>
                    </div>

                    <div className="relative">
                      <div className="relative h-8 overflow-hidden rounded-lg bg-secondary/20">
                        <div
                          className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
                          style={{
                            width: `${widthPercentage}%`,
                            background: `linear-gradient(135deg, hsl(var(--chart-${(index % 5) + 1})) 0%, hsl(var(--chart-${((index + 1) % 5) + 1})) 100%)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        <div className="relative flex h-full items-center justify-between px-3">
                          <span className="text-xs font-medium text-foreground">
                            {stage.count.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {dropoff > 0 && (
                        <p className="mt-1 text-[10px] font-medium text-red-500">
                          {dropoff.toFixed(1)}% drop-off from previous stage
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-4 py-3 border-b">
              <h3 className="font-semibold text-sm">Performance Summary</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-sm font-medium">Total Purchases</span>
                <span className="text-sm font-bold">{product.purchases}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-sm font-medium">Cart Addition Rate</span>
                <span className="text-sm font-bold">
                  {((product.addToCart / product.views) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-sm font-medium">Purchase Rate (from cart)</span>
                <span className="text-sm font-bold">
                  {product.addToCart > 0 ? ((product.purchases / product.addToCart) * 100).toFixed(2) : "0.00"}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
