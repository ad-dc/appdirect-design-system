'use client';

import React, { forwardRef } from 'react';
import { Stack as MantineStack, StackProps as MantineStackProps } from '@mantine/core';
import { ComponentSize } from '../config';

/**
 * Design System spacing scale mapped to rem values
 */
export type SpacingScale = 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Enhanced Stack props extending Mantine's StackProps
 */
export interface DSStackProps extends Omit<MantineStackProps, 'gap'> {
  /** Spacing between stack items using design system scale */
  gap?: SpacingScale | string | number;
  /** Alignment of items along the cross axis */
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  /** Distribution of items along the main axis */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * AppDirect Design System Stack Component
 * 
 * A layout primitive that stacks child elements vertically with consistent spacing
 * using design system tokens. Built on top of Mantine's Stack component.
 * 
 * @example
 * ```tsx
 * // Basic vertical stack
 * <Stack gap="md">
 *   <Text>First item</Text>
 *   <Text>Second item</Text>
 *   <Text>Third item</Text>
 * </Stack>
 * ```
 * 
 * @example
 * ```tsx
 * // Stack with alignment
 * <Stack gap="lg" align="center">
 *   <Button>Centered button</Button>
 *   <Text>Centered text</Text>
 * </Stack>
 * ```
 * 
 * @example
 * ```tsx
 * // Nested stacks with different spacing
 * <Stack gap="xl">
 *   <Title>Main Section</Title>
 *   <Stack gap="sm">
 *     <Text>Related item 1</Text>
 *     <Text>Related item 2</Text>
 *   </Stack>
 * </Stack>
 * ```
 */
export const Stack = forwardRef<HTMLDivElement, DSStackProps>(
  (
    {
      gap = 'md',
      align = 'stretch',
      justify = 'flex-start',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <MantineStack
        ref={ref}
        gap={gap}
        align={align}
        justify={justify}
        {...props}
      >
        {children}
      </MantineStack>
    );
  }
);

Stack.displayName = 'Stack'; 