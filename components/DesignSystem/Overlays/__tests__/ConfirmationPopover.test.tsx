import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { axe } from 'jest-axe';
import { ConfirmationPopover, Popover } from '../Popover';
import { Button } from '../../Buttons/Button';
import { Text } from '../../Typography/Text';
import { theme } from '@/styles/theme';

const renderWithMantine = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <MantineProvider theme={theme} env="test">
      {ui}
    </MantineProvider>
  );

// A controlled wrapper helps us drive `opened` from the test so focus/effects fire deterministically.
function ControlledConfirmationPopover(
  props: Omit<React.ComponentProps<typeof ConfirmationPopover>, 'trigger' | 'opened' | 'onClose'>
): React.ReactElement {
  const [opened, setOpened] = useState(false);
  return (
    <ConfirmationPopover
      trigger={
        <Button data-testid="trigger" onClick={() => setOpened((value) => !value)}>
          Open
        </Button>
      }
      opened={opened}
      onClose={() => setOpened(false)}
      {...props}
    />
  );
}

describe('ConfirmationPopover — typed confirmation', () => {
  it('does not render the typed input when confirmationKeyword is omitted (backwards compatible)', async () => {
    const user = userEvent.setup();
    renderWithMantine(
      <ControlledConfirmationPopover title="Confirm action" onConfirm={() => undefined}>
        <Text size="sm">Plain confirmation body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
    expect(screen.queryByTestId('confirmation-popover-typed-input')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).not.toBeDisabled();
  });

  it('renders the required typed input when confirmationKeyword is set', async () => {
    const user = userEvent.setup();
    renderWithMantine(
      <ControlledConfirmationPopover
        title="Confirm Restore"
        confirmLabel="Confirm Restore"
        confirmationKeyword="RESTORE"
      >
        <Text size="sm">Restore body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));

    const input = await screen.findByLabelText(/Type RESTORE to proceed\./i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('keeps the confirm CTA disabled until the typed value matches exactly', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithMantine(
      <ControlledConfirmationPopover
        title="Confirm Restore"
        confirmLabel="Confirm Restore"
        confirmationKeyword="RESTORE"
        onConfirm={onConfirm}
      >
        <Text size="sm">Restore body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));
    const input = await screen.findByLabelText(/Type RESTORE to proceed\./i);
    const confirmBtn = screen.getByRole('button', { name: 'Confirm Restore' });

    expect(confirmBtn).toBeDisabled();

    await user.type(input, 'restore');
    expect(confirmBtn).toBeDisabled();

    await user.clear(input);
    await user.type(input, 'RESTORE');
    await waitFor(() => expect(confirmBtn).toBeEnabled());

    await user.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('defaults confirmVariant to danger only when confirmationKeyword is set AND caller did not override', async () => {
    const user = userEvent.setup();

    // Case 1: keyword set, no caller override → CTA renders with the danger variant.
    const { unmount } = renderWithMantine(
      <ControlledConfirmationPopover
        title="Confirm Restore"
        confirmLabel="Confirm Restore"
        confirmationKeyword="RESTORE"
      >
        <Text size="sm">Restore body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));
    const dangerCta = await screen.findByRole('button', { name: 'Confirm Restore' });
    expect(dangerCta).toHaveAttribute('data-variant', 'danger');
    unmount();

    // Case 2: keyword set BUT caller passes confirmVariant="primary" → CTA stays primary.
    renderWithMantine(
      <ControlledConfirmationPopover
        title="Acknowledge"
        confirmLabel="I acknowledge"
        confirmationKeyword="ACK"
        confirmVariant="primary"
      >
        <Text size="sm">Body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));
    const primaryCta = await screen.findByRole('button', { name: 'I acknowledge' });
    expect(primaryCta).toHaveAttribute('data-variant', 'primary');
  });

  it('omits the danger default when confirmationKeyword is not set', async () => {
    const user = userEvent.setup();
    renderWithMantine(
      <ControlledConfirmationPopover title="Plain" onConfirm={() => undefined}>
        <Text size="sm">Plain body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));
    const cta = await screen.findByRole('button', { name: 'Confirm' });
    expect(cta).toHaveAttribute('data-variant', 'primary');
  });

  it('focuses the typed input on open (not the confirm CTA)', async () => {
    const user = userEvent.setup();
    renderWithMantine(
      <ControlledConfirmationPopover
        title="Confirm Restore"
        confirmLabel="Confirm Restore"
        confirmationKeyword="RESTORE"
      >
        <Text size="sm">Restore body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));
    const input = await screen.findByLabelText(/Type RESTORE to proceed\./i);

    await waitFor(() => {
      expect(document.activeElement).toBe(input);
    });
  });

  it('has no axe violations with the typed-confirmation variant open', async () => {
    const user = userEvent.setup();
    const { container } = renderWithMantine(
      <ControlledConfirmationPopover
        title="Confirm Restore"
        confirmLabel="Confirm Restore"
        confirmationKeyword="RESTORE"
      >
        <Text size="sm">Restore body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));
    await screen.findByLabelText(/Type RESTORE to proceed\./i);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('ConfirmationPopover — default behaviour (no keyword)', () => {
  it('invokes onConfirm and onCancel for the basic confirmation flow', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    renderWithMantine(
      <ControlledConfirmationPopover title="Plain confirm" onConfirm={onConfirm} onCancel={onCancel}>
        <Text size="sm">Plain body.</Text>
      </ControlledConfirmationPopover>
    );

    await user.click(screen.getByTestId('trigger'));
    await screen.findByRole('button', { name: 'Confirm' });

    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId('trigger'));
    await screen.findByRole('button', { name: 'Cancel' });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('still re-exports the base Popover untouched', () => {
    expect(Popover).toBeDefined();
  });
});
