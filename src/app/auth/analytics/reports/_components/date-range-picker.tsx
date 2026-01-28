"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type DateRangeFilter, type TimeRange } from "@/types/analytics"

interface DateRangePickerProps {
  value: DateRangeFilter
  onChange: (value: DateRangeFilter) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const presets: { label: string; value: TimeRange }[] = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last 12 months", value: "12m" },
  ]

  const handlePresetClick = (preset: TimeRange) => {
    const to = new Date()
    const from = new Date()

    switch (preset) {
      case "7d":
        from.setDate(from.getDate() - 7)
        break
      case "30d":
        from.setDate(from.getDate() - 30)
        break
      case "90d":
        from.setDate(from.getDate() - 90)
        break
      case "12m":
        from.setMonth(from.getMonth() - 12)
        break
    }

    onChange({ from, to, preset })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="size-4" />
          <span>
            {format(value.from, "MMM d, yyyy")} -{" "}
            {format(value.to, "MMM d, yyyy")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="grid gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant={value.preset === preset.value ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handlePresetClick(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
