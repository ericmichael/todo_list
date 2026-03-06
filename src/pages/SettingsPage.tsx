import type { Settings, Priority } from '../types.ts';

interface SettingsPageProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
}

export function SettingsPage({ settings, onUpdate }: SettingsPageProps) {
  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={settings.theme}
            onChange={(e) => onUpdate({ theme: e.target.value as 'light' | 'dark' })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="defaultPriority">Default Priority</label>
          <select
            id="defaultPriority"
            value={settings.defaultPriority}
            onChange={(e) => onUpdate({ defaultPriority: e.target.value as Priority })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.confirmDelete}
              onChange={(e) => onUpdate({ confirmDelete: e.target.checked })}
            />
            Confirm before deleting
          </label>
        </div>
      </form>
    </div>
  );
}
