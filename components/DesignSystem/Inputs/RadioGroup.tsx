'use client';

import React, { forwardRef } from 'react';
import { Radio as MantineRadio } from '@mantine/core';
import { ComponentSize } from '../config';

/**
 * Enhanced RadioGroup props extending Mantine's RadioGroupProps
 */
export interface DSRadioGroupProps extends Omit<React.ComponentPropsWithoutRef<typeof MantineRadio.Group>, 'size'> {
  /** RadioGroup size from design system scale */
  size?: ComponentSize;
}

/**
 * AppDirect Design System RadioGroup Component
 * 
 * A radio group component built on top of Mantine's Radio.Group with
 * consistent design system styling and required asterisk support.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <RadioGroup label="Choose an option" value={value} onChange={setValue}>
 *   <Radio value="option1" label="First option" />
 *   <Radio value="option2" label="Second option" />
 *   <Radio value="option3" label="Third option" />
 * </RadioGroup>
 * ```
 * 
 * @example
 * ```tsx
 * // Required group
 * <RadioGroup label="Payment method" required value={payment} onChange={setPayment}>
 *   <Radio value="card" label="Credit Card" />
 *   <Radio value="paypal" label="PayPal" />
 *   <Radio value="bank" label="Bank Transfer" />
 * </RadioGroup>
 * ```
 * 
 * @example
 * ```tsx
 * // With description and error
 * <RadioGroup
 *   label="Subscription plan"
 *   description="Choose your preferred plan"
 *   error="Please select a plan"
 *   value={plan}
 *   onChange={setPlan}
 * >
 *   <Radio value="basic" label="Basic - $9/month" />
 *   <Radio value="pro" label="Pro - $29/month" />
 *   <Radio value="enterprise" label="Enterprise - $99/month" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, DSRadioGroupProps>(
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
      <MantineRadio.Group
        ref={ref}
        size={size}
        label={enhancedLabel}
        {...props}
      />
    );
  }
);

RadioGroup.displayName = 'RadioGroup'; 
