/**
 * Shared unions imported by DS wrappers.
 *
 * Wrapper TSX is still the implementation source of truth. These arrays must
 * match the wrappers that import them (`Button`, `Badge`, `Alert`). Do not
 * treat this file as a second API.
 */

// ========================== SIZE TOKENS ==========================

/**
 * Standardized size tokens for all Design System components
 * Maps 1:1 with Mantine's size tokens
 */
export const DS_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type DSSize = typeof DS_SIZES[number];

// ========================== VARIANT TOKENS ==========================

/**
 * Canonical variant values for the Design System
 * Not all components support all variants - each component defines its subset
 */
export const DS_VARIANTS = ['filled', 'outline', 'light', 'subtle', 'transparent'] as const;
export type DSVariant = typeof DS_VARIANTS[number];

/**
 * Button-specific variants (extends canonical variants with semantic additions)
 */
export const DS_BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'default',
  'disabled',
  'link',
  'secret',
  'outline',
  'danger',
] as const;
export type DSButtonVariant = typeof DS_BUTTON_VARIANTS[number];

/**
 * Badge `variant` values on the wrapper. Figma Code Connect exposes
 * `filled` | `outline`; the wrapper also accepts semantic names as shortcuts.
 */
export const DS_BADGE_VARIANTS = [
  'filled',
  'outline',
  'info',
  'success',
  'danger',
  'pending',
  'default',
  'warning',
] as const;
export type DSBadgeVariant = typeof DS_BADGE_VARIANTS[number];

/**
 * Badge `color` values on the wrapper (semantic names plus Mantine aliases).
 */
export const DS_BADGE_COLORS = [
  'info',
  'success',
  'danger',
  'pending',
  'default',
  'warning',
  'blue',
  'green',
  'red',
  'yellow',
  'gray',
] as const;
export type DSBadgeColor = typeof DS_BADGE_COLORS[number];

/**
 * Alert `color` / deprecated `type` on the wrapper. No `warning` — use `pending`.
 */
export const DS_ALERT_COLORS = ['info', 'success', 'danger', 'pending', 'default'] as const;
export type DSAlertColor = typeof DS_ALERT_COLORS[number];

// ========================== SEMANTIC COLOR TOKENS ==========================

/**
 * Semantic color names for the Design System
 * These are the ONLY color values that should be exposed in the public API
 */
export const DS_SEMANTIC_COLORS = [
  'neutral',   // Gray scale - for default/inactive states
  'info',      // Blue - for informational content
  'success',   // Green - for success/positive states
  'warning',   // Yellow/Orange - for warnings/caution
  'danger',    // Red - for errors/destructive actions
  'highlight', // Violet/Accent - for highlighting/emphasis
] as const;
export type DSSemanticColor = typeof DS_SEMANTIC_COLORS[number];

/**
 * Status-oriented semantic colors (commonly used for feedback)
 * A subset focused on status indication
 */
export const DS_STATUS_COLORS = ['default', 'info', 'success', 'warning', 'danger', 'pending'] as const;
export type DSStatusColor = typeof DS_STATUS_COLORS[number];

/**
 * Semantic → Mantine color map. Wrappers that import a map must stay in sync.
 */
export const SEMANTIC_TO_MANTINE_COLOR: Record<DSSemanticColor, string> = {
  neutral: 'gray',
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  highlight: 'violet',
} as const;

/**
 * Status color mapping (Badge / Chip / Indicator). Alert uses `DS_ALERT_COLORS`
 * (no `warning`).
 */
export const STATUS_TO_MANTINE_COLOR: Record<DSStatusColor, string> = {
  default: 'gray',
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  pending: 'yellow',
} as const;

export const ALERT_TO_MANTINE_COLOR: Record<DSAlertColor, string> = {
  default: 'gray',
  info: 'blue',
  success: 'green',
  danger: 'red',
  pending: 'yellow',
} as const;

// ========================== HELPER FUNCTIONS ==========================

/**
 * Convert semantic color to Mantine color
 */
export function getSemanticColor(semanticColor: DSSemanticColor): string {
  return SEMANTIC_TO_MANTINE_COLOR[semanticColor];
}

/**
 * Convert status color to Mantine color
 */
export function getStatusColor(statusColor: DSStatusColor): string {
  return STATUS_TO_MANTINE_COLOR[statusColor];
}

// ========================== COMMON PROP INTERFACES ==========================

/**
 * Base props that many components share
 */
export interface DSCommonProps {
  /** Size from design system scale */
  size?: DSSize;
  /** Whether component is disabled */
  disabled?: boolean;
}

/**
 * Common input props (for TextInput, TextArea, Select, etc.)
 */
export interface DSInputCommonProps extends DSCommonProps {
  /** Input label */
  label?: React.ReactNode;
  /** Description text below the input */
  description?: string;
  /** Error message or boolean for error state */
  error?: React.ReactNode;
  /** Whether input is required */
  required?: boolean;
  /** Whether to show "(Optional)" text */
  showOptional?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Common button props
 */
export interface DSButtonCommonProps extends DSCommonProps {
  /** Button variant */
  variant?: DSButtonVariant;
  /** Whether button takes full width */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Common feedback props (for Alert, Badge, Indicator, etc.)
 */
export interface DSFeedbackCommonProps {
  /** Semantic type/color for feedback */
  type?: DSStatusColor;
}
