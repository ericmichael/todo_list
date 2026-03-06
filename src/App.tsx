import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { TodoListPage } from './pages/TodoListPage.tsx';
import { NewTodoPage } from './pages/NewTodoPage.tsx';
import { EditTodoPage } from './pages/EditTodoPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { useTodos } from './hooks/useTodos.ts';
import { useSettings } from './hooks/useSettings.ts';
import { ToastProvider } from './hooks/useToast.tsx';
import './App.css';

export function App() {
  const { todos, addTodo, updateTodo, updateTodos, deleteTodo, deleteTodos, toggleTodo } = useTodos();
  const { settings, updateSettings } = useSettings();

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <TodoListPage
                  todos={todos}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onBulkDelete={deleteTodos}
                  onBulkUpdate={updateTodos}
                  confirmDelete={settings.confirmDelete}
                />
              }
            />
            <Route
              path="new"
              element={
                <NewTodoPage defaultPriority={settings.defaultPriority} onAdd={addTodo} />
              }
            />
            <Route
              path="edit/:id"
              element={
                <EditTodoPage
                  todos={todos}
                  defaultPriority={settings.defaultPriority}
                  onUpdate={updateTodo}
                />
              }
            />
            <Route
              path="settings"
              element={<SettingsPage settings={settings} onUpdate={updateSettings} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
