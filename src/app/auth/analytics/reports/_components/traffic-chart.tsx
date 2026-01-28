"use client"

import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { type TrafficData } from "@/types/analytics"
import { Users, Eye, TrendingUp } from "lucide-react"

interface TrafficChartProps {
  data: TrafficData[]
}

const chartConfig = {
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "#8b5cf6",
  },
  pageViews: {
    label: "Page Views",
    color: "#14b8a6",
  },
} satisfies ChartConfig

export function TrafficChart({ data }: TrafficChartProps) {
  // Calculate summary stats
  const stats = useMemo(() => {
    const totalUniqueVisitors = data.reduce((sum, d) => sum + d.uniqueVisitors, 0)
    const totalPageViews = data.reduce((sum, d) => sum + d.pageViews, 0)
    const avgPagesPerVisitor = totalUniqueVisitors > 0
      ? totalPageViews / totalUniqueVisitors
      : 0
    const avgBounceRate = data.reduce((sum, d) => sum + d.bounceRate, 0) / data.length

    return {
      totalUniqueVisitors,
      totalPageViews,
      avgPagesPerVisitor,
      avgBounceRate,
    }
  }, [data])

  // Transform data for recharts
  const chartData = data.map((d) => ({
    date: d.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    uniqueVisitors: d.uniqueVisitors,
    pageViews: d.pageViews,
  }))

  return (
    <Card className="@container/card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Traffic Overview</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Unique visitors and page views over time
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6">
        {/* Summary Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="size-3.5" />
              <span className="text-xs font-medium">Unique Visitors</span>
            </div>
            <p className="text-xl font-bold tracking-tight">
              {stats.totalUniqueVisitors.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Eye className="size-3.5" />
              <span className="text-xs font-medium">Page Views</span>
            </div>
            <p className="text-xl font-bold tracking-tight">
              {stats.totalPageViews.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="size-3.5" />
              <span className="text-xs font-medium">Pages/Visitor</span>
            </div>
            <p className="text-xl font-bold tracking-tight">
              {stats.avgPagesPerVisitor.toFixed(1)}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="size-3.5" />
              <span className="text-xs font-medium">Bounce Rate</span>
            </div>
            <p className="text-xl font-bold tracking-tight">
              {stats.avgBounceRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart data={chartData}>
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
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="uniqueVisitors"
              type="monotone"
              stroke="var(--color-uniqueVisitors)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="pageViews"
              type="monotone"
              stroke="var(--color-pageViews)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
