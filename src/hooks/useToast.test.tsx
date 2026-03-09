import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ToastProvider, useToast } from './useToast.tsx';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and auto-dismisses a toast', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('Saved', 'success');
    });

    expect(screen.getByText('Saved')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Saved')).toBeNull();
  });
});
