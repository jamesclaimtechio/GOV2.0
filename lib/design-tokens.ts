/**
 * Shared design tokens for consistent theming
 * Implements the color maps referenced in design.mdc line 95
 */

export const FRAMEWORK_COLORS = {
  GDPR: {
    gradient: 'from-blue-500 to-blue-700',
    solid: 'bg-blue-600',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    background: 'bg-blue-500/10',
  },
  NIS2: {
    gradient: 'from-purple-500 to-purple-700',
    solid: 'bg-purple-600',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    background: 'bg-purple-500/10',
  },
  ISO27001: {
    gradient: 'from-green-500 to-green-700',
    solid: 'bg-green-600',
    text: 'text-green-400',
    border: 'border-green-500/20',
    background: 'bg-green-500/10',
  },
  SOC2: {
    gradient: 'from-orange-500 to-orange-700',
    solid: 'bg-orange-600',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    background: 'bg-orange-500/10',
  },
  UK_GDPR: {
    gradient: 'from-blue-600 to-purple-600',
    solid: 'bg-blue-700',
    text: 'text-blue-300',
    border: 'border-blue-500/20',
    background: 'bg-blue-500/10',
  },
} as const

export const STATUS_COLORS = {
  MEETS: {
    text: 'text-green-400',
    background: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-400',
  },
  PARTIAL: {
    text: 'text-yellow-400',
    background: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: 'text-yellow-400',
  },
  MISSING: {
    text: 'text-red-400',
    background: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
  },
  UNCLEAR: {
    text: 'text-orange-400',
    background: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: 'text-orange-400',
  },
} as const

export const PRIORITY_COLORS = {
  URGENT: {
    text: 'text-red-400',
    background: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  HIGH: {
    text: 'text-orange-400',
    background: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  MEDIUM: {
    text: 'text-yellow-400',
    background: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  LOW: {
    text: 'text-slate-400',
    background: 'bg-slate-500/10',
    border: 'border-slate-500/20',
  },
} as const

export const ROLE_COLORS = {
  ADMIN: {
    text: 'text-purple-400',
    background: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  COMPLIANCE_LEAD: {
    text: 'text-blue-400',
    background: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  CONTROL_OWNER: {
    text: 'text-green-400',
    background: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  VIEWER: {
    text: 'text-slate-400',
    background: 'bg-slate-500/10',
    border: 'border-slate-500/20',
  },
} as const

// Helper functions for easy usage
export function getFrameworkColors(framework: string) {
  return FRAMEWORK_COLORS[framework as keyof typeof FRAMEWORK_COLORS] || {
    gradient: 'from-slate-500 to-slate-600',
    solid: 'bg-slate-600',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
    background: 'bg-slate-500/10',
  }
}

export function getStatusColors(status: string) {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.UNCLEAR
}

export function getPriorityColors(priority: string) {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.LOW
}

export function getRoleColors(role: string) {
  return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || ROLE_COLORS.VIEWER
}
