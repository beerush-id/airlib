import { classx } from '@airlib/uikit/utils';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from '../../icons/index.js';
import { getWindowCtx } from '../../lib/index.js';

export type WindowControls = {
  close?: boolean;
  minimize?: boolean;
  maximize?: boolean;
  dir?: 'ltr' | 'rtl';
};

export type WindowControlProps = HTMLAttributes<HTMLButtonElement> & WindowControls;

export const WindowControl = setup<WindowControlProps>((props) => {
  const ctx = getWindowCtx();

  const close = () => ctx?.window?.close();
  const minimize = () => ctx?.window?.minimize();
  const maximize = () => ctx?.window?.maximize();

  return render(() => {
    if (props.close === false && props.minimize === false && props.maximize === false) return;

    return (
      <div
        role="group"
        aria-label="window controls"
        className={classx(() => [
          'air-window-control',
          props.className,
          { 'air-window-control-reverse': props.dir === 'ltr' },
        ])}
      >
        {props.close !== false && (
          <button onClick={close} aria-label="Close" className="air-window-close">
            <CloseIcon />
          </button>
        )}
        {props.minimize !== false && (
          <button onClick={minimize} aria-label="Minimize" className="air-window-minimize">
            <MinimizeIcon />
          </button>
        )}
        {props.maximize !== false && (
          <button onClick={maximize} aria-label="Maximize" className="air-window-maximize">
            {ctx?.window?.maximized ? <RestoreIcon /> : <MaximizeIcon />}
          </button>
        )}
      </div>
    );
  }, 'WindowControl');
}, 'WindowControl');
