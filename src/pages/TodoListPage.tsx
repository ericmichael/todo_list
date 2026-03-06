import { useState, useMemo, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar.tsx';
import { TodoItem } from '../components/TodoItem.tsx';
import { useToast } from '../hooks/useToast.tsx';
import type { Todo, FilterStatus, SortField, SortDirection, Priority } from '../types.ts';

interface TodoListPageProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkUpdate: (ids: string[], updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  confirmDelete: boolean;
}

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function TodoListPage({
  todos,
  onToggle,
  onDelete,
  onBulkDelete,
  onBulkUpdate,
  confirmDelete,
}: TodoListPageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkPriority, setBulkPriority] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => todos.some((todo) => todo.id === id)));
  }, [todos]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    todos.forEach((todo) => {
      todo.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, [todos]);

  useEffect(() => {
    setSelectedTags((prev) => prev.filter((tag) => tagCounts.some((item) => item.tag === tag)));
  }, [tagCounts]);

  const filtered = useMemo(() => {
    let result = todos;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q)),
      );
    }

    if (status === 'active') result = result.filter((t) => !t.completed);
    if (status === 'completed') result = result.filter((t) => t.completed);

    if (selectedTags.length > 0) {
      result = result.filter((t) => t.tags.some((tag) => selectedTags.includes(tag)));
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'priority':
          cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate': {
          const da = a.dueDate ?? '';
          const db = b.dueDate ?? '';
          cmp = da.localeCompare(db) || a.createdAt.localeCompare(b.createdAt);
          break;
        }
        default:
          cmp = a.createdAt.localeCompare(b.createdAt);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [todos, search, status, sortField, sortDirection, selectedTags]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const hasSelection = selectedIds.length > 0;

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((value) => value !== tag) : [...prev, tag],
    );
  };

  const handleSelectToggle = (id: string, isSelected: boolean) => {
    setSelectedIds((prev) =>
      isSelected ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((value) => value !== id),
    );
  };

  const handleBulkDelete = () => {
    if (confirmDelete && !window.confirm(`Delete ${selectedIds.length} todos?`)) return;
    onBulkDelete(selectedIds);
    setSelectedIds([]);
    const count = selectedIds.length;
    addToast(`${count} todo${count === 1 ? '' : 's'} deleted`, { variant: 'success' });
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    addToast('Todo deleted', { variant: 'success' });
  };

  const handleBulkComplete = (completed: boolean) => {
    onBulkUpdate(selectedIds, { completed });
  };

  const handleBulkPriorityChange = (priority: Priority) => {
    onBulkUpdate(selectedIds, { priority });
    setBulkPriority('');
  };

  return (
    <div className="todo-list-page">
      <div className="list-header">
        <h2>Your Todos</h2>
        <span className="count">
          {activeCount} active / {todos.length} total
        </span>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        tagCounts={tagCounts}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />

      {filtered.length === 0 ? (
        <p className="empty">
          {todos.length === 0 ? 'No todos yet. Create one!' : 'No todos match your filters.'}
        </p>
      ) : (
        <div className="todo-list">
          {filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={handleDelete}
              confirmDelete={confirmDelete}
              selected={selectedIds.includes(todo.id)}
              onSelectToggle={handleSelectToggle}
            />
          ))}
        </div>
      )}

      {hasSelection && (
        <div className="bulk-actions">
          <span className="bulk-count">{selectedIds.length} selected</span>
          <button className="btn btn-small" onClick={() => handleBulkComplete(true)}>
            Mark complete
          </button>
          <button className="btn btn-small" onClick={() => handleBulkComplete(false)}>
            Mark active
          </button>
          <select
            className="bulk-priority"
            value={bulkPriority}
            onChange={(event) => {
              const value = event.target.value as Priority;
              if (!value) {
                setBulkPriority('');
                return;
              }
              setBulkPriority(value);
              handleBulkPriorityChange(value);
            }}
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="btn btn-small btn-danger" onClick={handleBulkDelete}>
            Delete
          </button>
          <button className="btn btn-small" onClick={() => setSelectedIds([])}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
