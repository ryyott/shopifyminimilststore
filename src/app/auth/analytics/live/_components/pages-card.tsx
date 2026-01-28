"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Clock } from "lucide-react"
import { type PageVisit } from "@/types/analytics"

interface PagesCardProps {
  pages: PageVisit[]
}

export function PagesCard({ pages }: PagesCardProps) {
  const maxVisits = Math.max(...pages.map((p) => p.visits))

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <Card className="bg-gradient-to-t from-primary/5 p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/30">
          <FileText className="size-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold">Top Pages</h3>
          <p className="text-sm text-muted-foreground">Most visited pages</p>
        </div>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.path} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{page.path}</span>
              <span className="text-muted-foreground">{page.visits} visits</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(page.visits / maxVisits) * 100} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>{formatDuration(page.avgDuration)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
