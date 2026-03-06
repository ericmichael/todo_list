import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { FilterBar } from './FilterBar.tsx';

const setup = () => {
  const props = {
    search: '',
    onSearchChange: vi.fn(),
    status: 'all',
    onStatusChange: vi.fn(),
    sortField: 'createdAt',
    onSortFieldChange: vi.fn(),
    sortDirection: 'asc',
    onSortDirectionChange: vi.fn(),
  } as const;

  render(<FilterBar {...props} />);

  return props;
};

describe('FilterBar', () => {
  afterEach(() => {
    cleanup();
  });

  it('updates search input', () => {
    const props = setup();
    const input = screen.getByPlaceholderText('Search todos...');
    fireEvent.change(input, { target: { value: 'work' } });
    expect(props.onSearchChange).toHaveBeenCalledWith('work');
  });

  it('updates the status filter', () => {
    const props = setup();
    const select = screen.getByDisplayValue('All');
    fireEvent.change(select, { target: { value: 'completed' } });
    expect(props.onStatusChange).toHaveBeenCalledWith('completed');
  });

  it('updates the sort field', () => {
    const props = setup();
    const selects = screen.getAllByRole('combobox');
    const sortSelect = selects[1];
    fireEvent.change(sortSelect, { target: { value: 'priority' } });
    expect(props.onSortFieldChange).toHaveBeenCalledWith('priority');
  });

  it('toggles the sort direction', () => {
    const props = setup();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(props.onSortDirectionChange).toHaveBeenCalledWith('desc');
  });
});
