import { MantineThemeOverride, MantineColorsTuple } from '@mantine/core';
import * as OpenColor from 'open-color';

const getOpenColorPalette = (colorName: string): string[] => {
  return (OpenColor as any)[colorName] as string[];
};

const createMantineColors = (): Record<string, string[]> => {
  return Object.entries(OpenColor).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string[]>);
};

const createAccessibleBlue = (): MantineColorsTuple => {
  const originalBlue = getOpenColorPalette('blue');

  return [
    originalBlue[0],
    originalBlue[1],
    originalBlue[2],
    originalBlue[3],
    originalBlue[4],
    originalBlue[5],
    '#326FDE',
    originalBlue[7],
    originalBlue[8],
    originalBlue[9],
  ];
};

const THEME_CONSTANTS = {
  primaryColor: 'blue' as const,
  defaultRadius: 'sm' as const,
  fontFamily: 'var(--font-inter), sans-serif',
  fontFamilyMonospace: 'var(--font-roboto-mono), monospace',
} as const;

export const theme: MantineThemeOverride = {
  primaryColor: THEME_CONSTANTS.primaryColor,
  colors: {
    ...createMantineColors(),
    blue: createAccessibleBlue(),
  },
  defaultRadius: THEME_CONSTANTS.defaultRadius,
  fontFamily: THEME_CONSTANTS.fontFamily,
  fontFamilyMonospace: THEME_CONSTANTS.fontFamilyMonospace,
};
