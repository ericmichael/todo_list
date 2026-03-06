import { Link } from 'react-router-dom';
import type { Todo } from '../types.ts';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  confirmDelete: boolean;
  selected: boolean;
  onSelectToggle: (id: string, isSelected: boolean) => void;
}

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  confirmDelete,
  selected,
  onSelectToggle,
}: TodoItemProps) {
  const handleDelete = () => {
    if (confirmDelete && !window.confirm(`Delete "${todo.title}"?`)) return;
    onDelete(todo.id);
  };

  const isOverdue =
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        className="todo-select"
        checked={selected}
        onChange={(event) => onSelectToggle(todo.id, event.target.checked)}
        aria-label={`Select ${todo.title}`}
      />
      <label className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="todo-title">{todo.title}</span>
      </label>

      <div className="todo-meta">
        <span className={`priority priority-${todo.priority}`}>
          {priorityLabels[todo.priority]}
        </span>
        {todo.dueDate && (
          <span className="due-date">
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
        )}
        {todo.tags.length > 0 && (
          <span className="tags">
            {todo.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </span>
        )}
      </div>

      <div className="todo-actions">
        <Link to={`/edit/${todo.id}`} className="btn btn-small">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-small btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}
