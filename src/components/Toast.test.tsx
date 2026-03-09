import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from './Toast.tsx';

describe('Toast', () => {
  it('renders message with variant class', () => {
    render(<Toast message="Saved" variant="success" />);
    const toast = screen.getByText('Saved');
    expect(toast.className).toContain('toast');
    expect(toast.className).toContain('toast-success');
  });
});
