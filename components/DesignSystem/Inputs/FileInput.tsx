'use client';

import React, { forwardRef } from 'react';
import { FileInput as MantineFileInput, FileInputProps as MantineFileInputProps } from '@mantine/core';
import { ComponentSize } from '../config';

/**
 * Enhanced FileInput props extending Mantine's FileInputProps
 */
export interface DSFileInputProps extends Omit<MantineFileInputProps<any>, 'size' | 'radius'> {
  /** Input size from design system scale */
  size?: ComponentSize;
  /** Whether input is required (shows asterisk) */
  required?: boolean;
  /** Whether to show "(Optional)" text after label */
  showOptional?: boolean;
}

/**
 * AppDirect Design System FileInput Component
 * 
 * A clean file input component built on top of Mantine's FileInput with
 * consistent design system styling and enforced radius.
 * 
 * @example
 * ```tsx
 * // Basic usage (no indication)
 * <FileInput label="Upload File" placeholder="Choose file" />
 * 
 * // Required field (shows asterisk)
 * <FileInput
 *   label="Resume"
 *   placeholder="Upload your resume"
 *   required
 * />
 * 
 * // Optional field (shows "(Optional)")
 * <FileInput
 *   label="Profile Picture"
 *   placeholder="Upload image"
 *   showOptional
 * />
 * 
 * // With error
 * <FileInput
 *   label="Document"
 *   error="File is required"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Different sizes
 * <FileInput size="xs" placeholder="Extra small" />
 * <FileInput size="sm" placeholder="Small" />
 * <FileInput size="md" placeholder="Medium" />
 * <FileInput size="lg" placeholder="Large" />
 * <FileInput size="xl" placeholder="Extra large" />
 * 
 * // With file type restrictions
 * <FileInput
 *   accept="image/png,image/jpeg"
 *   placeholder="Upload image"
 * />
 * 
 * // Multiple files
 * <FileInput
 *   multiple
 *   placeholder="Upload multiple files"
 * />
 * 
 * // With clearable option
 * <FileInput
 *   clearable
 *   placeholder="Upload file (clearable)"
 * />
 * ```
 */
export const FileInput = forwardRef<HTMLButtonElement, DSFileInputProps>(
  (
    {
      size = 'md',
      className,
      leftSection,
      rightSection,
      showOptional = false,
      label,
      ...props
    },
    ref
  ) => {
    // Construct label with optional text if needed
    const enhancedLabel = React.useMemo(() => {
      if (!label) return label;
      if (showOptional && !props.required) {
        return (
          <>
            {label} <span style={{ fontWeight: 'normal', color: 'var(--ad-color-text-dimmed)' }}>(Optional)</span>
          </>
        );
      }
      return label;
    }, [label, showOptional, props.required]);

    return (
      <MantineFileInput
        ref={ref}
        size={size}
        radius="sm"
        className={className}
        leftSection={leftSection}
        rightSection={rightSection}
        label={enhancedLabel}
        {...props}
      />
    );
  }
);

FileInput.displayName = 'FileInput'; 