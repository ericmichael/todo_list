import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { TodoForm } from './TodoForm.tsx';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const setup = () => {
  const props = {
    defaultPriority: 'medium',
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  } as const;

  render(<TodoForm {...props} />);

  return props;
};

describe('TodoForm validation', () => {
  afterEach(() => {
    cleanup();
  });

  it('requires a title', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Add Todo' }));
    expect(screen.getByText('Title is required')).toBeTruthy();
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it('enforces the 200 character limit', () => {
    const props = setup();
    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(201) } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Todo' }));
    expect(screen.getByText('Title must be under 200 characters')).toBeTruthy();
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it('rejects past due dates', () => {
    const props = setup();
    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: 'Plan trip' } });
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    fireEvent.change(screen.getByLabelText('Due Date'), {
      target: { value: formatDate(yesterday) },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add Todo' }));
    expect(screen.getByText('Due date cannot be in the past')).toBeTruthy();
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it('accepts today as a valid due date', () => {
    const props = setup();
    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: 'Pay bills' } });
    const today = formatDate(new Date());
    fireEvent.change(screen.getByLabelText('Due Date'), {
      target: { value: today },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add Todo' }));
    expect(screen.queryByText('Due date cannot be in the past')).toBeNull();
    expect(props.onSubmit).toHaveBeenCalledWith({
      title: 'Pay bills',
      description: '',
      priority: 'medium',
      dueDate: today,
      tags: [],
      completed: false,
    });
  });
});
