import type { FilterStatus, SortField, SortDirection } from '../types.ts';

export interface TagCount {
  tag: string;
  count: number;
}

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: FilterStatus;
  onStatusChange: (value: FilterStatus) => void;
  sortField: SortField;
  onSortFieldChange: (value: SortField) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (value: SortDirection) => void;
  tagCounts: TagCount[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
  tagCounts,
  selectedTags,
  onTagToggle,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search todos..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />

      <div className="filter-controls">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
        >
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>

        <button
          className="btn btn-small"
          onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
          title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDirection === 'asc' ? '\u2191' : '\u2193'}
        </button>
      </div>

      {tagCounts.length > 0 && (
        <div className="tag-filters">
          {tagCounts.map((tag) => {
            const isSelected = selectedTags.includes(tag.tag);
            return (
              <button
                key={tag.tag}
                type="button"
                className={`tag-filter ${isSelected ? 'selected' : ''}`}
                onClick={() => onTagToggle(tag.tag)}
              >
                <span>{tag.tag}</span>
                <span className="tag-count">{tag.count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
