import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack } from '@mantine/core';
import { Inline } from '../Layout/Inline';
import { DropZone } from './DropZone';
import { useState } from 'react';
import { Title } from '../Typography/Title';
import { Text } from '../Typography/Text';
import { IMAGE_MIME_TYPE, PDF_MIME_TYPE, MS_WORD_MIME_TYPE, MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';

const meta: Meta<typeof DropZone> = {
  title: 'Design System/Inputs/DropZone',
  component: DropZone,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'DropZone component for drag-and-drop file uploads with customizable file type restrictions and visual feedback.',
      },
    },
  },
  tags: ['autodocs', 'code-connected'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title text displayed in the dropzone',
    },
    description: {
      control: 'text',
      description: 'Description text displayed below the title',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    accept: {
      control: false,
      description: 'Accepted file types',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Upload files',
    description: 'Drag and drop files here or click to select',
  },
};

export const FileTypes: Story = {
  render: () => (
    <Stack gap="lg" w={500}>
      <div>
        <Text size="sm" fw={500} mb="sm">Images Only</Text>
        <DropZone
          title="Upload Images"
          description="Drag and drop image files here (PNG, JPEG, GIF, WebP)"
          accept={IMAGE_MIME_TYPE}
          maxSize={5 * 1024 ** 2}
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">PDF Documents</Text>
        <DropZone
          title="Upload PDF Files"
          description="Drag and drop PDF documents here"
          accept={PDF_MIME_TYPE}
          maxSize={10 * 1024 ** 2}
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Office Documents</Text>
        <DropZone
          title="Upload Documents"
          description="Drag and drop Word or Excel files here"
          accept={[...MS_WORD_MIME_TYPE, ...MS_EXCEL_MIME_TYPE]}
          maxSize={20 * 1024 ** 2}
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Any File Type</Text>
        <DropZone
          title="Upload Any Files"
          description="Drag and drop any type of file here"
          accept={undefined}
          maxSize={50 * 1024 ** 2}
        />
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'DropZone with different file type restrictions and size limits.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="lg" w={600}>
      <div>
        <Text size="sm" fw={500} mb="sm">Compact (80px height)</Text>
        <DropZone
          title="Compact Upload"
          description="Small dropzone for quick uploads"
          style={{ minHeight: 80 }}
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Standard (120px height)</Text>
        <DropZone
          title="Standard Upload"
          description="Standard size dropzone for general use"
          style={{ minHeight: 120 }}
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Large (200px height)</Text>
        <DropZone
          title="Large Upload Area"
          description="Large dropzone for bulk file uploads or better visibility"
          style={{ minHeight: 200 }}
        />
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'DropZone with different sizes for various use cases.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <Stack gap="lg" w={500}>
      <div>
        <Text size="sm" fw={500} mb="sm">Default State</Text>
        <DropZone
          title="Default Upload"
          description="Ready to accept files"
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Disabled State</Text>
        <DropZone
          title="Disabled Upload"
          description="Upload is currently disabled"
          disabled
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Multiple Files</Text>
        <DropZone
          title="Multiple File Upload"
          description="You can upload multiple files at once"
          multiple
        />
      </div>
    </Stack>
  ),
};

export const ControlledExample: Story = {
  render: () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<any[]>([]);
    
    const handleDrop = (files: File[]) => {
      setUploadedFiles(prev => [...prev, ...files]);
    };
    
    const handleReject = (files: any[]) => {
      setRejectedFiles(prev => [...prev, ...files]);
    };
    
    const clearFiles = () => {
      setUploadedFiles([]);
      setRejectedFiles([]);
    };
    
    return (
      <Stack gap="lg" w={500}>
        <DropZone
          title="Upload Images"
          description="Drag and drop image files here (max 2MB each)"
          accept={IMAGE_MIME_TYPE}
          maxSize={2 * 1024 ** 2}
          onDrop={handleDrop}
          onReject={handleReject}
          multiple
        />
        
        {uploadedFiles.length > 0 && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: 'var(--mantine-color-green-0)',
            borderRadius: '8px',
            border: '1px solid var(--mantine-color-green-3)'
          }}>
            <Text size="sm" fw={500} mb="xs" c="green">Uploaded Files ({uploadedFiles.length}):</Text>
            {uploadedFiles.map((file, index) => (
              <Text key={index} size="sm">
                • {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Text>
            ))}
          </div>
        )}
        
        {rejectedFiles.length > 0 && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: 'var(--mantine-color-red-0)',
            borderRadius: '8px',
            border: '1px solid var(--mantine-color-red-3)'
          }}>
            <Text size="sm" fw={500} mb="xs" c="red">Rejected Files ({rejectedFiles.length}):</Text>
            {rejectedFiles.map((rejection, index) => (
              <Text key={index} size="sm">
                • {rejection.file.name} - {rejection.errors[0]?.message}
              </Text>
            ))}
          </div>
        )}
        
        {(uploadedFiles.length > 0 || rejectedFiles.length > 0) && (
          <button 
            onClick={clearFiles}
            style={{ 
              padding: '8px 16px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        )}
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of controlled DropZone with file handling and feedback.',
      },
    },
  },
};

export const UseCases: Story = {
  render: () => (
    <Stack gap="lg" w={600}>
      <Title order={3} size="md" fw={500} mb="xs">Common Use Cases</Title>
      
      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb="sm">Profile Picture Upload</Text>
          <DropZone
            title="Upload Profile Picture"
            description="Drag and drop a profile image (JPEG, PNG, max 2MB)"
            accept={['image/jpeg', 'image/png']}
            maxSize={2 * 1024 ** 2}
            multiple={false}
            style={{ minHeight: 100 }}
          />
        </div>
        
        <div>
          <Text size="sm" fw={500} mb="sm">Document Upload</Text>
          <DropZone
            title="Upload Documents"
            description="Drag and drop PDF, Word, or Excel files (max 10MB each)"
            accept={[...PDF_MIME_TYPE, ...MS_WORD_MIME_TYPE, ...MS_EXCEL_MIME_TYPE]}
            maxSize={10 * 1024 ** 2}
            multiple
          />
        </div>
        
        <div>
          <Text size="sm" fw={500} mb="sm">Bulk Image Upload</Text>
          <DropZone
            title="Upload Multiple Images"
            description="Drag and drop multiple images for gallery upload (max 5MB each)"
            accept={IMAGE_MIME_TYPE}
            maxSize={5 * 1024 ** 2}
            multiple
            style={{ minHeight: 150 }}
          />
        </div>
        
        <div>
          <Text size="sm" fw={500} mb="sm">Data Import</Text>
          <DropZone
            title="Import Data File"
            description="Drag and drop CSV or Excel files for data import (max 25MB)"
            accept={['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
            maxSize={25 * 1024 ** 2}
            multiple={false}
          />
        </div>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of DropZone usage in different application contexts.',
      },
    },
  },
};

export const CustomStyling: Story = {
  render: () => (
    <Stack gap="lg" w={500}>
      <div>
        <Text size="sm" fw={500} mb="sm">Custom Border Style</Text>
        <DropZone
          title="Stylized Upload"
          description="Custom styled dropzone with dashed border"
          style={{ 
            border: '2px dashed var(--mantine-color-blue-4)',
            borderRadius: '12px',
            backgroundColor: 'var(--mantine-color-blue-0)'
          }}
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Minimal Style</Text>
        <DropZone
          title="Minimal Upload"
          description="Clean, minimal styling"
          style={{ 
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '8px',
            backgroundColor: 'var(--mantine-color-gray-0)'
          }}
        />
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Prominent Style</Text>
        <DropZone
          title="Important Upload"
          description="Prominent styling for critical uploads"
          style={{ 
            border: '3px solid var(--mantine-color-orange-4)',
            borderRadius: '16px',
            backgroundColor: 'var(--mantine-color-orange-0)',
            minHeight: 120
          }}
        />
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of DropZone with custom styling for different visual treatments.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Interactive DropZone',
    description: 'Drag and drop files here or click to select',
    maxSize: 5 * 1024 ** 2,
    multiple: true,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to interact with the DropZone and see different combinations.',
      },
    },
  },
}; 
