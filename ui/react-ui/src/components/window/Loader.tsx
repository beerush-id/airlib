import type { AnyType, WebWindowRenderer } from '@airlib/uikit';
import { render } from '@anchorlib/react';
import type { ReactNode } from 'react';
import { WindowIcon } from '../../icons/index.js';

export const WindowLoader: WebWindowRenderer<AnyType, ReactNode> = ({ instance }) =>
  render(
    () => (
      <div className="air-window-splash">
        <WindowIcon size={64} className="text-primary" />
        <div className="flex flex-col gap-1 items-center">
          {instance.title && <h2 className="air-window-title">{instance.title}</h2>}
          {instance.description && <p className="air-window-subtitle">{instance.description}</p>}
        </div>
        {Array.from(instance.activities).map((activity, index) => (
          <span key={index} className="text-field-label text-on-surface">
            {activity}
          </span>
        ))}
      </div>
    ),
    'WindowLoader'
  );
