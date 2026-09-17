/**
 * Design System Configuration
 * 
 * This file contains the core configuration for the design system,
 * including design tokens, component variants, and shared styling.
 */

import { MantineColorsTuple } from '@mantine/core';

// ========================== DESIGN TOKENS ==========================

/**
 * Design system color palette
 * Extends Mantine's default colors with custom brand colors
 */
export const designSystemColors = {
  // Custom brand colors
  primary: [
    '#e8f4fd',
    '#d0e7fb',
    '#9fccf4',
    '#6badee',
    '#4394e9',
    '#2d87e6',
    '#2080e6',
    '#1b6fd0',
    '#1864bc',
    '#1357a7'
  ] as MantineColorsTuple,
  
  secondary: [
    '#f0f9ff',
    '#e0f2fe',
    '#bae6fd',
    '#7dd3fc',
    '#38bdf8',
    '#0ea5e9',
    '#0284c7',
    '#0369a1',
    '#075985',
    '#0c4a6e'
  ] as MantineColorsTuple,
};

/**
 * Pixel lookup for the layout spacing scale (not a second runtime scale).
 * Mantine Core `xs–xl` plus added `none` / `xxs` / `xxl`. Layout primitives
 * pass `gap` through to Mantine; `styles/theme.ts` adds the extra keys.
 */
export const spacing = {
  none: '0px',
  xxs: '4px',
  xs: '10px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '32px',
  xxl: '48px',
} as const;



/**
 * Design system typography scale
 * Font sizes, weights, and line heights
 */
export const typography = {
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
} as const;

/**
 * Design system border radius values
 * Consistent border radius for components
 */
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

/**
 * Design system shadows
 * Box shadow definitions for elevation
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// ========================== COMPONENT VARIANTS ==========================

/**
 * Button component variants
 * Consistent button styling across the design system
 */
export const buttonVariants = {
  primary: {
    backgroundColor: '#326fde',
    color: '#ffffff',
    borderRadius: '4px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#2a5dc4',
    },
  },
  secondary: {
    backgroundColor: 'var(--mantine-color-gray-1)',
    color: 'var(--mantine-color-gray-8)',
    border: '1px solid var(--mantine-color-gray-3)',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-gray-2)',
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--mantine-color-gray-7)',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-gray-1)',
    },
  },
} as const;

/**
 * Input component variants
 * Consistent input styling across the design system
 */
export const inputVariants = {
  default: {
    borderColor: 'var(--mantine-color-gray-3)',
    '&:focus': {
      borderColor: 'var(--mantine-color-primary-6)',
    },
  },
  error: {
    borderColor: 'var(--mantine-color-red-6)',
    '&:focus': {
      borderColor: 'var(--mantine-color-red-6)',
    },
  },
  success: {
    borderColor: 'var(--mantine-color-green-6)',
    '&:focus': {
      borderColor: 'var(--mantine-color-green-6)',
    },
  },
} as const;

// ========================== COMMON PROPS ==========================
// Size tokens are canonically defined in types.ts (DS_SIZES / DSSize).
// Re-exported here for backward compatibility with existing component imports.

export { DS_SIZES as componentSizes } from './types';
export type { DSSize as ComponentSize } from './types';

/**
 * Mantine color palette names accepted by components that pass through
 * to Mantine's color prop. Distinct from semantic colors in types.ts.
 */
export const componentColors = [
  'primary',
  'secondary',
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
] as const;
export type ComponentColor = typeof componentColors[number];

// ========================== DESIGN SYSTEM UTILITIES ==========================

/**
 * Get consistent spacing value
 */
export const getSpacing = (size: keyof typeof spacing) => spacing[size];

/**
 * Get consistent border radius value
 */
export const getBorderRadius = (size: keyof typeof borderRadius) => borderRadius[size];

/**
 * Get consistent shadow value
 */
export const getShadow = (size: keyof typeof shadows) => shadows[size];

/**
 * Generate component class names with AppDirect Design System prefix
 */
export const addsClassName = (component: string, modifier?: string) => {
  const base = `adds-${component}`;
  return modifier ? `${base}--${modifier}` : base;
}; 