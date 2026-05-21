'use client';

import React, { forwardRef } from 'react';
import { Anchor as MantineAnchor, AnchorProps as MantineAnchorProps } from '@mantine/core';
import classes from './Anchor.module.css';

export interface DSAnchorProps extends MantineAnchorProps {
  /** Anchor target href */
  href?: string;
  /** Native anchor target (use "_blank" for external links — pair with rel="noopener noreferrer") */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** Native anchor rel attribute */
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/**
 * AppDirect Design System Anchor Component
 *
 * Wraps Mantine's `Anchor` with the brand-primary color (`blue.6` → `--ad-color-brand-primary`)
 * and an underline-on-hover treatment that matches the DS typography spec.
 *
 * @example
 * ```tsx
 * <Anchor href="/customers/123">Acme Corporation</Anchor>
 *
 * // External link
 * <Anchor href="https://example.com" target="_blank" rel="noopener noreferrer">
 *   View in source system
 * </Anchor>
 * ```
 */
export const Anchor = forwardRef<HTMLAnchorElement, DSAnchorProps>(
  ({ className, c, ...props }, ref) => {
    return (
      <MantineAnchor
        ref={ref}
        c={c ?? 'blue.6'}
        className={className ? `${classes.anchor} ${className}` : classes.anchor}
        {...props}
      />
    );
  }
);

Anchor.displayName = 'Anchor';
