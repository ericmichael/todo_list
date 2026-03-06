import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettings } from './useSettings.ts';

const store: Record<string, string> = {};

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key];

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  });

  document.documentElement.removeAttribute('data-theme');
});

describe('useSettings', () => {
  it('loads defaults when storage is empty', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings).toEqual({
      theme: 'light',
      defaultPriority: 'medium',
      confirmDelete: true,
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('merges stored values with defaults', () => {
    store['todo-app-settings'] = JSON.stringify({
      theme: 'dark',
      defaultPriority: 'high',
    });
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings).toEqual({
      theme: 'dark',
      defaultPriority: 'high',
      confirmDelete: true,
    });
  });

  it('persists updates and sets the theme attribute', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.updateSettings({ theme: 'dark', confirmDelete: false });
    });
    expect(store['todo-app-settings']).toBe(
      JSON.stringify({
        theme: 'dark',
        defaultPriority: 'medium',
        confirmDelete: false,
      }),
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
