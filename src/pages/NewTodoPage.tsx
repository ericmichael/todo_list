import { useNavigate } from 'react-router-dom';
import { TodoForm } from '../components/TodoForm.tsx';
import type { Priority, Todo } from '../types.ts';

interface NewTodoPageProps {
  defaultPriority: Priority;
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function NewTodoPage({ defaultPriority, onAdd }: NewTodoPageProps) {
  const navigate = useNavigate();

  return (
    <div className="new-todo-page">
      <h2>New Todo</h2>
      <TodoForm
        defaultPriority={defaultPriority}
        onSubmit={(data) => {
          onAdd(data);
          navigate('/');
        }}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
