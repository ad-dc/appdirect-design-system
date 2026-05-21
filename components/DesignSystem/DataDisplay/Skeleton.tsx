'use client';

import React, { forwardRef } from 'react';
import { Skeleton as MantineSkeleton, SkeletonProps as MantineSkeletonProps } from '@mantine/core';

export type DSSkeletonProps = MantineSkeletonProps;

/**
 * AppDirect Design System Skeleton Component
 *
 * Wraps Mantine `Skeleton` with a small radius (`sm`) and animation on by default,
 * matching the loading-state pattern used across the design system (cards, tables, KPI rows).
 *
 * @example
 * ```tsx
 * <Skeleton height={24} width="50%" />
 * <Skeleton height={120} radius="md" />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, DSSkeletonProps>(
  ({ animate = true, radius = 'sm', ...props }, ref) => {
    return <MantineSkeleton ref={ref} animate={animate} radius={radius} {...props} />;
  }
);

Skeleton.displayName = 'Skeleton';
