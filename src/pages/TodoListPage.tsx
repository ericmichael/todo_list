import { useState, useMemo } from 'react';
import { FilterBar } from '../components/FilterBar.tsx';
import { TodoItem } from '../components/TodoItem.tsx';
import type { Todo, FilterStatus, SortField, SortDirection } from '../types.ts';

interface TodoListPageProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  confirmDelete: boolean;
}

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function TodoListPage({ todos, onToggle, onDelete, confirmDelete }: TodoListPageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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
  }, [todos, search, status, sortField, sortDirection]);

  const activeCount = todos.filter((t) => !t.completed).length;

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
              onDelete={onDelete}
              confirmDelete={confirmDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
