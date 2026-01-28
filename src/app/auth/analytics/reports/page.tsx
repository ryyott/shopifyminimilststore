"use client"

import { useState } from "react"
import { mockReportsAnalytics } from "@/lib/mock/analytics"
import { type DateRangeFilter } from "@/types/analytics"
import { TrafficChart } from "./_components/traffic-chart"
import { ConversionFunnel } from "./_components/conversion-funnel"
import { ProductPerformanceChart } from "./_components/product-performance-chart"
import { RevenueChart } from "./_components/revenue-chart"
import { DateRangePicker } from "./_components/date-range-picker"

export default function ReportsPage() {
  const [analytics] = useState(mockReportsAnalytics)
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    from: analytics.dateRange.start,
    to: analytics.dateRange.end,
    preset: "30d",
  })

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="text-muted-foreground">
            Historical analytics and performance metrics
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:gap-6">
        <TrafficChart data={analytics.traffic} />

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <RevenueChart data={analytics.revenue} />
          <ConversionFunnel data={analytics.conversionFunnel} />
        </div>

        <ProductPerformanceChart products={analytics.productPerformance} />
      </div>
    </div>
  )
}
