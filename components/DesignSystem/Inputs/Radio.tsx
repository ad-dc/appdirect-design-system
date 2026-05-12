'use client';

import React, { forwardRef } from 'react';
import { Radio as MantineRadio, RadioProps as MantineRadioProps } from '@mantine/core';
import { ComponentSize } from '../config';

/**
 * Enhanced Radio props extending Mantine's RadioProps
 */
export interface DSRadioProps extends Omit<MantineRadioProps, 'size'> {
  /** Radio size from design system scale */
  size?: ComponentSize;
}

/**
 * AppDirect Design System Radio Component
 * 
 * A clean radio button component built on top of Mantine's Radio with
 * consistent design system styling and enforced radius.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Radio label="Option 1" value="option1" />
 * 
 * // In a Radio.Group
 * <Radio.Group label="Choose an option" value={value} onChange={setValue}>
 *   <Radio value="option1" label="First option" />
 *   <Radio value="option2" label="Second option" />
 *   <Radio value="option3" label="Third option" />
 * </Radio.Group>
 * ```
 * 
 * @example
 * ```tsx
 * // Different sizes
 * <Radio size="xs" label="Extra small" value="xs" />
 * <Radio size="sm" label="Small" value="sm" />
 * <Radio size="md" label="Medium" value="md" />
 * <Radio size="lg" label="Large" value="lg" />
 * <Radio size="xl" label="Extra large" value="xl" />
 * ```
 * 
 * @example
 * ```tsx
 * // States
 * <Radio label="Default radio" value="default" />
 * <Radio label="Checked radio" value="checked" defaultChecked />
 * <Radio label="Disabled radio" value="disabled" disabled />
 * <Radio label="Required radio" value="required" required />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, DSRadioProps>(
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
      <MantineRadio
        ref={ref}
        size={size}
        label={enhancedLabel}
        {...props}
      />
    );
  }
);

Radio.displayName = 'Radio'; 