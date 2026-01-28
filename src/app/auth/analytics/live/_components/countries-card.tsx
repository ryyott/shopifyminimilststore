"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Globe } from "lucide-react"
import { type CountryStat } from "@/types/analytics"

interface CountriesCardProps {
  countries: CountryStat[]
}

export function CountriesCard({ countries }: CountriesCardProps) {
  return (
    <Card className="bg-gradient-to-t from-primary/5 p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
          <Globe className="size-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold">Top Countries</h3>
          <p className="text-sm text-muted-foreground">By location</p>
        </div>
      </div>

      <div className="space-y-4">
        {countries.map((country) => (
          <div key={country.countryCode} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">{country.flagEmoji}</span>
                <span className="font-medium">{country.country}</span>
              </div>
              <span className="text-muted-foreground">{country.visits}</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={country.percentage} className="h-2" />
              <span className="text-xs text-muted-foreground">
                {country.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
