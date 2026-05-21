'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Popover as MantinePopover, PopoverProps as MantinePopoverProps, Stack,Text } from '@mantine/core';
import { Inline } from '@/components/DesignSystem';
import { Button } from '../Buttons';
import { TextInput } from '../Inputs';

/**
 * Popover Action Button interface (same as Modal for consistency)
 */
export interface PopoverAction {
  /** Unique identifier for the action */
  id: string;
  /** Button label */
  label: string;
  /** Button variant */
  variant?: 'primary' | 'outline' | 'default' | 'danger';
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is loading */
  loading?: boolean;
  /** Whether button should close popover on click */
  closeOnClick?: boolean;
}

/**
 * Enhanced Popover props extending Mantine's PopoverProps
 */
export interface DSPopoverProps extends Omit<MantinePopoverProps, 'children'> {
  /** Popover trigger element */
  trigger: React.ReactNode;
  /** Popover title (optional) */
  title?: string;
  /** Popover content */
  children: React.ReactNode;
  /** Primary/secondary action buttons (left-aligned) */
  actions?: PopoverAction[];
  /** Tertiary action buttons (right-aligned) */
  tertiaryActions?: PopoverAction[];
  /** Popover position relative to target */
  position?: 'top' | 'left' | 'right' | 'bottom';
  /** Whether popover is opened */
  opened?: boolean;
  /** Called when popover state changes */
  onChange?: (opened: boolean) => void;
  /** Called when popover is closed */
  onClose?: () => void;
  /** Popover width */
  width?: number | 'auto';
  /** Whether to show arrow */
  withArrow?: boolean;
  /** Arrow size */
  arrowSize?: number;
  /** Arrow radius */
  arrowRadius?: number;
  /** Whether popover can be closed by clicking outside */
  closeOnClickOutside?: boolean;
  /** Whether popover can be closed by pressing Escape */
  closeOnEscape?: boolean;
}

/**
 * AppDirect Design System Popover Component
 * 
 * A popover component built on top of Mantine's Popover with
 * consistent design system styling and flexible content support.
 * Arrow size is set to 10 and arrow radius to 0 by default.
 * 
 * @example
 * ```tsx
 * // Simple text popover
 * <Popover
 *   trigger={<Button>Show Info</Button>}
 *   title="Information"
 *   position="top"
 * >
 *   <Text>This is some helpful information.</Text>
 * </Popover>
 * ```
 * 
 * @example
 * ```tsx
 * // Popover with actions
 * <Popover
 *   trigger={<Button>Actions</Button>}
 *   title="Quick Actions"
 *   position="bottom"
 *   actions={[
 *     {
 *       id: "save",
 *       label: "Save",
 *       variant: "primary",
 *       onClick: handleSave,
 *       closeOnClick: true
 *     },
 *     {
 *       id: "cancel",
 *       label: "Cancel",
 *       variant: "outline",
 *       closeOnClick: true
 *     }
 *   ]}
 *   tertiaryActions={[
 *     {
 *       id: "help",
 *       label: "Help",
 *       variant: "default",
 *       onClick: showHelp
 *     }
 *   ]}
 * >
 *   <Text>Are you sure you want to continue?</Text>
 * </Popover>
 * ```
 * 
 * @example
 * ```tsx
 * // Form popover
 * <Popover
 *   trigger={<ActionIcon><RiSettingsLine /></ActionIcon>}
 *   title="Quick Settings"
 *   position="left"
 *   width={300}
 *   actions={[
 *     {
 *       id: "apply",
 *       label: "Apply",
 *       variant: "primary",
 *       onClick: applySettings
 *     }
 *   ]}
 * >
 *   <Stack gap="sm">
 *     <Switch label="Enable notifications" />
 *     <Select label="Theme" data={themes} />
 *   </Stack>
 * </Popover>
 * ```
 */
export const Popover = forwardRef<HTMLDivElement, DSPopoverProps>(
  (
    {
      trigger,
      title,
      children,
      actions = [],
      tertiaryActions = [],
      position = 'bottom',
      opened,
      onChange,
      onClose,
      width = 'auto',
      withArrow = true,
      arrowSize = 10,
      arrowRadius = 0,
      closeOnClickOutside = true,
      closeOnEscape = true,
      ...props
    },
    ref
  ) => {
    const handleActionClick = (action: PopoverAction) => {
      if (action.onClick) {
        action.onClick();
      }
      if (action.closeOnClick && onClose) {
        onClose();
      }
    };

    const hasActions = actions.length > 0 || tertiaryActions.length > 0;

    return (
      <MantinePopover
        opened={opened}
        onChange={onChange}
        position={position}
        width={width}
        withArrow={withArrow}
        arrowSize={arrowSize}
        arrowRadius={arrowRadius}
        closeOnClickOutside={closeOnClickOutside}
        closeOnEscape={closeOnEscape}
        shadow="md"
        {...props}
      >
        <MantinePopover.Target>
          {trigger}
        </MantinePopover.Target>

        <MantinePopover.Dropdown>
          <Stack gap="sm">
            {/* Popover Content */}
            <div>
              {title && (
                <Text fw={600} size="sm" mb="xs">
                  {title}
                </Text>
              )}
              {children}
            </div>
            
            {/* Popover Actions Footer */}
            {hasActions && (
              <Inline justify="space-between" gap="sm">
                {/* Left-aligned primary/secondary actions */}
                <Inline gap="sm">
                  {actions.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.variant || 'outline'}
                      onClick={() => handleActionClick(action)}
                      disabled={action.disabled}
                      loading={action.loading}
                      size="xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </Inline>
                
                {/* Right-aligned tertiary actions */}
                <Inline gap="sm">
                  {tertiaryActions.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.variant || 'outline'}
                      onClick={() => handleActionClick(action)}
                      disabled={action.disabled}
                      loading={action.loading}
                      size="xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </Inline>
              </Inline>
            )}
          </Stack>
        </MantinePopover.Dropdown>
      </MantinePopover>
    );
  }
);

Popover.displayName = 'Popover';

/**
 * Pre-configured Popover variants for common use cases
 */

/**
 * Confirmation Popover - Pre-configured for quick confirmations
 */
export interface ConfirmationPopoverProps extends Omit<DSPopoverProps, 'actions' | 'tertiaryActions'> {
  /** Confirmation button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirmation button variant */
  confirmVariant?: 'primary' | 'danger';
  /** Confirm action handler */
  onConfirm?: () => void;
  /** Cancel action handler */
  onCancel?: () => void;
  /** Whether confirm button is loading */
  confirmLoading?: boolean;
  /** Optional tertiary actions (right-aligned) */
  tertiaryActions?: PopoverAction[];
  /**
   * When set, a required text input is rendered between the popover body and the action buttons.
   * The confirm CTA stays disabled until the user types this exact keyword (case-sensitive, trimmed).
   * Also defaults `confirmVariant` to `'danger'` when the caller did not pass an explicit variant,
   * so the typed-confirmation pattern visually matches destructive action expectations.
   */
  confirmationKeyword?: string;
}

const TYPED_INPUT_TEST_ID = 'confirmation-popover-typed-input';

export const ConfirmationPopover = forwardRef<HTMLDivElement, ConfirmationPopoverProps>(
  (
    {
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      confirmVariant,
      onConfirm,
      onCancel,
      confirmLoading = false,
      tertiaryActions = [],
      confirmationKeyword,
      opened,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const requiresTypedConfirmation = typeof confirmationKeyword === 'string' && confirmationKeyword.length > 0;
    const resolvedConfirmVariant: 'primary' | 'danger' =
      confirmVariant ?? (requiresTypedConfirmation ? 'danger' : 'primary');

    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!requiresTypedConfirmation) return;
      if (opened === false) {
        setInputValue('');
      }
      if (opened === true) {
        // Focus the typed-confirmation input on open (not the confirm CTA).
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }, [opened, requiresTypedConfirmation]);

    const isConfirmDisabled =
      requiresTypedConfirmation && inputValue.trim() !== (confirmationKeyword ?? '').trim();

    const actions: PopoverAction[] = [
      {
        id: 'confirm',
        label: confirmLabel,
        variant: resolvedConfirmVariant,
        onClick: onConfirm,
        loading: confirmLoading,
        disabled: isConfirmDisabled,
        closeOnClick: !confirmLoading && !isConfirmDisabled,
      },
      {
        id: 'cancel',
        label: cancelLabel,
        variant: 'outline',
        onClick: onCancel,
        closeOnClick: true,
      },
    ];

    const popoverChildren = requiresTypedConfirmation ? (
      <Stack gap="sm">
        {children}
        <TextInput
          ref={inputRef}
          label={`Type ${confirmationKeyword} to proceed.`}
          required
          aria-required="true"
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          data-testid={TYPED_INPUT_TEST_ID}
        />
      </Stack>
    ) : (
      children
    );

    return (
      <Popover
        ref={ref}
        actions={actions}
        tertiaryActions={tertiaryActions}
        opened={opened}
        onClose={onClose}
        {...props}
      >
        {popoverChildren}
      </Popover>
    );
  }
);

ConfirmationPopover.displayName = 'ConfirmationPopover'; 