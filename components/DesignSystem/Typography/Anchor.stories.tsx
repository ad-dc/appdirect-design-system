import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack } from '@mantine/core';
import { Anchor } from './Anchor';
import { Text } from './Text';

const meta: Meta<typeof Anchor> = {
  title: 'Design System/Typography/Anchor',
  component: Anchor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Anchor (text link) component that resolves to the brand-primary color (`blue.6` / `--ad-color-brand-primary`) and underlines on hover. Use for navigational links inside body content and tables.',
      },
    },
  },
  tags: ['autodocs', 'needs-connect'],
  argTypes: {
    href: {
      control: 'text',
      description: 'Anchor target href',
    },
    target: {
      control: 'select',
      options: [undefined, '_blank', '_self', '_parent', '_top'],
      description: 'Native anchor target',
    },
    children: {
      control: 'text',
      description: 'Anchor content',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Text size',
    },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'never', 'not-hover'],
      description: 'Mantine underline behavior override',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Acme Corporation',
  },
};

export const ExternalLink: Story = {
  args: {
    href: 'https://www.appdirect.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    children: 'Open in source system',
  },
  parameters: {
    docs: {
      description: {
        story: 'External links should always carry `target="_blank"` and `rel="noopener noreferrer"`.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="sm" w={400}>
      <Anchor href="#" size="xs">Extra small anchor (xs)</Anchor>
      <Anchor href="#" size="sm">Small anchor (sm)</Anchor>
      <Anchor href="#" size="md">Medium anchor (md)</Anchor>
      <Anchor href="#" size="lg">Large anchor (lg)</Anchor>
      <Anchor href="#" size="xl">Extra large anchor (xl)</Anchor>
    </Stack>
  ),
};

export const InsideText: Story = {
  render: () => (
    <Text size="sm">
      Connectivity was merged into{' '}
      <Anchor href="#">Acme Corporation Inc.</Anchor> by Aashi Singhal on Mar 3, 2025.
    </Text>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Anchors embedded in body text adopt the brand primary color and underline on hover only.',
      },
    },
  },
};
