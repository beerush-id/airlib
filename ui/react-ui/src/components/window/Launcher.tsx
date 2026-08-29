import type { AnyType, WebWindow } from '@airlib/headless';
import { render, setup, template } from '@airlib/react';
import type { ReactNode } from 'react';
import { WindowIcon } from '../../icons/index.js';
import { BadgeDot } from '../badge/index.js';
import { Tooltip } from '../tooltip/index.js';

export type WindowLauncherProps = {
  children?: ReactNode;
};

export type LaunchButtonProps = {
  app: WebWindow<AnyType, ReactNode>;
};

export const WindowDock = setup<WindowLauncherProps>((props) => {
  return render(() => <div className="air-window-launcher">{props.children}</div>, 'WindowLauncher');
}, 'WindowLauncher');

export const WindowLauncher = template<LaunchButtonProps>(({ app }) => {
  const { name, title, icon } = app.options;

  const launch = () => {
    if (app.online) {
      app.restore();
    } else {
      app.open();
    }
  };

  return (
    <button type="button" className="air-window-launcher-button" onClick={launch}>
      <Tooltip yPos="before">{title || name}</Tooltip>
      {renderIcon(icon, title || name)}
      {app.online && <BadgeDot />}
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
