export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDirection = 'asc' | 'desc';
export type FilterStatus = 'all' | 'active' | 'completed';

export interface Settings {
  theme: 'light' | 'dark';
  defaultPriority: Priority;
  confirmDelete: boolean;
}
