export const lightTheme = {
  colors: {
    background: "oklch(0.985 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(0.97 0 0)",
    cardForeground: "oklch(0.145 0 0)",
    popover: "oklch(0.97 0 0)",
    popoverForeground: "oklch(0.145 0 0)",
    primary: "oklch(0.145 0 0)",
    primaryForeground: "oklch(0.985 0 0)",
    secondary: "oklch(0.922 0 0)",
    secondaryForeground: "oklch(0.145 0 0)",
    muted: "oklch(0.922 0 0)",
    mutedForeground: "oklch(0.488 0 0)",
    accent: "oklch(0.922 0 0)",
    accentForeground: "oklch(0.145 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(0 0 0 / 10%)",
    input: "oklch(0 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    sidebar: "oklch(0.97 0 0)",
    sidebarForeground: "oklch(0.145 0 0)",
    sidebarPrimary: "oklch(0.488 0.243 264.376)",
    sidebarPrimaryForeground: "oklch(0.985 0 0)",
    sidebarAccent: "oklch(0.922 0 0)",
    sidebarAccentForeground: "oklch(0.145 0 0)",
    sidebarBorder: "oklch(0 0 0 / 10%)",
    sidebarRing: "oklch(0.556 0 0)",
    chart1: "oklch(0.65 0.28 275)",
    chart2: "oklch(0.68 0.22 185)",
    chart3: "oklch(0.879 0.1534 91.6054)",
    chart4: "oklch(0.7253 0.1752 349.7607)",
    chart5: "oklch(0.8003 0.1821 151.711)",
  },
  radius: {
    base: "0.75rem", // 12px - base radius for all components
    sm: "0.5rem",   // 8px
    md: "0.75rem",  // 12px
    lg: "1rem",     // 16px
    xl: "1.25rem",  // 20px
  },
  fontFamily: {
    helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  scale: {
    hover: "1.03",
  },
}

export type LightTheme = typeof lightTheme
