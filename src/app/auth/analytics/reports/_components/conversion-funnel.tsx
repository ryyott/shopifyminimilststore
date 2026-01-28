"use client"

import { type ConversionFunnelStep } from "@/types/analytics"
import { TrendingDown } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { motion } from "framer-motion"

interface ConversionFunnelProps {
  data: ConversionFunnelStep[]
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const maxVisitors = Math.max(...data.map((d) => d.visitors))

  return (
    <Card className="@container/card overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Conversion Funnel</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          User journey from view to purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6">
        <div className="space-y-2">
          {data.map((step, index) => {
            const widthPercentage = (step.visitors / maxVisitors) * 100

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {step.step}
                  </span>
                </div>

                <div className="relative">
                  <div className="relative h-9 overflow-hidden rounded-lg bg-secondary/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercentage}%` }}
                      transition={{
                        delay: index * 0.1 + 0.2,
                        duration: 0.8,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg,
                          hsl(var(--chart-${(index % 5) + 1})) 0%,
                          hsl(var(--chart-${(index % 5) + 1})) 50%,
                          hsl(var(--chart-${((index + 1) % 5) + 1})) 100%)`,
                        boxShadow: `0 2px 12px -2px hsl(var(--chart-${(index % 5) + 1}) / 0.25)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </motion.div>

                    <div className="relative flex h-full items-center justify-between px-3">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.6, duration: 0.4 }}
                        className="text-xs font-medium text-foreground"
                      >
                        {step.visitors.toLocaleString()} visitors
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.6, duration: 0.4 }}
                        className="text-xs font-semibold text-foreground"
                      >
                        {step.percentage.toFixed(1)}% of total
                      </motion.span>
                    </div>
                  </div>

                  {step.dropoff > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7, duration: 0.3 }}
                      className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500"
                    >
                      <TrendingDown className="size-3" />
                      {step.dropoff.toFixed(1)}% dropoff
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
