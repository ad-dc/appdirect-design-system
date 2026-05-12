'use client';

import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Text, rem } from '@mantine/core';
import { Inline } from '@/components/DesignSystem';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { forwardRef } from 'react';

export interface DropZoneProps extends Omit<DropzoneProps, 'children' | 'onDrop'> {
  /** Title text displayed in the dropzone */
  title?: string;
  /** Description text displayed below the title */
  description?: string;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Accepted file types (default: images) */
  accept?: string[] | Record<string, string[]>;
  /** Callback when files are dropped/selected */
  onDrop?: (files: File[]) => void;
}

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  ({ 
    title = "This is the title", 
    description = "This is the description for the Dropzone component",
    maxSize = 5 * 1024 ** 2, // 5MB
    accept = IMAGE_MIME_TYPE,
    onDrop,
    onReject,
    ...props 
  }, ref) => {
    return (
      <Dropzone
        ref={ref}
        onDrop={onDrop || ((files) => console.log('accepted files', files))}
        onReject={onReject || ((files) => console.log('rejected files', files))}
        maxSize={maxSize}
        accept={accept}
        {...props}
      >
        <Inline justify="flex-start" gap="md" mih={80} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload 
              size={32} 
              color="var(--ad-color-brand-primary)" 
              stroke={1.5} 
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX 
              size={32} 
              color="var(--ad-color-status-error)" 
              stroke={1.5} 
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconUpload 
              size={32} 
              color="var(--ad-color-text-dimmed)" 
              stroke={1.5} 
            />
          </Dropzone.Idle>

          <div>
            <Text size="md" fw={500} mb={4}>
              {title}
            </Text>
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          </div>
        </Inline>
      </Dropzone>
    );
  }
);

DropZone.displayName = 'DropZone'; 