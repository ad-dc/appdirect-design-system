'use client';

import React, { forwardRef } from 'react';
import { Checkbox as MantineCheckbox, CheckboxProps as MantineCheckboxProps } from '@mantine/core';
import { ComponentSize } from '../config';

/**
 * Enhanced Checkbox props extending Mantine's CheckboxProps
 */
export interface DSCheckboxProps extends Omit<MantineCheckboxProps, 'size' | 'radius'> {
  /** Checkbox size from design system scale */
  size?: ComponentSize;
}

/**
 * AppDirect Design System Checkbox Component
 * 
 * A clean checkbox component built on top of Mantine's Checkbox with
 * consistent design system styling and enforced radius.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox label="Accept terms" />
 * 
 * // Controlled
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   checked={subscribed}
 *   onChange={(event) => setSubscribed(event.currentTarget.checked)}
 * />
 * 
 * // Required
 * <Checkbox
 *   label="I agree to the terms"
 *   required
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Different sizes
 * <Checkbox size="xs" label="Extra small" />
 * <Checkbox size="sm" label="Small" />
 * <Checkbox size="md" label="Medium" />
 * <Checkbox size="lg" label="Large" />
 * <Checkbox size="xl" label="Extra large" />
 * ```
 * 
 * @example
 * ```tsx
 * // States
 * <Checkbox label="Default checkbox" />
 * <Checkbox label="Checked" defaultChecked />
 * <Checkbox label="Disabled" disabled />
 * <Checkbox label="Disabled checked" disabled defaultChecked />
 * <Checkbox label="Indeterminate" indeterminate />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, DSCheckboxProps>(
  (
    {
      size = 'md',
      label,
      ...props
    },
    ref
  ) => {
    // Construct label with required asterisk if needed
    const enhancedLabel = React.useMemo(() => {
      if (!label) return label;
      if (props.required) {
        return (
          <>
            {label} <span style={{ color: 'var(--ad-color-status-error)' }}>*</span>
          </>
        );
      }
      return label;
    }, [label, props.required]);

    return (
      <MantineCheckbox
        ref={ref}
        size={size}
        radius="sm"
        label={enhancedLabel}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox'; 