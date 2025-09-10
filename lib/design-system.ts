/**
 * Design System Constants
 * 
 * This file contains all design system values for consistent usage across the application.
 * Always prefer using CSS custom properties or Tailwind classes over these constants
 * for better maintainability and theme support.
 */

export const COLORS = {
  primary: {
    hsl: 'hsl(75, 31%, 48%)',
    hex: '#6B8E23',
    cssVar: 'hsl(var(--primary))',
    description: 'Primary brand green - used for main actions, buttons, and brand elements'
  },
  'primary-foreground': {
    hsl: 'hsl(0, 0%, 100%)',
    hex: '#FFFFFF',
    cssVar: 'hsl(var(--primary-foreground))',
    description: 'Text color for primary elements (white)'
  },
  'primary-light': {
    hsl: 'hsl(75, 31%, 92%)',
    hex: '#F0F4E8',
    cssVar: 'hsl(var(--primary-light))',
    description: 'Light variant of primary green for backgrounds'
  },
  secondary: {
    hsl: 'hsl(348, 92%, 63%)',
    hex: '#E91E63',
    cssVar: 'hsl(var(--secondary))',
    description: 'Secondary brand pink - used for secondary actions and accents'
  },
  'secondary-foreground': {
    hsl: 'hsl(0, 0%, 100%)',
    hex: '#FFFFFF',
    cssVar: 'hsl(var(--secondary-foreground))',
    description: 'Text color for secondary elements (white)'
  },
  'secondary-light': {
    hsl: 'hsl(344, 84%, 78%)',
    hex: '#F8BBD9',
    cssVar: 'hsl(var(--secondary-light))',
    description: 'Light variant of secondary pink'
  },
  pomeraPink: {
    hsl: 'hsl(344, 100%, 92%)',
    hex: '#FCE4F1',
    cssVar: 'hsl(var(--pomera-pink))',
    description: 'Very light Pomera pink for subtle backgrounds'
  }
} as const;

export const BRAND_COLORS = {
  green: COLORS.primary,
  pink: COLORS.secondary,
  'light-green': COLORS['primary-light'],
  'light-pink': COLORS['secondary-light']
} as const;

// Common usage patterns
export const USAGE_PATTERNS = {
  primaryButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondaryButton: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  primaryText: 'text-primary',
  secondaryText: 'text-secondary',
  primaryBackground: 'bg-primary-light',
  secondaryBackground: 'bg-secondary-light'
} as const;

// Helper function to get color by name
export function getBrandColor(colorName: keyof typeof BRAND_COLORS) {
  return BRAND_COLORS[colorName];
}

// Helper function to get usage pattern
export function getUsagePattern(patternName: keyof typeof USAGE_PATTERNS) {
  return USAGE_PATTERNS[patternName];
}
