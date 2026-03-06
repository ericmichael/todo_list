import { useState } from 'react';
import type { Priority, Todo } from '../types.ts';

interface TodoFormProps {
  initial?: Todo;
  defaultPriority: Priority;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string | null;
    tags: string[];
    completed: boolean;
  }) => void;
  onCancel: () => void;
  onValidationError?: (message: string, errors: Record<string, string>) => void;
}

export function TodoForm({
  initial,
  defaultPriority,
  onSubmit,
  onCancel,
  onValidationError,
}: TodoFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? defaultPriority);
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (title.length > 200) errs.title = 'Title must be under 200 characters';
    if (dueDate) {
      const [year, month, day] = dueDate.split('-').map(Number);
      const due = new Date(year, month - 1, day);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (due < today) errs.dueDate = 'Due date cannot be in the past';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const [message] = Object.values(errs);
      if (message) {
        onValidationError?.(message, errs);
      }
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      tags,
      completed: initial?.completed ?? false,
    });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add some details..."
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {errors.dueDate && <span className="error">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <div className="tag-input-row">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
          />
          <button type="button" onClick={addTag} className="btn btn-small">
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initial ? 'Save Changes' : 'Add Todo'}
        </button>
        <button type="button" onClick={onCancel} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
}
