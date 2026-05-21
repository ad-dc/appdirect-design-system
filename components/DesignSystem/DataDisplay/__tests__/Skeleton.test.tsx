import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { axe } from 'jest-axe';
import { Skeleton } from '../Skeleton';
import { theme } from '@/styles/theme';

const renderWithMantine = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <MantineProvider theme={theme} env="test">
      {ui}
    </MantineProvider>
  );

describe('Skeleton', () => {
  it('renders the Mantine skeleton element', () => {
    const { container } = renderWithMantine(
      <Skeleton height={20} width={120} data-testid="skel" />
    );

    expect(container.querySelector('[data-testid="skel"]')).not.toBeNull();
  });

  it('forwards the ref to the underlying element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithMantine(<Skeleton ref={ref} height={20} width={120} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders without the data-animate flag when animate is explicitly disabled', () => {
    const { container } = renderWithMantine(
      <Skeleton animate={false} height={20} width={120} data-testid="skel-static" />
    );

    const el = container.querySelector('[data-testid="skel-static"]');
    expect(el).not.toBeNull();
    expect(el).not.toHaveAttribute('data-animate');
  });

  it('renders with the data-animate flag when animate is enabled (default)', () => {
    const { container } = renderWithMantine(
      <Skeleton height={20} width={120} data-testid="skel-animated" />
    );

    const el = container.querySelector('[data-testid="skel-animated"]');
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute('data-animate');
  });

  it('has no axe violations in its default state', async () => {
    const { container } = renderWithMantine(<Skeleton height={24} width={220} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
