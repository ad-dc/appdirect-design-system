import { MantineThemeOverride, MantineColorsTuple, MantineTheme } from '@mantine/core';
import * as OpenColor from 'open-color';

/**
 * Utility to safely access OpenColor palettes
 */
const getOpenColorPalette = (colorName: string): string[] => {
  return (OpenColor as any)[colorName] as string[];
};

/**
 * Convert OpenColor palettes to Mantine color format
 */
const createMantineColors = (): Record<string, string[]> => {
  return Object.entries(OpenColor).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string[]>);
};

/**
 * Create accessibility-compliant blue palette
 * Overrides blue[6] with WCAG AA compliant color
 */
const createAccessibleBlue = (): MantineColorsTuple => {
  const originalBlue = getOpenColorPalette('blue');
  
  return [
    originalBlue[0], // blue.0
    originalBlue[1], // blue.1
    originalBlue[2], // blue.2
    originalBlue[3], // blue.3
    originalBlue[4], // blue.4
    originalBlue[5], // blue.5
    '#326FDE',       // blue.6 - A11y compliant
    originalBlue[7], // blue.7
    originalBlue[8], // blue.8
    originalBlue[9], // blue.9
  ];
};

// Theme constants
const THEME_CONSTANTS = {
  primaryColor: 'blue' as const,
  defaultRadius: 'sm' as const,
  fontFamily: 'var(--font-inter), sans-serif',
  fontFamilyMonospace: 'var(--font-roboto-mono), monospace',
} as const;

/**
 * Per-variant Button colors (light theme).
 *
 * Snapshot of the AppDirect design-tokens mantine adapter — kept inline here
 * so that `appdirect-design-system` does not depend on the in-flight
 * `@appdirect/design-tokens` package. When that package ships a stable
 * Artifactory release, this map can be deleted in favor of importing the
 * adapter CSS again.
 *
 * Mantine 9's filled-style CSS consumes `--button-bg`, `--button-hover`,
 * `--button-color`, `--button-bd` automatically. Active-state colors are
 * applied via `Button.module.css` since Mantine does not expose an active-bg
 * CSS variable.
 */
type ButtonVariantColors = {
  bg: string;
  fg: string;
  bd: string;
  bgHover: string;
};

const BUTTON_VARIANT_COLORS: Record<string, ButtonVariantColors> = {
  primary:   { bg: '#326FDE',    fg: '#f8f9fa', bd: 'transparent', bgHover: '#1c7ed6' },
  secondary: { bg: '#15aabf',    fg: '#000000', bd: 'transparent', bgHover: '#1098ad' },
  default:   { bg: '#ffffff',    fg: '#000000', bd: '#ced4da',     bgHover: '#f8f9fa' },
  outline:   { bg: 'transparent', fg: '#326FDE', bd: '#326FDE',    bgHover: 'rgba(50, 111, 222, 0.06)' },
  danger:    { bg: '#fa5252',    fg: '#f8f9fa', bd: 'transparent', bgHover: '#f03e3e' },
  link:      { bg: 'transparent', fg: '#326FDE', bd: 'transparent', bgHover: 'transparent' },
  secret:    { bg: 'transparent', fg: '#868e96', bd: 'transparent', bgHover: 'transparent' },
  disabled:  { bg: '#e9ecef',    fg: '#adb5bd', bd: 'transparent', bgHover: '#e9ecef' },
};

/**
 * Main theme configuration
 */
export const theme: MantineThemeOverride = {
  primaryColor: THEME_CONSTANTS.primaryColor,
  
  colors: {
    ...createMantineColors(),
    blue: createAccessibleBlue(),
  },
  
  // Design system defaults
  defaultRadius: THEME_CONSTANTS.defaultRadius,
  fontFamily: THEME_CONSTANTS.fontFamily,
  fontFamilyMonospace: THEME_CONSTANTS.fontFamilyMonospace,

  components: {
    Button: {
      vars: (_theme: MantineTheme, props: { variant?: string }) => {
        const variant = props.variant as keyof typeof BUTTON_VARIANT_COLORS | undefined;
        const v = variant && BUTTON_VARIANT_COLORS[variant];
        if (!v) return { root: {} };
        return {
          root: {
            '--button-bg': v.bg,
            '--button-hover': v.bgHover,
            '--button-color': v.fg,
            '--button-bd': `1px solid ${v.bd}`,
          },
        };
      },
    },
  },
};
