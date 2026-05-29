import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActionIcon } from './ActionIcon';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiEyeLine, RiDownloadLine, RiSettingsLine, RiMore2Fill } from '@remixicon/react';

const meta: Meta<typeof ActionIcon> = {
  title: 'Design System/Buttons/ActionIcon',
  component: ActionIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ActionIcon component for icon-based actions with consistent sizing and subtle styling.',
      },
    },
  },
  tags: ['autodocs', 'code-connected'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'link'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the action button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    children: {
      control: false,
      description: 'Icon content (React element)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <RiEditLine size={16} />,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon variant="default"><RiEditLine size={16} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Default</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon variant="outline"><RiEditLine size={16} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Outline</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon variant="link"><RiEditLine size={16} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Link</div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon size="xs"><RiEditLine size={12} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>xs</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon size="sm"><RiEditLine size={14} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>sm</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon size="md"><RiEditLine size={16} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>md</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon size="lg"><RiEditLine size={18} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>lg</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon size="xl"><RiEditLine size={20} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>xl</div>
      </div>
    </div>
  ),
};

export const CommonActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <ActionIcon><RiAddLine size={16} /></ActionIcon>
      <ActionIcon><RiEditLine size={16} /></ActionIcon>
      <ActionIcon><RiDeleteBinLine size={16} /></ActionIcon>
      <ActionIcon><RiEyeLine size={16} /></ActionIcon>
      <ActionIcon><RiDownloadLine size={16} /></ActionIcon>
      <ActionIcon><RiSettingsLine size={16} /></ActionIcon>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon><RiEditLine size={16} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Normal</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon disabled><RiEditLine size={16} /></ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Disabled</div>
      </div>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon>
          <RiAddLine size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
        </ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Blue Theme</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon>
          <RiDeleteBinLine size={16} style={{ color: 'var(--mantine-color-red-6)' }} />
        </ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Red Theme</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ActionIcon size="xl" style={{ width: 48, height: 48 }}>
          <RiMore2Fill size={24} />
        </ActionIcon>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>Custom Size</div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: <RiEditLine size={16} />,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to interact with the ActionIcon and see different combinations.',
      },
    },
  },
}; 
