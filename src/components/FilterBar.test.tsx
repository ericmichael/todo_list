import { describe, it, expect, vi, afterEach } from 'vitest';
import type { ComponentProps } from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { FilterBar } from './FilterBar.tsx';

const setup = () => {
  const props: ComponentProps<typeof FilterBar> = {
    search: '',
    onSearchChange: vi.fn(),
    status: 'all',
    onStatusChange: vi.fn(),
    sortField: 'createdAt',
    onSortFieldChange: vi.fn(),
    sortDirection: 'asc',
    onSortDirectionChange: vi.fn(),
    tagCounts: [
      { tag: 'work', count: 2 },
      { tag: 'home', count: 1 },
    ],
    selectedTags: [],
    onTagToggle: vi.fn(),
  };

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
    const button = screen.getByTitle('Ascending');
    fireEvent.click(button);
    expect(props.onSortDirectionChange).toHaveBeenCalledWith('desc');
  });

  it('toggles tags with counts', () => {
    const props = setup();
    const tag = screen.getByRole('button', { name: /work/i });
    const count = screen.getByText('2');
    expect(count).not.toBeNull();
    fireEvent.click(tag);
    expect(props.onTagToggle).toHaveBeenCalledWith('work');
  });
});
