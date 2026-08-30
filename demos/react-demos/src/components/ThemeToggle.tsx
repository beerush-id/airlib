import { colorScheme } from '@airlib/headless/utils';
import { render, setup } from '@airlib/react';

export const ThemeToggle = setup(() => {
  const theme = colorScheme();

  return render(
    () => (
      <button className="air-icon-button" onClick={theme.toggle} data-theme={theme.current} aria-label="Toggle theme">
        <span className="material-symbols-outlined">
          {theme.mode === 'dark' ? 'dark_mode' : theme.mode === 'light' ? 'light_mode' : 'contrast'}
        </span>
      </button>
    ),
    'ThemeToggle'
  );
}, 'ThemeToggle');
