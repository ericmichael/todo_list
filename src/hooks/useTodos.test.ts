import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos.ts';

const store: Record<string, string> = {};

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key];

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  });
});

describe('useTodos', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('adds a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo({
        title: 'Test todo',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Test todo');
  });

  it('toggles a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo({
        title: 'Toggle me',
        description: '',
        completed: false,
        priority: 'low',
        dueDate: null,
        tags: [],
      });
    });
    const id = result.current.todos[0].id;
    act(() => {
      result.current.toggleTodo(id);
    });
    expect(result.current.todos[0].completed).toBe(true);
  });

  it('deletes a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo({
        title: 'Delete me',
        description: '',
        completed: false,
        priority: 'high',
        dueDate: null,
        tags: [],
      });
    });
    const id = result.current.todos[0].id;
    act(() => {
      result.current.deleteTodo(id);
    });
    expect(result.current.todos).toHaveLength(0);
  });

  it('updates a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo({
        title: 'Update me',
        description: '',
        completed: false,
        priority: 'low',
        dueDate: null,
        tags: [],
      });
    });
    const id = result.current.todos[0].id;
    act(() => {
      result.current.updateTodo(id, { title: 'Updated', priority: 'high' });
    });
    expect(result.current.todos[0].title).toBe('Updated');
    expect(result.current.todos[0].priority).toBe('high');
  });

  it('updates multiple todos', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo({
        title: 'First',
        description: '',
        completed: false,
        priority: 'low',
        dueDate: null,
        tags: [],
      });
      result.current.addTodo({
        title: 'Second',
        description: '',
        completed: false,
        priority: 'low',
        dueDate: null,
        tags: [],
      });
    });
    const ids = result.current.todos.map((todo) => todo.id);
    act(() => {
      result.current.updateTodos(ids, { completed: true, priority: 'high' });
    });
    expect(result.current.todos.every((todo) => todo.completed)).toBe(true);
    expect(result.current.todos.every((todo) => todo.priority === 'high')).toBe(true);
  });

  it('deletes multiple todos', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo({
        title: 'Delete one',
        description: '',
        completed: false,
        priority: 'low',
        dueDate: null,
        tags: [],
      });
      result.current.addTodo({
        title: 'Delete two',
        description: '',
        completed: false,
        priority: 'low',
        dueDate: null,
        tags: [],
      });
    });
    const ids = result.current.todos.map((todo) => todo.id);
    act(() => {
      result.current.deleteTodos(ids);
    });
    expect(result.current.todos).toHaveLength(0);
  });
});
