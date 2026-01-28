"use client"

import { useState } from "react"
import { mockLiveAnalytics } from "@/lib/mock/analytics"
import { VisitorGlobe } from "./_components/visitor-globe"

export default function LiveAnalyticsPage() {
  const [analytics] = useState(mockLiveAnalytics)

  return (
    <div className="flex h-full flex-1">
      <VisitorGlobe analytics={analytics} />
    </div>
  )
}
