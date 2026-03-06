import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TodoListPage } from './TodoListPage.tsx';
import { ToastProvider } from '../hooks/useToast.tsx';
import type { Todo } from '../types.ts';

const baseTodos: Todo[] = [
  {
    id: '1',
    title: 'Work task',
    description: 'finish report',
    completed: false,
    priority: 'low',
    dueDate: null,
    tags: ['work'],
    createdAt: '2024-01-03T10:00:00.000Z',
    updatedAt: '2024-01-03T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Home task',
    description: 'clean kitchen',
    completed: true,
    priority: 'medium',
    dueDate: null,
    tags: ['home'],
    createdAt: '2024-01-02T10:00:00.000Z',
    updatedAt: '2024-01-02T10:00:00.000Z',
  },
];

const setup = (overrides?: Partial<Parameters<typeof TodoListPage>[0]>) => {
  const props = {
    todos: baseTodos,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onBulkDelete: vi.fn(),
    onBulkUpdate: vi.fn(),
    confirmDelete: false,
    ...overrides,
  };

  render(
    <ToastProvider>
      <MemoryRouter>
        <TodoListPage {...props} />
      </MemoryRouter>
    </ToastProvider>,
  );

  return props;
};

describe('TodoListPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('filters by selected tags', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /work/i }));
    expect(screen.getByText('Work task')).not.toBeNull();
    expect(screen.queryByText('Home task')).toBeNull();
  });

  it('performs bulk actions', () => {
    const props = setup();
    const checkboxes = screen.getAllByLabelText(/Select/);
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText('Mark complete'));
    expect(props.onBulkUpdate).toHaveBeenCalledWith(['1', '2'], { completed: true });

    fireEvent.change(screen.getByDisplayValue('Priority'), { target: { value: 'high' } });
    expect(props.onBulkUpdate).toHaveBeenCalledWith(['1', '2'], { priority: 'high' });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    expect(props.onBulkDelete).toHaveBeenCalledWith(['1', '2']);
  });
});
