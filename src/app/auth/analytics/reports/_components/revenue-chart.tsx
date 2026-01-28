"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type RevenueData } from "@/types/analytics"
import { DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

interface RevenueChartProps {
  data: RevenueData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: d.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: d.revenue,
        orders: d.orders,
      })),
    [data]
  )

  const totalRevenue = useMemo(
    () => data.reduce((sum, d) => sum + d.revenue, 0),
    [data]
  )
  const totalOrders = useMemo(() => data.reduce((sum, d) => sum + d.orders, 0), [data])

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue))
  const minRevenue = Math.min(...chartData.map((d) => d.revenue))
  const chartHeight = 200
  const chartPadding = 15

  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * 100
    const y =
      chartPadding +
      ((maxRevenue - d.revenue) / (maxRevenue - minRevenue)) *
        (chartHeight - chartPadding * 2)
    return { x, y, ...d }
  })

  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")

  const areaPath = `${pathData} L 100 ${chartHeight} L 0 ${chartHeight} Z`

  return (
    <Card className="@container/card overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <DollarSign className="size-4 text-emerald-500" />
          </motion.div>
          Revenue Analytics
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Total:{" "}
          <span className="font-medium text-foreground">
            ${totalRevenue.toLocaleString()}
          </span>{" "}
          from <span className="font-medium text-foreground">{totalOrders}</span> orders
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-6">
        <div className="relative" style={{ height: chartHeight }}>
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.path
              d={areaPath}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            <motion.path
              d={pathData}
              fill="none"
              stroke="hsl(var(--chart-2))"
              strokeWidth="0.3"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {points.map((point, i) => (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === i ? "0.8" : "0.4"}
                fill="hsl(var(--chart-2))"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all"
              />
            ))}
          </svg>

          <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 text-[10px] text-muted-foreground">
            {chartData.map((d, i) => {
              if (i % Math.ceil(chartData.length / 7) === 0 || i === chartData.length - 1) {
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.02 }}
                  >
                    {d.date}
                  </motion.span>
                )
              }
              return null
            })}
          </div>

          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute rounded-md border border-border bg-card px-2 py-1.5 shadow-lg"
              style={{
                left: `${points[hoveredIndex].x}%`,
                top: `${points[hoveredIndex].y}px`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div className="text-[10px] font-semibold text-foreground">
                ${points[hoveredIndex].revenue.toLocaleString()}
              </div>
              <div className="text-[9px] text-muted-foreground">
                {points[hoveredIndex].date}
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
