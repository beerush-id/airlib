import { render, setup } from '@anchorlib/react';
import { getSettings } from '../lib/settings.js';

export const ThemeToggle = setup(() => {
  const app = getSettings();
  const toggle = () => app.toggleTheme();

  return render(
    () => (
      <button
        className="button-text aspect-square px-0 w-10 h-10 rounded-full"
        onClick={toggle}
        data-theme={app.theme}
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined">{app.theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
      </button>
    ),
    'ThemeToggle',
  );
}, 'ThemeToggle');
