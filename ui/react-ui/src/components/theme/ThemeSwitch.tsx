import { colorScheme } from '@airlib/headless/utils';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { DarkModeIcon, LightModeIcon } from '../../icons/index.js';
import { Tooltip } from '../tooltip/Tooltip.tsx';
import { THEME_CONFIGS } from './config.js';
import { ThemeColor } from './ThemeColor.tsx';

export interface ThemeSwitchProps extends HTMLAttributes<HTMLButtonElement> {
  colorizer?: boolean;
  buttonClass?: string;
}

export const ThemeSwitch = setup<ThemeSwitchProps>((props) => {
  const theme = colorScheme();

  return render(
    () => (
      <div role="radiogroup" className={props.className || THEME_CONFIGS.switchGroup.class} data-theme={theme.current}>
        <button
          role="radio"
          aria-checked={theme.mode === 'light'}
          className={props.buttonClass ?? THEME_CONFIGS.switchButton.class}
          onClick={() => theme.change('light', true)}
        >
          <LightModeIcon />
          <Tooltip>Light Mode</Tooltip>
        </button>
        {props.colorizer !== false && <ThemeColor />}
        <button
          role="radio"
          aria-checked={theme.mode === 'dark'}
          className={props.buttonClass ?? THEME_CONFIGS.switchButton.class}
          onClick={() => theme.change('dark', true)}
        >
          <DarkModeIcon />
          <Tooltip>Dark Mode</Tooltip>
        </button>
      </div>
    ),
    'ThemeSwitch'
  );
}, 'ThemeSwitch');
