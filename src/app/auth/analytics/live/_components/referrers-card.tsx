"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Share2, ArrowRight, Search, Globe } from "lucide-react"
import { type Referrer } from "@/types/analytics"

interface ReferrersCardProps {
  referrers: Referrer[]
}

const getReferrerIcon = (source: string) => {
  const lowerSource = source.toLowerCase()
  if (lowerSource.includes("direct")) return ArrowRight
  if (lowerSource.includes("google")) return Search
  return Globe
}

export function ReferrersCard({ referrers }: ReferrersCardProps) {
  return (
    <Card className="bg-gradient-to-t from-primary/5 p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-950/30">
          <Share2 className="size-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold">Top Referrers</h3>
          <p className="text-sm text-muted-foreground">Traffic sources</p>
        </div>
      </div>

      <div className="space-y-4">
        {referrers.map((referrer) => {
          const Icon = getReferrerIcon(referrer.source)
          return (
            <div key={referrer.source} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  <span className="font-medium">{referrer.source}</span>
                </div>
                <span className="text-muted-foreground">
                  {referrer.visits} visits
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={referrer.percentage} className="h-2" />
                <span className="text-xs text-muted-foreground">
                  {referrer.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
