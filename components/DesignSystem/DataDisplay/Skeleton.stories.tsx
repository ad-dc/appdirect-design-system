import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack, Group } from '@mantine/core';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Design System/Data Display/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Skeleton placeholder for loading states. Defaults to `radius="sm"` and `animate={true}` to match DS loading patterns (hero, KPI row, Company Details card, tab table area).',
      },
    },
  },
  tags: ['autodocs', 'needs-connect'],
  argTypes: {
    height: {
      control: 'number',
      description: 'Skeleton height',
    },
    width: {
      control: 'text',
      description: 'Skeleton width (number or CSS value)',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius (defaults to `sm`)',
    },
    animate: {
      control: 'boolean',
      description: 'Whether the loading shimmer animates (defaults to true)',
    },
    circle: {
      control: 'boolean',
      description: 'Renders a circular skeleton (overrides width/height)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    height: 16,
    width: 220,
  },
};

export const Card: Story = {
  render: () => (
    <Stack gap="md" w={420}>
      <Skeleton height={28} width="60%" />
      <Skeleton height={14} width="40%" />
      <Skeleton height={120} />
      <Group gap="sm">
        <Skeleton height={32} width={96} radius="sm" />
        <Skeleton height={32} width={96} radius="sm" />
      </Group>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Composed skeleton — mimics the customer detail Company Details card loading state.',
      },
    },
  },
};

export const Circle: Story = {
  args: {
    height: 48,
    circle: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Circular skeleton — use for avatars, status dots, and similar circular affordances.',
      },
    },
  },
};

export const NoAnimation: Story = {
  args: {
    height: 16,
    width: 220,
    animate: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disables the shimmer animation. Useful in tests, screenshot snapshots, and reduced-motion preferences.',
      },
    },
  },
};
