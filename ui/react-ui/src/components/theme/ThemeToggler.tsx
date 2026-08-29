import { colorScheme } from '@airlib/headless/utils';
import { render, setup } from '@airlib/react';
import type { HTMLAttributes } from 'react';
import { DarkModeIcon, LightModeIcon, SystemThemeIcon } from '../../icons/index.js';
import { THEME_CONFIGS } from './config.js';

export interface ThemeTogglerProps extends HTMLAttributes<HTMLButtonElement> {}

export const ThemeToggler = setup<ThemeTogglerProps>((props) => {
  const rest = props.$omit(['className', 'onClick']);
  const theme = colorScheme();

  return render(
    () => (
      <button
        {...rest}
        className={props.className || THEME_CONFIGS.toggler.class}
        data-theme={theme.current}
        onClick={theme.toggle}
      >
        {theme.mode === 'dark' && <DarkModeIcon />}
        {theme.mode === 'light' && <LightModeIcon />}
        {theme.mode === 'system' && <SystemThemeIcon />}
      </button>
    ),
    'ThemeToggler'
  );
}, 'ThemeToggler');
