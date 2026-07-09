import { type AnyType, WebWin, type WebWindow } from '@airlib/uikit';
import { For, render, setup, template } from '@anchorlib/react';
import type { ReactNode } from 'react';
import { SearchIcon, WindowIcon } from '../../icons/index.js';
import { BadgeDot } from '../badge/index.js';
import { Tooltip } from '../tooltip/index.js';

export type WindowLauncherProps = {
  children?: ReactNode;
};

export const WindowLauncher = setup<WindowLauncherProps>((props) => {
  return render(
    () => (
      <div className="air-window-launcher">
        <label className="air-button-elevated">
          <SearchIcon />
          <input placeholder="Ask Claude..." />
        </label>
        <For each={Array.from(WebWin.windows.values())}>{(host) => <LaunchButton app={{ window: host }} />}</For>
        {props.children}
      </div>
    ),
    'WindowLauncher'
  );
}, 'WindowLauncher');

export type LaunchButtonProps = {
  app: { window: WebWindow<AnyType, ReactNode> };
};

export const LaunchButton = template<LaunchButtonProps>(({ app }) => {
  const { name, title, icon } = app.window.options;

  return (
    <button type="button" className="air-window-launcher-button" onClick={() => app.window.open()}>
      <Tooltip yPos="before">{title || name}</Tooltip>
      {renderIcon(icon, title || name)}
      {app.window.online && <BadgeDot />}
    </button>
  );
}, 'LaunchButton');

const renderIcon = (icon?: string | (() => ReactNode), alt?: string) => {
  if (typeof icon === 'string') {
    return <img src={icon} alt={alt} className="air-icon" />;
  }
  if (typeof icon === 'function') {
    return icon();
  }
  return <WindowIcon />;
};
