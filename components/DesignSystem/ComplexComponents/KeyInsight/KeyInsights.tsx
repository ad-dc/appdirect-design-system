'use client';

import React from 'react';
import { Box } from '../../Layout/Box';
import { Text } from '../../Typography/Text';
import { Title } from '../../Typography/Title';

export type KeyInsightSize = 'xs' | 'sm' | 'md' | 'lg' | 'jumbo' | 'super-jumbo';

export interface KeyInsightProps {
  /** Value to display (can be number or string) */
  value: string | number;
  /** Title/label for the insight */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Whether to show border on the right */
  showBorder?: boolean;
  /** Size of the KeyInsight component */
  size?: KeyInsightSize;
}

// Size mappings for different elements
const sizeConfig = {
  xs: {
    valueOrder: 4 as const, // h4
    titleSize: 'xs' as const,
    subtitleSize: 'xs' as const,
    padding: 'xs' as const,
    customValueStyle: undefined,
    customTitleStyle: undefined,
    customSubtitleStyle: undefined,
  },
  sm: {
    valueOrder: 3 as const, // h3
    titleSize: 'sm' as const,
    subtitleSize: 'sm' as const,
    padding: 'xs' as const,
    customValueStyle: undefined,
    customTitleStyle: undefined,
    customSubtitleStyle: undefined,
  },
  md: {
    valueOrder: 2 as const, // h2
    titleSize: 'md' as const,
    subtitleSize: 'md' as const,
    padding: 'sm' as const,
    customValueStyle: undefined,
    customTitleStyle: undefined,
    customSubtitleStyle: undefined,
  },
  lg: {
    valueOrder: 1 as const, // h1
    titleSize: 'lg' as const,
    subtitleSize: 'lg' as const,
    padding: 'sm' as const,
    customValueStyle: undefined,
    customTitleStyle: undefined,
    customSubtitleStyle: undefined,
  },
  jumbo: {
    valueOrder: 1 as const, // h1 as base, but will be overridden
    titleSize: 'xl' as const,
    subtitleSize: 'xl' as const,
    padding: 'md' as const,
    customValueStyle: {
      fontSize: '96px',
      lineHeight: '130%',
    },
    customTitleStyle: undefined,
    customSubtitleStyle: undefined,
  },
  'super-jumbo': {
    valueOrder: 1 as const, // h1 as base, but will be overridden
    titleSize: 'xl' as const, // Will be overridden
    subtitleSize: 'xl' as const, // Will be overridden  
    padding: 'lg' as const,
    customValueStyle: {
      fontSize: '128px',
      lineHeight: '130%',
    },
    customTitleStyle: {
      fontSize: '32px',
      lineHeight: '116%',
    },
    customSubtitleStyle: {
      fontSize: '32px',
      lineHeight: '116%',
    },
  },
} as const;

/**
 * KeyInsight Component
 * 
 * A reusable component for displaying key metrics or insights with a title, value, and optional subtitle.
 * Commonly used in dashboards, analytics pages, or summary sections.
 * 
 * @example
 * // Basic usage
 * <KeyInsight
 *   value={1250}
 *   title="Total Users"
 * />
 * 
 * @example
 * // With subtitle and custom size
 * <KeyInsight
 *   value="95%"
 *   title="Success Rate"
 *   subtitle="Last 30 days"
 *   size="lg"
 * />
 * 
 * @example
 * // Different sizes showcase
 * <Stack gap="md">
 *   <KeyInsight value={1250} title="Extra Small" size="xs" />
 *   <KeyInsight value={1250} title="Small" size="sm" />
 *   <KeyInsight value={1250} title="Medium" size="md" />
 *   <KeyInsight value={1250} title="Large" size="lg" />
 *   <KeyInsight value={1250} title="Jumbo" size="jumbo" />
 *   <KeyInsight value={1250} title="Super Jumbo" size="super-jumbo" />
 * </Stack>
 * 
 * @example
 * // Hero metrics with jumbo size
 * <KeyInsight
 *   value="$2.4M"
 *   title="Annual Revenue"
 *   subtitle="2024 Performance"
 *   size="jumbo"
 * />
 * 
 * @example
 * // In a simple grid layout with borders
 * <SimpleGrid cols={3} spacing="sm">
 *   <KeyInsight
 *     value={1250}
 *     title="Total Users"
 *     size="lg"
 *     showBorder={true}
 *   />
 *   <KeyInsight
 *     value={987}
 *     title="Active Users"
 *     size="lg"
 *     showBorder={true}
 *   />
 *   <KeyInsight
 *     value={263}
 *     title="New Users"
 *     subtitle="This month"
 *     size="lg"
 *     showBorder={false}
 *   />
 * </SimpleGrid>
 * 
 * @example
 * // Dynamic usage with data
 * const insights = [
 *   { value: userData.length, title: "Total Users" },
 *   { value: activeUsers.length, title: "Active Users" },
 *   { value: newUsers.length, title: "New Users" },
 * ];
 * 
 * <Inline>
 *   {insights.map((insight, index) => (
 *     <KeyInsight
 *       key={index}
 *       value={insight.value}
 *       title={insight.title}
 *       size="md"
 *       showBorder={index < insights.length - 1}
 *     />
 *   ))}
 * </Inline>
 */
export function KeyInsight({
  value,
  title,
  subtitle,
  showBorder = false,
  size = 'md',
}: KeyInsightProps) {
  const config = sizeConfig[size];
  
  return (
    <Box 
      ta="center" 
      p={config.padding}
      style={{ 
        borderRight: showBorder ? '1px solid var(--ad-color-border-subtle)' : undefined 
      }}
    >
      <Title 
        order={config.valueOrder} 
        c="dark"
        style={config.customValueStyle}
      >
        {value}
      </Title>
      <Text 
        size={config.titleSize} 
        mt={0}
        style={config.customTitleStyle}
      >
        {title}
      </Text>
      {subtitle && (
        <Text 
          size={config.subtitleSize} 
          c="dimmed"
          style={config.customSubtitleStyle}
        >
          {subtitle}
        </Text>
      )}
    </Box>
  );
} 
