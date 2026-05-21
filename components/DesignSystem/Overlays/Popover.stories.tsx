import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack } from '@mantine/core';
import { Inline } from '@/components/DesignSystem';
import { Popover, ConfirmationPopover } from './Popover';
import { useState } from 'react';
import { Title } from '../Typography/Title';
import { Text } from '../Typography/Text';
import { Button } from '../Buttons/Button';
import { TextInput } from '../Inputs/TextInput';
import { Switch } from '../Inputs/Switch';
import { ThemeIcon } from '../DataDisplay/ThemeIcon';

const meta: Meta<typeof Popover> = {
  title: 'Design System/Overlays/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Popover component for displaying contextual content with flexible positioning and action buttons.',
      },
    },
  },
  tags: ['autodocs', 'code-connected'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'left', 'right', 'bottom'],
      description: 'Popover position relative to target',
    },
    title: {
      control: 'text',
      description: 'Popover title',
    },
    width: {
      control: 'number',
      description: 'Popover width',
    },
    withArrow: {
      control: 'boolean',
      description: 'Whether to show arrow',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Whether popover can be closed by clicking outside',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether popover can be closed by pressing Escape',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover
      trigger={<Button>Show Popover</Button>}
      title="Information"
    >
      <Text size="sm">This is a basic popover with some helpful information.</Text>
    </Popover>
  ),
};

export const Positions: Story = {
  render: () => (
    <Stack gap="xl" align="center">
      <Inline gap="xl">
        <Popover
          trigger={<Button variant="outline" size="sm">Top</Button>}
          title="Top Popover"
          position="top"
        >
          <Text size="sm">This popover appears above the trigger.</Text>
        </Popover>
        
        <Popover
          trigger={<Button variant="outline" size="sm">Bottom</Button>}
          title="Bottom Popover"
          position="bottom"
        >
          <Text size="sm">This popover appears below the trigger.</Text>
        </Popover>
      </Inline>
      
      <Inline gap="xl">
        <Popover
          trigger={<Button variant="outline" size="sm">Left</Button>}
          title="Left Popover"
          position="left"
        >
          <Text size="sm">This popover appears to the left of the trigger.</Text>
        </Popover>
        
        <Popover
          trigger={<Button variant="outline" size="sm">Right</Button>}
          title="Right Popover"
          position="right"
        >
          <Text size="sm">This popover appears to the right of the trigger.</Text>
        </Popover>
      </Inline>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different positioning options for the Popover component.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    
    const handleSave = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        console.log('Saved!');
      }, 2000);
    };
    
    return (
      <Popover
        trigger={<Button>Actions Popover</Button>}
        title="Confirm Action"
        actions={[
          {
            id: 'save',
            label: 'Save Changes',
            variant: 'primary',
            onClick: handleSave,
            loading: loading,
          },
          {
            id: 'cancel',
            label: 'Cancel',
            variant: 'outline',
            closeOnClick: true,
          },
        ]}
      >
        <Text size="sm">Are you sure you want to save these changes?</Text>
      </Popover>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Popover with action buttons including loading states.',
      },
    },
  },
};

export const WithTertiaryActions: Story = {
  render: () => (
    <Popover
      trigger={<Button>Complex Actions</Button>}
      title="File Actions"
      actions={[
        {
          id: 'save',
          label: 'Save',
          variant: 'primary',
          closeOnClick: true,
        },
        {
          id: 'cancel',
          label: 'Cancel',
          variant: 'outline',
          closeOnClick: true,
        },
      ]}
      tertiaryActions={[
        {
          id: 'more',
          label: 'More Options',
          variant: 'default',
          onClick: () => alert('More options clicked'),
        },
        {
          id: 'help',
          label: 'Help',
          variant: 'outline',
          onClick: () => alert('Help clicked'),
        },
      ]}
    >
      <Text size="sm">
        This popover demonstrates the action layout: primary actions on the left, 
        tertiary actions on the right.
      </Text>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover with both primary actions (left) and tertiary actions (right).',
      },
    },
  },
};

export const FormPopover: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      notifications: false,
    });
    
    const handleSubmit = () => {
      console.log('Form data:', formData);
    };
    
    return (
      <Popover
        trigger={<Button>Quick Form</Button>}
        title="Quick Settings"
        width={300}
        actions={[
          {
            id: 'apply',
            label: 'Apply',
            variant: 'primary',
            onClick: handleSubmit,
            disabled: !formData.name.trim(),
            closeOnClick: true,
          },
          {
            id: 'cancel',
            label: 'Cancel',
            variant: 'outline',
            closeOnClick: true,
          },
        ]}
      >
        <Stack gap="sm">
          <TextInput
            label="Name"
            placeholder="Enter name..."
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            size="sm"
          />
          <TextInput
            label="Email"
            placeholder="Enter email..."
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            size="sm"
          />
          <Switch
            label="Enable notifications"
            checked={formData.notifications}
            onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
          />
        </Stack>
      </Popover>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Popover containing a form with validation and state management.',
      },
    },
  },
};

export const ConfirmationPopovers: Story = {
  render: () => (
    <Inline gap="lg">
      <ConfirmationPopover
        trigger={<Button variant="outline">Basic Confirmation</Button>}
        title="Confirm Action"
        onConfirm={() => console.log('Confirmed!')}
        onCancel={() => console.log('Cancelled!')}
      >
        <Text size="sm">Are you sure you want to perform this action?</Text>
      </ConfirmationPopover>
      
      <ConfirmationPopover
        trigger={<Button color="red" variant="outline">Delete Item</Button>}
        title="Delete Item"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={() => console.log('Item deleted!')}
        onCancel={() => console.log('Delete cancelled!')}
      >
        <Text size="sm">This action cannot be undone. Are you sure you want to delete this item?</Text>
      </ConfirmationPopover>
      
      <ConfirmationPopover
        trigger={<Button variant="outline">Custom Confirmation</Button>}
        title="Custom Action"
        confirmLabel="Yes, Continue"
        cancelLabel="No, Go Back"
        confirmVariant="primary"
        onConfirm={() => console.log('Custom action confirmed!')}
        onCancel={() => console.log('Custom action cancelled!')}
        tertiaryActions={[
          {
            id: 'more-info',
            label: 'More Info',
            variant: 'default',
            onClick: () => alert('More information about this action...'),
          },
        ]}
      >
        <Text size="sm">
          This is a custom confirmation popover with different button labels and tertiary actions.
        </Text>
      </ConfirmationPopover>
    </Inline>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pre-configured ConfirmationPopover variants for common confirmation patterns.',
      },
    },
  },
};

export const TypedConfirmation: Story = {
  render: () => (
    <Inline gap="lg">
      <ConfirmationPopover
        trigger={<Button variant="outline">Restore record</Button>}
        title="Confirm Restore"
        confirmLabel="Confirm Restore"
        confirmationKeyword="RESTORE"
        onConfirm={() => console.log('Restored')}
        onCancel={() => console.log('Cancelled restore')}
      >
        <Text size="sm">
          You&apos;re about to restore <strong>Connectivity</strong> from <strong>Acme Corporation Inc.</strong>
        </Text>
      </ConfirmationPopover>

      <ConfirmationPopover
        trigger={<Button variant="outline">Override variant</Button>}
        title="Acknowledge change"
        confirmLabel="I acknowledge"
        confirmationKeyword="ACK"
        confirmVariant="primary"
        onConfirm={() => console.log('Acknowledged')}
      >
        <Text size="sm">
          When the caller passes <code>confirmVariant=&quot;primary&quot;</code> the typed input still
          gates the CTA, but the button stays primary instead of defaulting to <code>danger</code>.
        </Text>
      </ConfirmationPopover>
    </Inline>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Typed-confirmation variant: requires the user to type the exact keyword before the confirm CTA enables. Defaults to a `danger` variant unless the caller overrides `confirmVariant`.',
      },
    },
  },
};

export const DifferentTriggers: Story = {
  render: () => (
    <Stack gap="lg" w={500}>
      <div>
        <Text size="sm" fw={500} mb="sm">Button Triggers:</Text>
        <Inline gap="sm">
          <Popover
            trigger={<Button variant="primary" size="sm">Primary</Button>}
            title="Primary Button"
          >
            <Text size="sm">Popover triggered by a primary button.</Text>
          </Popover>
          
          <Popover
            trigger={<Button variant="outline" size="sm">Outline</Button>}
            title="Outline Button"
          >
            <Text size="sm">Popover triggered by an outline button.</Text>
          </Popover>
        </Inline>
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Icon Triggers:</Text>
        <Inline gap="sm">
          <Popover
            trigger={
              <ThemeIcon variant="info" size="sm" style={{ cursor: 'pointer' }}>
                <span>ℹ</span>
              </ThemeIcon>
            }
            title="Information"
            position="top"
          >
            <Text size="sm">This is helpful information about the feature.</Text>
          </Popover>
          
          <Popover
            trigger={
              <ThemeIcon variant="default" size="sm" style={{ cursor: 'pointer' }}>
                <span>⚙</span>
              </ThemeIcon>
            }
            title="Settings"
            position="bottom"
          >
            <Text size="sm">Quick settings and configuration options.</Text>
          </Popover>
          
          <Popover
            trigger={
              <ThemeIcon variant="warning" size="sm" style={{ cursor: 'pointer' }}>
                <span>⚠</span>
              </ThemeIcon>
            }
            title="Warning"
            position="right"
          >
            <Text size="sm">Important warning information to consider.</Text>
          </Popover>
        </Inline>
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Text Triggers:</Text>
        <Inline gap="sm">
          <Popover
            trigger={
              <Text 
                size="sm" 
                style={{ 
                  textDecoration: 'underline dotted', 
                  cursor: 'help',
                  color: 'var(--mantine-color-blue-6)'
                }}
              >
                Hover for details
              </Text>
            }
            title="Details"
          >
            <Text size="sm">Additional details about this item or feature.</Text>
          </Popover>
          
          <Popover
            trigger={
              <Text 
                size="sm" 
                fw={500}
                style={{ 
                  borderBottom: '1px dotted var(--mantine-color-gray-5)', 
                  cursor: 'help'
                }}
              >
                API
              </Text>
            }
            title="API Information"
          >
            <Text size="sm">Application Programming Interface - details about our API.</Text>
          </Popover>
        </Inline>
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Popover attached to different types of trigger elements.',
      },
    },
  },
};

export const ControlledPopover: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    
    return (
      <Stack gap="md" align="center">
        <Inline gap="sm">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setOpened(true)}
          >
            Open Popover
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setOpened(false)}
          >
            Close Popover
          </Button>
        </Inline>
        
        <Popover
          trigger={<Button>Controlled Popover</Button>}
          title="Controlled State"
          opened={opened}
          onChange={setOpened}
          onClose={() => setOpened(false)}
          actions={[
            {
              id: 'action',
              label: 'Action',
              variant: 'primary',
              onClick: () => {
                console.log('Action clicked');
                setOpened(false);
              },
            },
            {
              id: 'keep-open',
              label: 'Keep Open',
              variant: 'outline',
              onClick: () => console.log('Popover stays open'),
            },
          ]}
        >
          <Text size="sm">
            This popover's state is controlled externally. Use the buttons above to control it.
          </Text>
        </Popover>
        
        <Text size="sm" c="dimmed">
          Popover is currently: {opened ? 'Open' : 'Closed'}
        </Text>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Popover with controlled open/close state.',
      },
    },
  },
};

export const ContextualPopovers: Story = {
  render: () => (
    <Stack gap="lg" w={600}>
      <div>
        <Text size="sm" fw={500} mb="sm">Help & Information:</Text>
        <Inline gap="md" align="center">
          <Text size="sm">Password</Text>
          <Popover
            trigger={
              <ThemeIcon variant="info" size="xs" style={{ cursor: 'pointer' }}>
                <span style={{ fontSize: '10px' }}>?</span>
              </ThemeIcon>
            }
            title="Password Requirements"
            width={250}
            position="right"
          >
            <Stack gap="xs">
              <Text size="xs">• At least 8 characters long</Text>
              <Text size="xs">• Contains uppercase and lowercase letters</Text>
              <Text size="xs">• Contains at least one number</Text>
              <Text size="xs">• Contains at least one special character</Text>
            </Stack>
          </Popover>
        </Inline>
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Quick Actions:</Text>
        <Inline gap="sm">
          <Popover
            trigger={
              <div style={{
                padding: '8px 12px',
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📄</span>
                <Text size="sm">document.pdf</Text>
                <span style={{ fontSize: '12px', color: 'var(--mantine-color-gray-6)' }}>▼</span>
              </div>
            }
            title="File Actions"
            actions={[
              {
                id: 'download',
                label: 'Download',
                variant: 'primary',
                closeOnClick: true,
              },
            ]}
            tertiaryActions={[
              {
                id: 'share',
                label: 'Share',
                variant: 'outline',
                closeOnClick: true,
              },
              {
                id: 'delete',
                label: 'Delete',
                variant: 'outline',
                closeOnClick: true,
              },
            ]}
          >
            <Text size="sm">Choose an action for this file.</Text>
          </Popover>
        </Inline>
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">Status Information:</Text>
        <Inline gap="md">
          <Popover
            trigger={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--mantine-color-green-6)' 
                }} />
                <Text size="sm">System Online</Text>
              </div>
            }
            title="System Status"
            position="top"
          >
            <Stack gap="xs">
              <Inline gap="xs" justify="space-between">
                <Text size="xs">API Server</Text>
                <Text size="xs" c="green">Online</Text>
              </Inline>
              <Inline gap="xs" justify="space-between">
                <Text size="xs">Database</Text>
                <Text size="xs" c="green">Online</Text>
              </Inline>
              <Inline gap="xs" justify="space-between">
                <Text size="xs">Cache</Text>
                <Text size="xs" c="green">Online</Text>
              </Inline>
              <Inline gap="xs" justify="space-between">
                <Text size="xs">Last Check</Text>
                <Text size="xs" c="dimmed">2 min ago</Text>
              </Inline>
            </Stack>
          </Popover>
        </Inline>
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of contextual popover usage.',
      },
    },
  },
};

export const UseCases: Story = {
  render: () => (
    <Stack gap="xl" w={700}>
      <Title order={3} size="md" fw={500} mb="xs">Common Use Cases</Title>
      
      <div>
        <Text size="sm" fw={500} mb="sm">1. Form Field Help:</Text>
        <Inline gap="xs" align="center">
          <TextInput
            label="API Key"
            placeholder="Enter your API key..."
            style={{ flex: 1 }}
          />
          <Popover
            trigger={
              <ThemeIcon variant="info" size="sm" style={{ cursor: 'pointer' }}>
                <span>?</span>
              </ThemeIcon>
            }
            title="API Key Help"
            width={250}
            position="right"
          >
            <Text size="sm">
              You can find your API key in your account settings under the "Developers" section.
            </Text>
          </Popover>
        </Inline>
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">2. Quick Confirmations:</Text>
        <Inline gap="sm">
          <ConfirmationPopover
            trigger={<Button variant="outline" size="sm">Archive Item</Button>}
            title="Archive Item"
            confirmLabel="Archive"
            onConfirm={() => console.log('Item archived')}
          >
            <Text size="sm">This item will be moved to the archive.</Text>
          </ConfirmationPopover>
          
          <ConfirmationPopover
            trigger={<Button color="red" variant="outline" size="sm">Delete</Button>}
            title="Delete Item"
            confirmLabel="Delete"
            confirmVariant="danger"
            onConfirm={() => console.log('Item deleted')}
          >
            <Text size="sm">This action cannot be undone.</Text>
          </ConfirmationPopover>
        </Inline>
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">3. Feature Previews:</Text>
        <Inline gap="sm">
          <Popover
            trigger={<Button variant="outline" size="sm">Preview Feature</Button>}
            title="New Dashboard"
            width={300}
            actions={[
              {
                id: 'enable',
                label: 'Enable Beta',
                variant: 'primary',
                closeOnClick: true,
              },
            ]}
          >
            <Stack gap="sm">
              <Text size="sm">
                Try our new dashboard with improved analytics and better performance.
              </Text>
              <div style={{
                width: '100%',
                height: 80,
                backgroundColor: 'var(--mantine-color-gray-1)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text size="xs" c="dimmed">Dashboard Preview</Text>
              </div>
            </Stack>
          </Popover>
        </Inline>
      </div>
      
      <div>
        <Text size="sm" fw={500} mb="sm">4. Settings Shortcuts:</Text>
        <Inline gap="sm">
          <Popover
            trigger={
              <ThemeIcon variant="default" size="md" style={{ cursor: 'pointer' }}>
                <span>⚙</span>
              </ThemeIcon>
            }
            title="Quick Settings"
            width={250}
            actions={[
              {
                id: 'save',
                label: 'Save',
                variant: 'primary',
                closeOnClick: true,
              },
            ]}
          >
            <Stack gap="sm">
              <Switch label="Dark mode" />
              <Switch label="Email notifications" defaultChecked />
              <Switch label="Auto-save" defaultChecked />
            </Stack>
          </Popover>
        </Inline>
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of Popover usage in different application contexts.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Interactive Popover',
    position: 'bottom',
    width: 'auto',
    withArrow: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    trigger: <Button>Interactive Popover</Button>,
    children: 'Use the controls below to interact with the Popover and see different combinations.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to interact with the Popover and see different combinations.',
      },
    },
  },
}; 