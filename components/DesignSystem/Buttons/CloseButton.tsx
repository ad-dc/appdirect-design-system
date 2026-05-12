'use client';

import { forwardRef } from 'react';
import { CloseButton as MantineCloseButton, CloseButtonProps } from '@mantine/core';

export interface DSCloseButtonProps extends Omit<CloseButtonProps, 'size'> {
  /** Size of the close button */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant of the close button */
  color?: 'black' | 'blue' | 'gray';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Style object for the component */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Size configurations
const sizeConfig = {
  xs: {
    size: 20,
    iconSize: 10,
  },
  sm: {
    size: 24,
    iconSize: 12,
  },
  md: {
    size: 28,
    iconSize: 14,
  },
  lg: {
    size: 32,
    iconSize: 16,
  },
  xl: {
    size: 36,
    iconSize: 18,
  },
};

export const CloseButton = forwardRef<HTMLButtonElement, DSCloseButtonProps>(
  ({ 
    size = 'md', 
    color = 'black',
    disabled = false,
    style,
    ...others 
  }, ref) => {
    const config = sizeConfig[size];
    
    // Define the color styling (let Mantine handle hover backgrounds)
    const iconColor = disabled 
      ? 'var(--ad-color-state-disabled-text)'
      : color === 'blue' 
        ? 'var(--ad-color-brand-primary)'
        : color === 'gray'
          ? 'var(--ad-color-text-dimmed)'
        : 'var(--ad-color-text-default)';

    return (
      <MantineCloseButton
        ref={ref}
        variant="subtle"
        size={config.size}
        disabled={disabled}
        style={{
          color: iconColor,
          borderRadius: 'var(--mantine-radius-sm)',
          minWidth: config.size,
          minHeight: config.size,
          width: config.size,
          height: config.size,
          ...style,
        }}
        {...others}
      />
    );
  }
);

CloseButton.displayName = 'CloseButton'; 
