"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { EmailSubscriber } from "@/types/email-subscriber";
import { getSubscriberGrowthData } from "@/lib/analytics/email-metrics";

interface SubscriberGrowthChartProps {
  subscribers: EmailSubscriber[];
  days?: number;
}

const chartConfig = {
  subscribers: {
    label: "Subscribers",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SubscriberGrowthChart({ subscribers, days = 30 }: SubscriberGrowthChartProps) {
  const chartData = useMemo(() => {
    const data = getSubscriberGrowthData(subscribers, days);
    return data.map((item) => ({
      date: item.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      subscribers: item.count,
    }));
  }, [subscribers, days]);

  const totalGrowth = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].subscribers;
    const last = chartData[chartData.length - 1].subscribers;
    if (first === 0) return 100;
    return Math.round(((last - first) / first) * 100);
  }, [chartData]);

  const currentTotal = chartData.length > 0 ? chartData[chartData.length - 1].subscribers : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Growth</CardTitle>
        <CardDescription>
          Total active subscribers over the last {days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
          <div className="text-3xl font-bold">{currentTotal}</div>
          <div className="text-muted-foreground text-sm">
            {totalGrowth > 0 ? "+" : ""}
            {totalGrowth}% growth
          </div>
        </div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="subscribers"
              type="monotone"
              fill="var(--color-subscribers)"
              fillOpacity={0.4}
              stroke="var(--color-subscribers)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
