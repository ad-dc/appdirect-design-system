import { MantineThemeOverride, MantineColorsTuple } from '@mantine/core';
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
};
