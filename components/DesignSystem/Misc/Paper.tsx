'use client';

import { Paper as MantinePaper, PaperProps as MantinePaperProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface DSPaperProps extends Omit<MantinePaperProps, 'padding'> {
  /** Legacy variant alias retained for backwards compatibility */
  variant?: 'default' | 'shadow' | 'border' | 'border-shadow';
  /** Content of the paper */
  children: React.ReactNode;
}

export const Paper = forwardRef<HTMLDivElement, DSPaperProps>(
  ({ variant, children, p, shadow, withBorder, ...props }, ref) => {
    const getVariantProps = () => {
      switch (variant) {
        case 'shadow':
          return { shadow: 'xs' as const, withBorder: false };
        case 'border':
          return { withBorder: true, shadow: undefined };
        case 'border-shadow':
          return { withBorder: true, shadow: 'xs' as const };
        case 'default':
        default:
          return { withBorder: false, shadow: undefined };
      }
    };

    const variantProps = getVariantProps();
    const resolvedShadow = shadow ?? variantProps.shadow;
    const resolvedWithBorder = withBorder ?? variantProps.withBorder;

    return (
      <MantinePaper
        ref={ref}
        p={p}
        shadow={resolvedShadow}
        withBorder={resolvedWithBorder}
        {...props}
      >
        {children}
      </MantinePaper>
    );
  }
);

Paper.displayName = 'Paper'; 
