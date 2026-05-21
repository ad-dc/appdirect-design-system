import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Box, Stack, Group } from '@mantine/core';
import { LoadingOverlay } from './LoadingOverlay';
import { Text } from '../Typography/Text';
import { Title } from '../Typography/Title';

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Design System/Data Display/LoadingOverlay',
  component: LoadingOverlay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Loading overlay placed over an existing container while data is being fetched. Defaults to a blue loader, a 2px overlay blur, and a 150 ms transition.',
      },
    },
  },
  tags: ['autodocs', 'needs-connect'],
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Toggles the overlay',
    },
    zIndex: {
      control: 'number',
      description: 'Z-index of the overlay (defaults to Mantine baseline)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box pos="relative" p="md" w={420} h={220} style={{ border: '1px solid var(--mantine-color-gray-3)' }}>
      <LoadingOverlay visible />
      <Stack gap="md">
        <Title order={4} size="md">Company Details</Title>
        <Text size="sm">Loading customer data…</Text>
      </Stack>
    </Box>
  ),
};

export const Hidden: Story = {
  render: () => (
    <Box pos="relative" p="md" w={420} h={220} style={{ border: '1px solid var(--mantine-color-gray-3)' }}>
      <LoadingOverlay visible={false} />
      <Stack gap="md">
        <Title order={4} size="md">Company Details</Title>
        <Text size="sm">Customer data is ready — overlay is hidden.</Text>
        <Group gap="sm">
          <Text size="xs" c="dimmed">Phone</Text>
          <Text size="xs">+1 555 0100</Text>
        </Group>
      </Stack>
    </Box>
  ),
};

export const CustomLoader: Story = {
  render: () => (
    <Box pos="relative" p="md" w={420} h={220} style={{ border: '1px solid var(--mantine-color-gray-3)' }}>
      <LoadingOverlay
        visible
        loaderProps={{ color: 'blue', size: 'lg', type: 'dots' }}
        overlayProps={{ blur: 4 }}
      />
      <Stack gap="md">
        <Title order={4} size="md">Heavy operation</Title>
        <Text size="sm">Overrides default loader size and overlay blur via props.</Text>
      </Stack>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Callers can override individual `loaderProps`, `overlayProps`, or `transitionProps`.',
      },
    },
  },
};
