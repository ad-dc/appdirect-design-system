'use client';

import React, { forwardRef } from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';
import { ComponentSize } from '../config';
import { type DSButtonVariant } from '../types';
import styles from './Button.module.css';

/**
 * Enhanced Button props extending Mantine's ButtonProps
 */
export interface DSButtonProps extends Omit<MantineButtonProps, 'size' | 'color' | 'variant'> {
  /** Button size from design system scale */
  size?: ComponentSize;
  /** @deprecated Color is now driven by design tokens via mantine.css adapter; this prop is ignored */
  color?: string;
  /** Button style variant */
  variant?: DSButtonVariant;
  /** Whether button takes full width */
  fullWidth?: boolean;
  /** Loading state with spinner */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Content to display on the left side (e.g., icon, badge) */
  leftSection?: React.ReactNode;
  /** Content to display on the right side (e.g., icon, badge) */
  rightSection?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * AppDirect Design System Button Component
 * 
 * A enhanced button component built on top of Mantine's Button with
 * consistent design system styling and additional functionality.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 * 
 * // Primary button with icon
 * <Button variant="primary" leftSection={<Icon />}>
 *   Save Changes
 * </Button>
 * 
 * // Loading state
 * <Button loading>Processing...</Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Different variants
 * <Button variant="primary">Primary</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="default">Default</Button>
 * <Button variant="outline">Outline</Button>
 * <Button variant="danger">Danger</Button>
 * <Button variant="link">Link</Button>
 * <Button variant="secret">Secret</Button>
 * <Button variant="disabled">Disabled</Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Sizes and colors
 * <ADDSButton size="sm" color="primary">Small Primary</ADDSButton>
 * <ADDSButton size="lg" color="secondary">Large Secondary</ADDSButton>
 * <ADDSButton fullWidth>Full Width Button</ADDSButton>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, DSButtonProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      className,
      children,
      leftSection,
      rightSection,
      ...props
    },
    ref
  ) => {
    // Pass our DS variant name directly — mantine.css adapter targets
    // data-variant="primary" etc. via higher-specificity selectors.
    // "disabled" is a state, not a Mantine variant, so map it to "default".
    const mantineVariant = variant === 'disabled' ? 'default' : (variant ?? 'default');

    // Determine if button should be disabled
    const isDisabled = props.disabled || variant === 'disabled';

    // Generate component class names
    const componentClassName = [
      styles.addsButton,
      styles[`addsButton--${variant}`],
      styles[`addsButton--${size}`],
      leftSection && styles.hasLeftSection,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <MantineButton
        ref={ref}
        variant={mantineVariant}
        size={size}
        disabled={isDisabled}
        radius="sm"
        className={componentClassName}
        leftSection={leftSection}
        rightSection={rightSection}
        {...props}
      >
        {children}
      </MantineButton>
    );
  }
);

Button.displayName = 'Button'; 