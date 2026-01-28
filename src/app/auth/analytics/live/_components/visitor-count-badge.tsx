"use client"

import { Badge } from "@/components/ui/badge"
import { Users, Wifi } from "lucide-react"

interface VisitorCountBadgeProps {
  count: number
  online: number
}

export function VisitorCountBadge({ count, online }: VisitorCountBadgeProps) {
  return (
    <div className="flex gap-2">
      <Badge variant="secondary" className="gap-2 px-4 py-2 text-base">
        <Users className="size-4" />
        <span className="font-bold">{count}</span>
        <span className="text-muted-foreground">Total Visitors</span>
      </Badge>
      <Badge
        variant="secondary"
        className="gap-2 bg-green-100 px-4 py-2 text-base text-green-700 dark:bg-green-950/30 dark:text-green-400"
      >
        <Wifi className="size-4" />
        <span className="font-bold">{online}</span>
        <span>Online</span>
      </Badge>
    </div>
  )
}
