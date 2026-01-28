"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { SectionCards } from "./_components/section-cards"
import { ChartAreaInteractive } from "./_components/chart-area-interactive"
import { CustomerKPIs } from "./_components/customer-kpis"
import { OrderDetailSheet } from "./_components/order-detail-sheet"
import { ProductDetailSheet } from "../analytics/reports/_components/product-detail-sheet"
import { mockCustomers } from "@/lib/mock/customers"
import { mockOrders } from "@/lib/mock/orders"
import { mockEmailSubscribers } from "@/lib/mock/email-subscribers"
import { type Order } from "@/types/order"
import { type ProductPerformance } from "@/types/analytics"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [customers] = useState(mockCustomers)
  const [orders] = useState(mockOrders)
  const [subscribers] = useState(mockEmailSubscribers)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderSheetOpen, setOrderSheetOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductPerformance | null>(null)
  const [productSheetOpen, setProductSheetOpen] = useState(false)

  // Get recent orders (first 4)
  const recentOrders = useMemo(() => {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
  }, [orders])

  // Calculate top products from orders
  const topProducts = useMemo(() => {
    const productSales = new Map<string, {
      id: string
      name: string
      sales: number
      revenue: number
      imageUrl?: string
      views: number
      addToCart: number
      purchases: number
      conversionRate: number
    }>()

    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.productId)
        if (existing) {
          existing.sales += item.quantity
          existing.revenue += item.price * item.quantity
          existing.purchases += item.quantity
        } else {
          productSales.set(item.productId, {
            id: item.productId,
            name: item.productName,
            sales: item.quantity,
            revenue: item.price * item.quantity,
            imageUrl: item.imageUrl,
            views: item.quantity * 15, // Mock: assume 15x views per sale
            addToCart: item.quantity * 3, // Mock: assume 3x cart adds per sale
            purchases: item.quantity,
            conversionRate: (item.quantity / (item.quantity * 15)) * 100,
          })
        }
      })
    })

    return Array.from(productSales.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4)
  }, [orders])

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setOrderSheetOpen(true)
  }

  const handleProductClick = (product: typeof topProducts[0]) => {
    const productPerformance: ProductPerformance = {
      productId: product.id,
      productName: product.name,
      views: product.views,
      addToCart: product.addToCart,
      purchases: product.purchases,
      revenue: product.revenue,
      conversionRate: product.conversionRate,
      imageUrl: product.imageUrl,
    }
    setSelectedProduct(productPerformance)
    setProductSheetOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
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

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back to your YZY store admin
            </p>
          </div>
          <Link href="/">
            <Button variant="secondary">View Store</Button>
          </Link>
        </div>

        <SectionCards />
        <CustomerKPIs customers={customers} orders={orders} subscribers={subscribers} />
        <ChartAreaInteractive />

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className="flex items-center justify-between border-b pb-3 last:border-0 cursor-pointer transition-all hover:bg-muted/50 rounded-lg p-3 -m-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{order.orderId}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.customerName} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(order.total)}</p>
                      <Badge className={cn("text-xs capitalize", getStatusColor(order.status))}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/auth/products?add=true" className="cursor-pointer">
                <Button className="w-full justify-start cursor-pointer" variant="outline">
                  Add New Product
                </Button>
              </Link>
              <Link href="/auth/orders" className="cursor-pointer">
                <Button className="w-full justify-start cursor-pointer" variant="outline">
                  View All Orders
                </Button>
              </Link>
              <Link href="/auth/products" className="cursor-pointer">
                <Button className="w-full justify-start cursor-pointer" variant="outline">
                  Manage Inventory
                </Button>
              </Link>
              <Link href="/auth/customers" className="cursor-pointer">
                <Button className="w-full justify-start cursor-pointer" variant="outline">
                  Customer Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-3 cursor-pointer transition-all hover:bg-muted/50 rounded-lg p-2 -m-2"
                  >
                    {product.imageUrl && (
                      <div className="relative size-12 overflow-hidden rounded-md flex-shrink-0 border">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.revenue)} revenue
                      </p>
                    </div>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {product.sales} sales
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <OrderDetailSheet
        order={selectedOrder}
        open={orderSheetOpen}
        onOpenChange={setOrderSheetOpen}
      />

      <ProductDetailSheet
        product={selectedProduct}
        open={productSheetOpen}
        onOpenChange={setProductSheetOpen}
      />
    </>
  )
}
