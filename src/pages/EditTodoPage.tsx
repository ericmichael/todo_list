import { useParams, useNavigate } from 'react-router-dom';
import { TodoForm } from '../components/TodoForm.tsx';
import { useToast } from '../hooks/useToast.tsx';
import type { Priority, Todo } from '../types.ts';

interface EditTodoPageProps {
  todos: Todo[];
  defaultPriority: Priority;
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

export function EditTodoPage({ todos, defaultPriority, onUpdate }: EditTodoPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return (
      <div className="edit-todo-page">
        <h2>Todo not found</h2>
        <button onClick={() => navigate('/')} className="btn">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="edit-todo-page">
      <h2>Edit Todo</h2>
      <TodoForm
        initial={todo}
        defaultPriority={defaultPriority}
        onSubmit={(data) => {
          onUpdate(todo.id, data);
          showToast('Todo updated successfully.', 'success');
          navigate('/');
        }}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
