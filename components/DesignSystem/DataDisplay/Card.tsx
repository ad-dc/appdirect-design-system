'use client';

import React, { forwardRef } from 'react';
import { Card as MantineCard, CardProps as MantineCardProps, BoxProps } from '@mantine/core';
import classes from './Card.module.css';

// ========================== TYPES ==========================

export interface DSCardProps extends Omit<MantineCardProps, 'size' | 'variant' | 'padding' | 'shadow' | 'withBorder' | 'radius'> {
  /** Whether the card should be interactive (adds hover effects) */
  interactive?: boolean;
  /** Card content */
  children: React.ReactNode;
  /** Click handler (makes card clickable when provided) */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

// Card.Section props - extend Mantine's CardSection props fully with spacing support
export interface DSCardSectionProps extends 
  React.ComponentPropsWithoutRef<typeof MantineCard.Section>,
  Pick<BoxProps, 'py' | 'px' | 'pt' | 'pb' | 'pl' | 'pr' | 'mt' | 'mb' | 'ml' | 'mr' | 'm' | 'p'> {
  children: React.ReactNode;
  /** Adds top and bottom border to the section */
  withBorder?: boolean;
  /** Adds same left and right padding as the Card component */
  inheritPadding?: boolean;
}

// ========================== COMPONENTS ==========================

/**
 * Card.Section Component
 * 
 * Use to create full-bleed sections within a card that extend to the edges.
 * Perfect for images, headers, or other content that should span the full width.
 * 
 * @example
 * ```tsx
 * <Card>
 *   <Card.Section>
 *     <img src="image.jpg" alt="Full width image" />
 *   </Card.Section>
 *   <Title>Card Content</Title>
 *   <Text>Regular padded content</Text>
 * </Card>
 * ```
 */
const CardSection = forwardRef<HTMLDivElement, DSCardSectionProps>(
  ({ children, ...props }, ref) => {
    return (
      <MantineCard.Section ref={ref} {...props}>
        {children}
      </MantineCard.Section>
    );
  }
);

CardSection.displayName = 'Card.Section';

/**
 * Card Component
 * 
 * Built on top of Mantine's Card component with design system styling.
 * Provides a consistent container for content with fixed styling options:
 * - Shadow: xs (subtle shadow)
 * - Padding: md (16px)
 * - Border: always enabled
 * - Radius: sm (4px)
 * 
 * @example
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here.</p>
 * </Card>
 * 
 * @example
 * // Interactive card
 * <Card 
 *   interactive
 *   onClick={() => console.log('Card clicked')}
 * >
 *   <h3>Clickable Card</h3>
 *   <p>This card responds to clicks and hover.</p>
 * </Card>
 * 
 * @example
 * // Card with full bleed image
 * <Card>
 *   <Card.Section>
 *     <img src="image.jpg" alt="Full width" />
 *   </Card.Section>
 *   <h3>Card Title</h3>
 *   <p>Content with padding</p>
 * </Card>
 * 
 * @example
 * // Card with custom styling
 * <Card 
 *   style={{ backgroundColor: 'var(--ad-color-brand-light)' }}
 * >
 *   <h3>Custom Styled Card</h3>
 *   <p>With custom background color.</p>
 * </Card>
 */
const CardRoot = forwardRef<HTMLDivElement, DSCardProps>(
  ({ 
    interactive = false,
    children,
    onClick,
    style,
    className,
    ...props 
  }, ref) => {

    // Runtime validation
    React.useEffect(() => {
      if (interactive && !onClick) {
        console.warn('Card: interactive is true but no onClick handler provided');
      }
    }, [interactive, onClick]);

    // Determine if card should be clickable
    const isClickable = Boolean(onClick);

    // Build class names - add interactive/clickable classes when needed
    const cardClassName = [
      className,
      interactive && classes.interactive,
      isClickable && classes.clickable,
    ].filter(Boolean).join(' ');

    return (
      <MantineCard
        ref={ref}
        padding="md"
        radius="sm"
        shadow="xs"
        withBorder={true}
        style={style}
        className={cardClassName}
        onClick={onClick}
        {...props}
      >
        {children}
      </MantineCard>
    );
  }
);

CardRoot.displayName = 'Card';

// ========================== COMPOUND COMPONENT ==========================

/**
 * Compound Card component with Section support
 */
export const Card = Object.assign(CardRoot, {
  Section: CardSection,
});

// Export the Section component separately for named imports
export { CardSection }; 