// Color scheme for MaintenX - Modern dark theme with teal/green accents

export const MAINTENX_COLORS = {
  // Primary gradients
  primary: "from-teal-500 to-green-500",
  primaryDark: "from-teal-600 to-green-600",
  primaryLight: "from-teal-400 to-green-400",

  // Secondary gradients
  admin: "from-red-500 to-pink-500",
  technician: "from-blue-500 to-cyan-500",
  user: "from-green-500 to-teal-500",

  // Accent colors
  success: "text-green-400",
  warning: "text-orange-400",
  error: "text-red-400",
  info: "text-blue-400",

  // Background
  background: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
  card: "bg-slate-800/40 backdrop-blur",
  cardBorder: "border-slate-700/50",

  // Text colors
  textPrimary: "text-white",
  textSecondary: "text-gray-400",
  textMuted: "text-gray-500",
}

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

// Theme variants for different roles
export const ROLE_STYLES = {
  ADMIN: {
    color: "from-red-500 to-pink-500",
    lightColor: "from-red-400 to-pink-400",
    darkColor: "from-red-600 to-pink-600",
    bgAccent: "bg-red-500/20",
    borderAccent: "border-red-500/30",
    textAccent: "text-red-300",
  },
  TECHNICIAN: {
    color: "from-blue-500 to-cyan-500",
    lightColor: "from-blue-400 to-cyan-400",
    darkColor: "from-blue-600 to-cyan-600",
    bgAccent: "bg-blue-500/20",
    borderAccent: "border-blue-500/30",
    textAccent: "text-blue-300",
  },
  USER: {
    color: "from-green-500 to-teal-500",
    lightColor: "from-green-400 to-teal-400",
    darkColor: "from-green-600 to-teal-600",
    bgAccent: "bg-green-500/20",
    borderAccent: "border-green-500/30",
    textAccent: "text-green-300",
  },
}

// Status badge colors
export const STATUS_COLORS = {
  completed: {
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-300",
    label: "Completed",
  },
  inProgress: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-300",
    label: "In Progress",
  },
  pending: {
    bg: "bg-orange-500/20",
    border: "border-orange-500/30",
    text: "text-orange-300",
    label: "Pending",
  },
  failed: {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-300",
    label: "Failed",
  },
}
