import type { AnyType, WebWindowRenderer } from '@airlib/headless';
import { render } from '@airlib/react';
import type { ReactNode } from 'react';
import { WindowIcon } from '../../icons/Window.js';
import { WINDOW_CONFIGS } from './config.js';

export const WindowSplash: WebWindowRenderer<AnyType, ReactNode> = ({ instance }) =>
  render(
    () => (
      <div className={WINDOW_CONFIGS.splash.class}>
        <WindowIcon size={64} className="text-primary" />
        <div className="flex flex-col gap-1 items-center">
          {instance.title && <h2 className={WINDOW_CONFIGS.title.class}>{instance.title}</h2>}
          {instance.description && <p className={WINDOW_CONFIGS.subtitle.class}>{instance.description}</p>}
        </div>
        {Array.from(instance.activities).map((activity, index) => (
          <span key={index} className="air-label-md text-on-surface">
            {activity}
          </span>
        ))}
      </div>
    ),
    'WindowSplash'
  );
