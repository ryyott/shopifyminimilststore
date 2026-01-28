"use client";

import { Badge } from "@/components/ui/badge";
import { type CustomerSegment } from "@/types/customer";
import { getSegmentLabel, getSegmentColor } from "@/lib/analytics/segmentation";
import { cn } from "@/lib/utils";

interface CustomerSegmentBadgeProps {
  segment: CustomerSegment;
  className?: string;
}

export function CustomerSegmentBadge({ segment, className }: CustomerSegmentBadgeProps) {
  const label = getSegmentLabel(segment);
  const colors = getSegmentColor(segment);

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {label}
    </Badge>
  );
}
