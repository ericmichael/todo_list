import { describe, it, expect, vi, afterEach } from 'vitest';
import { createElement, type ReactNode } from 'react';
import { renderHook, act, cleanup } from '@testing-library/react';
import { ToastProvider, useToast } from './useToast.tsx';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(ToastProvider, null, children);

describe('useToast', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('adds and removes toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.addToast('Task saved', { variant: 'success' });
    });
    expect(result.current.toasts).toHaveLength(1);
    const id = result.current.toasts[0].id;
    act(() => {
      result.current.removeToast(id);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-dismisses toasts after 3000ms', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.addToast('Auto-dismiss');
    });
    expect(result.current.toasts).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.toasts).toHaveLength(0);
  });
});
