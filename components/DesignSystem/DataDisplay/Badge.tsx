'use client';

import React, { forwardRef } from 'react';
import { Badge as MantineBadge, BadgeProps as MantineBadgeProps } from '@mantine/core';
import { ComponentSize } from '../config';
import { type DSBadgeColor, type DSBadgeVariant } from '../types';

/**
 * Enhanced Badge props extending Mantine's BadgeProps
 */
export interface DSBadgeProps extends Omit<MantineBadgeProps, 'size' | 'color' | 'variant'> {
  /** Badge size from design system scale */
  size?: ComponentSize;
  /** Badge style variant */
  variant?: DSBadgeVariant;
  /** Badge semantic color variant */
  color?: DSBadgeColor;
}

/**
 * AppDirect Design System Badge Component
 * 
 * A semantic badge component built on top of Mantine's Badge with
 * consistent design system styling and restricted color options.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Badge>Default</Badge>
 * 
 * // Different variants
 * <Badge variant="filled" color="info">Info</Badge>
 * <Badge variant="outline" color="success">Success</Badge>
 * <Badge variant="filled" color="danger">Danger</Badge>
 * <Badge variant="outline" color="pending">Pending</Badge>
 * ```
 * 
 * @example
 * ```tsx
 * // Different sizes
 * <Badge size="sm" color="info">Small</Badge>
 * <Badge size="md" color="success">Medium</Badge>
 * <Badge size="lg" color="danger">Large</Badge>
 * ```
 * 
 * @example
 * ```tsx
 * // All color variants
 * <Badge color="default">Default</Badge>
 * <Badge color="info">Info</Badge>
 * <Badge color="success">Success</Badge>
 * <Badge color="danger">Danger</Badge>
 * <Badge color="pending">Pending</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLDivElement, DSBadgeProps>(
  (
    {
      variant = 'filled',
      size = 'md',
      color = 'default',
      children,
      ...props
    },
    ref
  ) => {
    // Map design system colors to Mantine colors
    const getMantineColor = (dsColor: DSBadgeProps['color'], dsVariant: DSBadgeProps['variant']) => {
      const resolvedColor = dsColor === 'default' && ['info', 'success', 'danger', 'pending', 'warning'].includes(dsVariant || '')
        ? (dsVariant === 'warning' ? 'pending' : dsVariant)
        : dsColor;

      switch (resolvedColor) {
        case 'info':
        case 'blue':
          return 'blue';
        case 'success':
        case 'green':
          return 'green';
        case 'danger':
        case 'red':
          return 'red';
        case 'pending':
        case 'warning':
        case 'yellow':
          return 'yellow';
        case 'default':
        case 'gray':
          return 'gray';
        default:
          return 'gray';
      }
    };

    const getMantineVariant = (dsVariant: DSBadgeProps['variant']) => {
      switch (dsVariant) {
        case 'outline':
          return 'outline';
        default:
          return 'filled';
      }
    };

    return (
      <MantineBadge
        ref={ref}
        variant={getMantineVariant(variant)}
        size={size}
        color={getMantineColor(color, variant)}
        radius="sm"
        {...props}
      >
        {children}
      </MantineBadge>
    );
  }
);

Badge.displayName = 'Badge'; 
