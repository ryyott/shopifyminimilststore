"use client"

import { theme } from "@/theme/default"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --background: ${theme.colors.background};
          --foreground: ${theme.colors.foreground};
          --card: ${theme.colors.card};
          --card-foreground: ${theme.colors.cardForeground};
          --popover: ${theme.colors.popover};
          --popover-foreground: ${theme.colors.popoverForeground};
          --primary: ${theme.colors.primary};
          --primary-foreground: ${theme.colors.primaryForeground};
          --secondary: ${theme.colors.secondary};
          --secondary-foreground: ${theme.colors.secondaryForeground};
          --muted: ${theme.colors.muted};
          --muted-foreground: ${theme.colors.mutedForeground};
          --accent: ${theme.colors.accent};
          --accent-foreground: ${theme.colors.accentForeground};
          --destructive: ${theme.colors.destructive};
          --border: ${theme.colors.border};
          --input: ${theme.colors.input};
          --ring: ${theme.colors.ring};
          --radius: ${theme.radius.base};
          --sidebar: ${theme.colors.sidebar};
          --sidebar-foreground: ${theme.colors.sidebarForeground};
          --sidebar-primary: ${theme.colors.sidebarPrimary};
          --sidebar-primary-foreground: ${theme.colors.sidebarPrimaryForeground};
          --sidebar-accent: ${theme.colors.sidebarAccent};
          --sidebar-accent-foreground: ${theme.colors.sidebarAccentForeground};
          --sidebar-border: ${theme.colors.sidebarBorder};
          --sidebar-ring: ${theme.colors.sidebarRing};
          --chart-1: ${theme.colors.chart1};
          --chart-2: ${theme.colors.chart2};
          --chart-3: ${theme.colors.chart3};
          --chart-4: ${theme.colors.chart4};
          --chart-5: ${theme.colors.chart5};

          --radius-sm: ${theme.radius.sm};
          --radius-md: ${theme.radius.md};
          --radius-lg: ${theme.radius.lg};
          --radius-xl: ${theme.radius.xl};
          --radius-base: ${theme.radius.base};

          --font-family-helvetica: ${theme.fontFamily.helvetica};
          --scale-103: ${theme.scale.hover};
        }
      `}</style>
      {children}
    </>
  )
}
