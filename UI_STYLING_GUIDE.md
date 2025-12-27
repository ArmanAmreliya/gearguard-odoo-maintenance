# MaintenX UI Styling Guide

## Overview

MaintenX features a modern, professional dark theme with teal and green accents, designed for enterprise maintenance management. The UI includes:

- 🎨 **Beautiful Landing Page** - Modern landing page with hero section, features, and CTA
- 🔐 **Styled Login Page** - Demo accounts with role-based styling
- 📊 **Dashboard Portal** - Role-based portal with responsive sidebar
- 🎯 **Metric Cards** - Reusable components for key metrics
- 🌈 **Role-Based Styling** - Different color schemes for ADMIN, TECHNICIAN, and USER roles

## Color Scheme

### Primary Colors
- **Primary Gradient**: `from-teal-500 to-green-500`
- **Primary Dark**: `from-teal-600 to-green-600`
- **Primary Light**: `from-teal-400 to-green-400`

### Role-Based Colors
- **ADMIN**: `from-red-500 to-pink-500`
- **TECHNICIAN**: `from-blue-500 to-cyan-500`
- **USER**: `from-green-500 to-teal-500`

### Status Colors
- **Success**: `text-green-400` (Completed)
- **Warning**: `text-orange-400` (In Progress)
- **Error**: `text-red-400` (Failed)
- **Info**: `text-blue-400` (Pending)

### Background Colors
- **Main Background**: `bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900`
- **Card Background**: `bg-slate-800/40 backdrop-blur`
- **Card Border**: `border-slate-700/50`

## Components

### 1. Landing Page (`components/landing-page.tsx`)

A modern, feature-rich landing page with:
- Navigation header with logo and CTA
- Hero section with gradient text and value proposition
- Stats section showing key metrics
- Features grid (6 cards)
- Call-to-action section
- Footer

**Usage:**
```tsx
import { LandingPage } from "@/components/landing-page"

export default function HomePage() {
  return <LandingPage />
}
```

### 2. Enhanced Login Page (`app/login/page.tsx`)

Features:
- Dark gradient background with decorative elements
- Branded header with logo
- Email/password form with validation
- Quick login demo accounts with role badges
- Demo mode information box

**Demo Accounts:**
- **Admin**: admin@maintenx.com
- **Technician**: tech@gearguard.com
- **User**: user@gearguard.com
- Password: Any password (demo mode)

### 3. Role-Based Portal (`components/role-based-portal.tsx`)

Responsive dashboard with:
- Fixed header with user info and logout
- Collapsible sidebar with role-based navigation
- Multiple tabs:
  - Overview (dashboard metrics)
  - Maintenance (task management)
  - Schedule (calendar view)
  - Teams (ADMIN only)
  - Analytics (reports)
  - Settings (ADMIN only)

**Props:**
```tsx
interface RolePortalProps {
  user: {
    email: string
    name: string
    role: "ADMIN" | "TECHNICIAN" | "USER"
  }
  onLogout?: () => void
}
```

### 4. Dashboard Layout (`components/dashboard-layout.tsx`)

Wrapper component for consistent dashboard styling across pages.

**Props:**
```tsx
interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    email: string
    name: string
    role: string
  }
}
```

### 5. Metric Card (`components/metric-card.tsx`)

Reusable component for displaying key metrics.

**Props:**
```tsx
interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    percentage: number
    trend: "up" | "down"
  }
  icon?: LucideIcon | React.ReactNode
  color?: "green" | "blue" | "orange" | "red" | "purple"
}
```

**Usage:**
```tsx
import { MetricCard } from "@/components/metric-card"
import { Clock } from "lucide-react"

<MetricCard
  title="Total Requests"
  value={299}
  change={{ percentage: 12, trend: "up" }}
  icon={Clock}
  color="orange"
/>
```

## Pages

### Landing Page
- **Route**: `/`
- **File**: Auto-redirects or shows landing page
- **Features**: Hero section, features grid, stats, CTAs

### Login Page
- **Route**: `/login`
- **File**: `app/login/page.tsx`
- **Features**: Dark theme, demo accounts, role badges

### Equipment Page
- **Route**: `/equipment`
- **File**: `app/equipment/page-new.tsx`
- **Features**: Equipment list, health metrics, status badges

### Requests Page
- **Route**: `/requests`
- **File**: `app/requests/page-new.tsx`
- **Features**: Request list, status tracking, statistics

### Admin Portal
- **Route**: `/admin`
- **File**: `app/admin/page-backup.tsx`
- **Features**: Role-based portal for admin users

## Theme Utilities

### `lib/theme.ts`

Centralized theme configuration:

```tsx
import { MAINTENX_COLORS, ROLE_STYLES, STATUS_COLORS } from "@/lib/theme"

// Primary colors
MAINTENX_COLORS.primary // "from-teal-500 to-green-500"

// Role-specific colors
ROLE_STYLES.ADMIN.color // "from-red-500 to-pink-500"
ROLE_STYLES.TECHNICIAN.color // "from-blue-500 to-cyan-500"
ROLE_STYLES.USER.color // "from-green-500 to-teal-500"

// Status colors
STATUS_COLORS.completed // { bg, border, text, label }
STATUS_COLORS.inProgress // { bg, border, text, label }
STATUS_COLORS.pending // { bg, border, text, label }
STATUS_COLORS.failed // { bg, border, text, label }
```

## Styling Classes

### Common Utilities

```tsx
// Card styling
"border border-slate-700/50 bg-slate-800/40 backdrop-blur"

// Text colors
"text-white" // Primary
"text-gray-400" // Secondary
"text-gray-500" // Muted

// Gradients
"bg-gradient-to-r from-teal-500 to-green-500"

// Hover effects
"hover:border-teal-500/50 transition"
"hover:bg-slate-900/60 transition"

// Badges
"bg-green-500/20 text-green-300 border border-green-500/30"
```

## Responsive Design

All components are fully responsive:
- Mobile: Full-width with stacked layout
- Tablet (md): 2-column grids, collapsible sidebar
- Desktop (lg+): Multi-column layouts, expanded features

## Dark Mode

The entire application uses dark mode by default. All colors are optimized for:
- 2x contrast ratio against backgrounds
- Readability in various lighting conditions
- Eye comfort for extended use

## Icons

Uses `lucide-react` for all icons:
```tsx
import { AlertTriangle, BarChart3, Users, Clock, ... } from "lucide-react"
```

## Customization

### Change Primary Color

Update in `components/landing-page.tsx` and `components/role-based-portal.tsx`:

```tsx
// Change from teal-green to blue-purple
"from-teal-500 to-green-500" → "from-blue-500 to-purple-500"
```

### Change Role Colors

Update `lib/theme.ts`:

```tsx
ROLE_STYLES.ADMIN.color = "from-blue-500 to-cyan-500"
```

### Add New Status

Update `lib/theme.ts`:

```tsx
STATUS_COLORS.archived = {
  bg: "bg-gray-500/20",
  border: "border-gray-500/30",
  text: "text-gray-300",
  label: "Archived",
}
```

## Performance

- **Backdrop Blur**: Uses `backdrop-blur` for subtle frosted glass effect
- **Lazy Loading**: Images and components use Suspense
- **CSS Classes**: Tailwind JIT compilation optimizes output
- **Icons**: SVG icons with lazy loading

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- WCAG AA compliant contrast ratios
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for interactive elements

## Future Enhancements

- [ ] Light mode toggle
- [ ] Custom color themes
- [ ] Dashboard widget customization
- [ ] Advanced data visualization
- [ ] Real-time notifications
- [ ] Mobile app version

---

**Last Updated**: December 27, 2025
**Version**: 1.0.0
