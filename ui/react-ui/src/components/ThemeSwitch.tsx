import { colorScheme } from '@airlib/uikit/utils';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { DarkModeIcon, LightModeIcon, SystemThemeIcon } from '../icons/index.js';

export interface ThemeSwitchProps extends HTMLAttributes<HTMLButtonElement> {
  buttonClass?: string;
}

export const ThemeSwitch = setup<ThemeSwitchProps>((props) => {
  const theme = colorScheme();

  return render(
    () => (
      <div role="radiogroup" className={props.className ?? 'segmented-group'} data-theme={theme.current}>
        <button
          role="radio"
          aria-checked={theme.mode === 'light'}
          className={props.buttonClass ?? 'segmented-button'}
          onClick={() => theme.change('light')}
        >
          <LightModeIcon />
        </button>
        <button
          role="radio"
          aria-checked={theme.mode === 'system'}
          className={props.buttonClass ?? 'segmented-button'}
          onClick={() => theme.change('system')}
        >
          <SystemThemeIcon />
        </button>
        <button
          role="radio"
          aria-checked={theme.mode === 'dark'}
          className={props.buttonClass ?? 'segmented-button'}
          onClick={() => theme.change('dark')}
        >
          <DarkModeIcon />
        </button>
      </div>
    ),
    'ThemeSwitch'
  );
}, 'ThemeSwitch');
