'use client';

import React from 'react';
import { Card } from '../../DataDisplay/Card';
import { Stack, Inline, Box } from '../../Layout';
import { Title } from '../../Typography/Title';
import { Text } from '../../Typography/Text';
import { Switch } from '../../Inputs/Switch';
import { Select } from '../../Combobox/Select';
import { Menu } from '../../Overlays/Menu';
import { ActionIcon } from '../../Buttons/ActionIcon';
import { RiMore2Fill, RiArrowRightSLine } from '@remixicon/react';

// ========================== TYPES ==========================

export interface DashboardWidgetLink {
  /** Link text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Whether link is disabled */
  disabled?: boolean;
}

export interface DashboardWidgetProps {
  /** Widget title */
  title: string;
  
  // ==================== HEADER CONTROLS ====================
  /** Optional switch with label and handler */
  switch?: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  };
  
  /** Optional actions menu */
  actionsMenu?: {
    sections: Array<{
      items: Array<{
        id: string;
        label: string;
        onClick: () => void;
        disabled?: boolean;
      }>;
    }>;
  };
  
  // ==================== CONTENT AREA ====================
  /** Main content area - can be any React node */
  children: React.ReactNode;
  
  // ==================== OPTIONAL CONTROLS ====================
  /** Optional select dropdown in the header (top-right) */
  headerSelect?: {
    placeholder?: string;
    data: string[] | { value: string; label: string }[];
    disabled?: boolean;
    /** Current selected value (for controlled component) */
    value?: string | null;
    /** Change handler (for controlled component) */
    onChange?: (value: string | null) => void;
    /** Whether the select is searchable */
    searchable?: boolean;
    /** Whether the select is clearable */
    clearable?: boolean;
  };
  
  /** Optional footer links */
  footerLinks?: DashboardWidgetLink[];
  
  // ==================== STYLING ====================
  /** Additional card props */
  cardProps?: Record<string, any>;
  /** Custom spacing */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// ========================== COMPONENT ==========================

/**
 * DashboardWidget Component
 * 
 * A flexible widget container for dashboard content with optional controls.
 * Built on top of the Card component with consistent spacing and styling.
 * 
 * @example
 * // Basic widget with content
 * <DashboardWidget title="A widget title">
 *   <Text>This is a slot. To use it:</Text>
 *   <ul>
 *     <li>Create a local component with autolayout on</li>
 *     <li>Switch out this slot with that component using the component instance switcher</li>
 *   </ul>
 * </DashboardWidget>
 * 
 * @example
 * // Widget with all features
 * <DashboardWidget
 *   title="Analytics Widget"
 *   switch={{
 *     label: "Live updates",
 *     checked: true,
 *     onChange: (checked) => console.log(checked)
 *   }}
 *   actionsMenu={{
 *     sections: [{
 *       items: [
 *         { label: "Export", onClick: () => console.log("Export") },
 *         { label: "Settings", onClick: () => console.log("Settings") }
 *       ]
 *     }]
 *   }}
 *   headerSelect={{
 *     placeholder: "Select filter",
 *     data: ["Option 1", "Option 2", "Option 3"],
 *     onChange: (value) => console.log(value)
 *   }}
 *   footerLinks={[
 *     { label: "Link 1", onClick: () => console.log("Link 1") },
 *     { label: "Link 2", onClick: () => console.log("Link 2") },
 *     { label: "Link 3", onClick: () => console.log("Link 3") }
 *   ]}
 * >
 *   <YourCustomContent />
 * </DashboardWidget>
 */
export function DashboardWidget({
  title,
  switch: switchConfig,
  actionsMenu,
  children,
  headerSelect,
  footerLinks,
  cardProps = {},
  spacing = 'xs',
}: DashboardWidgetProps) {
  
  // ==================== RENDER FUNCTIONS ==========================
  
  const renderHeader = () => (
    <Inline justify="space-between" align="flex-start">
      {/* Title */}
      <Stack gap="xs">
        <Title order={4}>
          {title}
        </Title>
      </Stack>
      {/* Header controls */}
      <Inline gap="sm" align="center">
        {/* Switch */}
        {switchConfig && (
          <Inline gap="xs" align="center">
            <Text size="sm">{switchConfig.label}</Text>
            <Switch
              checked={switchConfig.checked}
              onChange={(event) => switchConfig.onChange(event.currentTarget.checked)}
              disabled={switchConfig.disabled}
              size="sm"
            />
          </Inline>
        )}
        
        {/* Header select (borderless select in top-right) */}
        {headerSelect && (
          <Select
            data={headerSelect.data}
            value={headerSelect.value}
            onChange={headerSelect.onChange}
            placeholder={headerSelect.placeholder}
            disabled={headerSelect.disabled}
            searchable={headerSelect.searchable}
            clearable={headerSelect.clearable}
            borderless
            size="sm"
          />
        )}
        
        {/* Actions menu - only show if no header select */}
        {actionsMenu && !headerSelect && (
          <Menu
            trigger={
              <ActionIcon size="sm" aria-label="Widget actions">
                <RiMore2Fill size={16} />
              </ActionIcon>
            }
            position="bottom-end"
            sections={actionsMenu.sections}
          />
        )}
      </Inline>
    </Inline>
  );
  
  const renderFooterLinks = () => {
    return (
      <Box p="sm" pl="lg" pr="lg">
        {footerLinks && footerLinks.length > 0 ? (
          <Inline gap="xs" >
            {footerLinks.map((link, index) => (
              <Inline
                key={index}
                gap="xs"
                align="center"
                onClick={link.disabled ? undefined : link.onClick}
                style={{
                  cursor: link.disabled ? 'not-allowed' : 'pointer',
                  opacity: link.disabled ? 0.5 : 1,
                  color: link.disabled ? 'var(--ad-color-text-dimmed)' : 'var(--ad-color-brand-primary)',
                  
                  
                  transition: 'color 0.2s ease',
                }}
              >
                <Text size="sm" c={link.disabled ? 'dimmed' : 'blue'}>
                  {link.label}
                </Text>
                <RiArrowRightSLine size={14} />
              </Inline>
            ))}
          </Inline>
        ) : (
          // Empty footer that maintains the same height
          <Box style={{ height: '21px' }} />
        )}
      </Box>
    );
  };
  
  // ==================== MAIN RENDER ==========================
  
  return (
    <Card 
      {...cardProps} 
      pl="lg" 
      pr="lg" 
      pt="sm" 
      pb={0} // Remove bottom padding as footer will handle it
      style={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        ...cardProps.style,
      }}
    >
      {/* Header and scrollable content area */}
      <Stack 
        gap={spacing} 
        style={{ 
          height: '100%',
          paddingBottom: '60px', // Space for fixed footer
        }}
      >
        {renderHeader()}
        
        {/* Main content area - scrollable */}
        <Box style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '4px', // Space for scrollbar
        }}>
          {children}
        </Box>
      </Stack>
      
      {/* Footer area - fixed at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--ad-color-bg-default)',
      }}>
        {renderFooterLinks()}
      </div>
    </Card>
  );
} 