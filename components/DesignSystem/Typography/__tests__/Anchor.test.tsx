import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { axe } from 'jest-axe';
import { Anchor } from '../Anchor';
import { theme } from '@/styles/theme';

const renderWithMantine = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <MantineProvider theme={theme} env="test">
      {ui}
    </MantineProvider>
  );

describe('Anchor', () => {
  it('renders the children inside an anchor element', () => {
    renderWithMantine(<Anchor href="/customers/123">Acme Corporation</Anchor>);

    const link = screen.getByRole('link', { name: 'Acme Corporation' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/customers/123');
  });

  it('passes through target and rel for external links', () => {
    renderWithMantine(
      <Anchor href="https://example.com" target="_blank" rel="noopener noreferrer">
        External
      </Anchor>
    );

    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('forwards the ref to the underlying anchor element', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    renderWithMantine(
      <Anchor href="#" ref={ref}>
        With ref
      </Anchor>
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('has no axe violations in its default state', async () => {
    const { container } = renderWithMantine(
      <Anchor href="/customers/123">Acme Corporation</Anchor>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
