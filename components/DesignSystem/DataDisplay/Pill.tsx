'use client';

import { forwardRef } from 'react';
import { Box, CloseButton } from '@mantine/core';
import { Inline } from '../Layout';

export interface DSPillProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Pill content */
  children: React.ReactNode;
  /** Size of the pill */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the pill can be removed */
  withRemoveButton?: boolean;
  /** Called when remove button is clicked */
  onRemove?: () => void;
}

// Size configurations
const sizeConfig = {
  xs: {
    height: 18,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0.1563,
    px: 8,
    gap: 0,
    closeSize: 18,
  },
  sm: {
    height: 24,
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: 0.17,
    px: 8,
    gap: 6,
    closeSize: 14,
  },
  md: {
    height: 25,
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0.2184,
    px: 11.2,
    gap: 8,
    closeSize: 25,
  },
  lg: {
    height: 32,
    fontSize: 13,
    lineHeight: 14,
    letterSpacing: 0.2,
    px: 12,
    gap: 8,
    closeSize: 18,
  },
  xl: {
    height: 36,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.22,
    px: 14,
    gap: 8,
    closeSize: 20,
  },
};

export const Pill = forwardRef<HTMLDivElement, DSPillProps>(
  ({ 
    children, 
    size = 'md', 
    withRemoveButton = false, 
    onRemove, 
    style,
    ...others 
  }, ref) => {
    const config = sizeConfig[size];
    
    const colors = {
      backgroundColor: 'var(--ad-color-bg-subtle)',
      color: 'var(--ad-color-text-dimmed)',
      border: 'none',
    };

    return (
      <Box
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: config.height,
          paddingLeft: config.px,
          paddingRight: withRemoveButton ? 0 : config.px,
          borderRadius: config.height / 2,
          fontSize: config.fontSize,
          fontWeight: 400,
          lineHeight: `${config.lineHeight}px`,
          letterSpacing: config.letterSpacing,
          userSelect: 'none',
          ...colors,
          ...style,
        }}
        {...others}
      >
        <Inline gap={config.gap} wrap="nowrap">
          <span>{children}</span>
          {withRemoveButton && (
            <CloseButton
              size={config.closeSize}
              onClick={onRemove}
              variant="transparent"
              style={{
                color: 'currentColor',
                minWidth: config.closeSize,
                minHeight: config.closeSize,
              }}
              aria-label="Remove"
            />
          )}
        </Inline>
      </Box>
    );
  }
);

Pill.displayName = 'Pill'; 