import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Toast } from './Toast.tsx';

const setup = () => {
  const toast = {
    id: 'toast-1',
    message: 'Saved successfully',
    variant: 'success',
  } as const;
  const onDismiss = vi.fn();

  render(<Toast toast={toast} onDismiss={onDismiss} />);

  return { toast, onDismiss };
};

describe('Toast', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the message with the variant class', () => {
    setup();
    expect(screen.getByText('Saved successfully')).toBeTruthy();
    const status = screen.getByRole('status');
    expect(status.className).toContain('toast-success');
  });
});
