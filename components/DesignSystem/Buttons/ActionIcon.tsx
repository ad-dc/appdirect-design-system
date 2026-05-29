'use client';

import type React from 'react';
import { forwardRef } from 'react';
import { ActionIcon as MantineActionIcon, ActionIconProps as MantineActionIconProps } from '@mantine/core';

type ActionIconVariant = 'default' | 'outline' | 'link';

export interface DSActionIconProps extends Omit<MantineActionIconProps, 'variant' | 'radius'> {
  /** Semantic variant: "default" (light blue bg), "outline" (Button default surface), or "link" (transparent) */
  variant?: ActionIconVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const variantMap: Record<ActionIconVariant, { variant: MantineActionIconProps['variant']; color: string }> = {
  default: { variant: 'light', color: 'blue' },
  outline: { variant: 'default', color: 'gray' },
  link: { variant: 'subtle', color: 'blue' },
};

export const ActionIcon = forwardRef<HTMLButtonElement, DSActionIconProps>(
  ({ variant = 'default', ...props }, ref) => {
    const mapped = variantMap[variant];

    return (
      <MantineActionIcon
        ref={ref}
        variant={mapped.variant}
        color={mapped.color}
        radius="sm"
        {...props}
      />
    );
  }
);

ActionIcon.displayName = 'ActionIcon';
