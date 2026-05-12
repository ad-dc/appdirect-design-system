'use client';

import { ThemeIcon as MantineThemeIcon, ThemeIconProps as MantineThemeIconProps } from '@mantine/core';
import { forwardRef } from 'react';

export type ThemeIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type ThemeIconColor = 'default' | 'blue' | string;
export type ThemeIconVariant = NonNullable<MantineThemeIconProps['variant']> | 'info' | 'success' | 'danger' | 'pending';

export interface DSThemeIconProps extends Omit<MantineThemeIconProps, 'size' | 'color'> {
  /** ThemeIcon content */
  children: React.ReactNode;
  /** Size of the ThemeIcon - supports Mantine t-shirt sizes plus xxl (58x58px) */
  size?: ThemeIconSize | number;
  /** Color variant - default (gray icon) or blue (blue icon), both use default variant styling */
  color?: ThemeIconColor;
  /** Variant with optional semantic aliases */
  variant?: ThemeIconVariant;
}

export const ThemeIcon = forwardRef<HTMLDivElement, DSThemeIconProps>(
  ({ children, size = 'md', color = 'default', variant = 'default', style, ...props }, ref) => {
    // Handle xxl size which should be 58x58px
    const getSize = () => {
      if (size === 'xxl') {
        return 58;
      }
      return size;
    };

    const resolvedVariant =
      variant === 'info' || variant === 'success' || variant === 'danger' || variant === 'pending'
        ? 'light'
        : variant;

    const resolvedColor =
      color !== 'default'
        ? color
        : variant === 'info'
          ? 'blue'
          : variant === 'success'
            ? 'green'
            : variant === 'danger'
              ? 'red'
              : variant === 'pending'
                ? 'yellow'
                : 'default';

    // For blue/default semantic variants, prefer explicit icon color
    const iconStyle = resolvedColor === 'blue' ? { color: 'var(--ad-color-brand-primary)', ...style } : style;

    return (
      <MantineThemeIcon
        ref={ref}
        size={getSize()}
        variant={resolvedVariant}
        color={resolvedColor === 'default' ? undefined : resolvedColor}
        style={iconStyle}
        {...props}
      >
        {children}
      </MantineThemeIcon>
    );
  }
);

ThemeIcon.displayName = 'ThemeIcon'; 
