import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types.ts';

const STORAGE_KEY = 'todo-app-todos';

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const deleteTodos = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    setTodos((prev) => prev.filter((t) => !ids.includes(t.id)));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  }, []);

  const updateTodos = useCallback(
    (ids: string[], updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
      if (ids.length === 0) return;
      const now = new Date().toISOString();
      setTodos((prev) =>
        prev.map((t) => (ids.includes(t.id) ? { ...t, ...updates, updatedAt: now } : t)),
      );
    },
    [],
  );

  return { todos, addTodo, updateTodo, updateTodos, deleteTodo, deleteTodos, toggleTodo };
}
