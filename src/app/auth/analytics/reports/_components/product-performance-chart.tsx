"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ProductPerformance } from "@/types/analytics"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { ProductDetailSheet } from "./product-detail-sheet"

interface ProductPerformanceChartProps {
  products: ProductPerformance[]
}

export function ProductPerformanceChart({
  products,
}: ProductPerformanceChartProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductPerformance | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const maxRevenue = Math.max(...products.map((p) => p.revenue))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleProductClick = (product: ProductPerformance) => {
    setSelectedProduct(product)
    setSheetOpen(true)
  }

  return (
    <>
      <Card className="@container/card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Product Performance</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Top performing products by revenue and conversion
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6">
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.productId}
                onClick={() => handleProductClick(product)}
                className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-muted/50 hover:border-border"
              >
                {product.imageUrl && (
                  <div className="relative size-12 overflow-hidden rounded-md flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium truncate">{product.productName}</h4>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Views</p>
                      <p className="font-medium">
                        {product.views.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Purchases</p>
                      <p className="font-medium">{product.purchases}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conv. Rate</p>
                      <p className="font-medium">
                        {product.conversionRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={(product.revenue / maxRevenue) * 100}
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ProductDetailSheet
        product={selectedProduct}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
