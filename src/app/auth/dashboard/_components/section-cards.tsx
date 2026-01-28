"use client"

import { AArrowUpIcon } from "@/components/ui/a-arrow-up"
import { AArrowDownIcon } from "@/components/ui/a-arrow-down"
import { useRef } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AArrowUpIconHandle } from "@/components/ui/a-arrow-up"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231.89"
        badge="+20.1%"
        footer="Trending up this month"
        description="Sales for the last month"
      />
      <MetricCard
        title="Orders"
        value="2,350"
        badge="+180"
        footer="Strong demand"
        description="Orders from last month"
      />
      <MetricCard
        title="Active Products"
        value="12"
        badge="+2"
        footer="All products in stock"
        description="Inventory is healthy"
      />
      <MetricCard
        title="Conversion Rate"
        value="3.2%"
        badge="+0.5%"
        footer="Improving steadily"
        description="Better than industry average"
      />
    </div>
  )
}

function MetricCard({
  title,
  value,
  badge,
  footer,
  description,
}: {
  title: string
  value: string
  badge: string
  footer: string
  description: string
}) {
  const iconRef = useRef<AArrowUpIconHandle>(null)

  return (
    <Card
      className="@container/card"
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <AArrowUpIcon ref={iconRef} className="h-3 w-3" size={12} />
            {badge}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex gap-2 font-medium">{footer}</div>
        <div className="text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  )
}
