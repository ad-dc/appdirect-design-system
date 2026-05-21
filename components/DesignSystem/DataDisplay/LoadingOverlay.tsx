'use client';

import React, { forwardRef } from 'react';
import {
  LoadingOverlay as MantineLoadingOverlay,
  LoadingOverlayProps as MantineLoadingOverlayProps,
} from '@mantine/core';

export type DSLoadingOverlayProps = MantineLoadingOverlayProps;

const DEFAULT_LOADER_PROPS = { color: 'blue' } as const;
const DEFAULT_OVERLAY_PROPS = { blur: 2 } as const;
const DEFAULT_TRANSITION_PROPS = { duration: 150 } as const;

/**
 * AppDirect Design System LoadingOverlay Component
 *
 * Wraps Mantine `LoadingOverlay` with brand-aligned defaults: a blue loader, a 2px overlay blur,
 * and a 150 ms transition. Callers can still pass `loaderProps`, `overlayProps`, or `transitionProps`
 * to override individual values when the call site needs a different treatment.
 *
 * @example
 * ```tsx
 * <Box pos="relative">
 *   <LoadingOverlay visible={isFetching} />
 *   <CompanyDetailsCard customer={customer} />
 * </Box>
 * ```
 */
export const LoadingOverlay = forwardRef<HTMLDivElement, DSLoadingOverlayProps>(
  ({ loaderProps, overlayProps, transitionProps, ...props }, ref) => {
    return (
      <MantineLoadingOverlay
        ref={ref}
        loaderProps={{ ...DEFAULT_LOADER_PROPS, ...loaderProps }}
        overlayProps={{ ...DEFAULT_OVERLAY_PROPS, ...overlayProps }}
        transitionProps={{ ...DEFAULT_TRANSITION_PROPS, ...transitionProps }}
        {...props}
      />
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';
