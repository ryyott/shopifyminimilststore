Theme System – How It Works

This document explains how the theme system works in this project, how components consume it, and how to extend it safely.

The goal:
	•	Single source of truth for styling
	•	No hard-coded colors in components
	•	Easy re-theming (dark / light / brand / white-label)

⸻

1. Core Idea (High Level)

The theme is data, not logic.
	1.	A theme file defines colors, radii, spacing, etc.
	2.	The theme is injected into the app as CSS variables.
	3.	Components reference only CSS variables (via classes).
	4.	Changing the theme file updates the entire UI.

Components never import the theme directly.

⸻

2. Theme Source of Truth

Theme files live in /theme.

Example:

// /theme/default.ts
export const theme = {
  colors: {
    background: "#0f0f12",
    surface: "#18181d",
    primary: "#7c7cff",
    secondary: "#22c55e",
    border: "#27272a",
    text: {
      primary: "#ffffff",
      secondary: "#a1a1aa",
      muted: "#71717a"
    }
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px"
  }
}

This file:
	•	Contains no React code
	•	Can be shared across apps
	•	Can be versioned or white-labeled

⸻

3. Injecting the Theme (CSS Variables)

The theme is converted into CSS variables once at app startup.

Example (Next.js):

// app/theme-provider.tsx
import { theme } from "@/theme/default"

export function ThemeProvider() {
  return (
    <style jsx global>{`
      :root {
        --bg: ${theme.colors.background};
        --surface: ${theme.colors.surface};
        --primary: ${theme.colors.primary};
        --secondary: ${theme.colors.secondary};
        --border: ${theme.colors.border};

        --text-primary: ${theme.colors.text.primary};
        --text-secondary: ${theme.colors.text.secondary};
        --text-muted: ${theme.colors.text.muted};

        --radius-sm: ${theme.radius.sm};
        --radius-md: ${theme.radius.md};
        --radius-lg: ${theme.radius.lg};
      }
    `}</style>
  )
}

This runs once and defines global variables.

⸻

4. How Components Consume the Theme

Components never import the theme.

❌ Incorrect

import { theme } from "@/theme/default"

<div style={{ color: theme.colors.primary }} />

✅ Correct

<div className="text-primary bg-surface rounded-md" />

CSS:

.text-primary {
  color: var(--text-primary);
}

.bg-surface {
  background-color: var(--surface);
}

.rounded-md {
  border-radius: var(--radius-md);
}

This keeps components:
	•	Stateless
	•	Theme-agnostic
	•	Reusable

⸻

5. Tailwind Integration (Optional)

If using Tailwind, map CSS variables in tailwind.config.js.

theme: {
  colors: {
    background: "var(--bg)",
    surface: "var(--surface)",
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    border: "var(--border)",
    text: {
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
      muted: "var(--text-muted)"
    }
  },
  borderRadius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)"
  }
}

Now all Tailwind utilities respect the active theme.

⸻

6. Supporting Multiple Themes

Create multiple theme files:

/theme/dark.ts
/theme/light.ts
/theme/vintage.ts

Switch which file is imported by ThemeProvider.

Advanced setups can:
	•	Load theme from DB
	•	Load theme by brand
	•	Load theme per tenant

⸻

7. Why This Architecture

This system provides:
	•	One source of truth
	•	Zero prop drilling
	•	Zero runtime overhead
	•	Easy re-branding
	•	Easy Shopify / admin / storefront reuse

It scales from a single site to white-label platforms.

⸻

8. Rules to Follow (Important)
	•	❌ Never hard-code hex colors in components
	•	❌ Never import theme files inside components
	•	❌ Never style directly from JS
	•	✅ Always use CSS variables
	•	✅ Keep theme files pure data

If these rules are followed, theming stays trivial forever.

⸻

9. Extending the Theme

Safe additions:
	•	Shadows
	•	Font families
	•	Spacing scale
	•	Z-index tokens

Avoid:
	•	Component-specific tokens
	•	Page-specific tokens

Theme = design system, not UI logic.

⸻

10. Summary
	•	Theme lives as data
	•	CSS variables are the contract
	•	Components stay dumb
	•	Re-theming is instant

This is the foundation for a clean, scalable UI system.