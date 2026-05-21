import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Box, MantineProvider } from '@mantine/core';
import { axe } from 'jest-axe';
import { LoadingOverlay } from '../LoadingOverlay';
import { theme } from '@/styles/theme';

const renderWithMantine = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <MantineProvider theme={theme} env="test">
      {ui}
    </MantineProvider>
  );

describe('LoadingOverlay', () => {
  it('renders the overlay when visible is true', () => {
    const { container } = renderWithMantine(
      <Box pos="relative" h={120}>
        <LoadingOverlay visible />
      </Box>
    );

    expect(container.querySelector('.mantine-LoadingOverlay-root')).not.toBeNull();
  });

  it('renders no visible loader when visible is false', () => {
    const { container } = renderWithMantine(
      <Box pos="relative" h={120}>
        <LoadingOverlay visible={false} />
      </Box>
    );

    const root = container.querySelector('.mantine-LoadingOverlay-root');
    if (root) {
      const styleAttr = root.getAttribute('style') ?? '';
      expect(styleAttr).toMatch(/display:\s*none/i);
    }
  });

  it('has no axe violations when visible', async () => {
    const { container } = renderWithMantine(
      <Box pos="relative" h={120}>
        <LoadingOverlay visible />
      </Box>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
