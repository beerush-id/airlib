import { classx } from '@airlib/headless/utils';
import { render, setup } from '@airlib/react';
import type { HTMLAttributes, MouseEventHandler } from 'react';
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from '../../icons/index.js';
import { getWindowCtx } from '../../lib/index.js';
import { WINDOW_CONFIGS } from './config.js';
import { Tooltip } from '../tooltip/Tooltip.tsx';

export type WindowControls = {
  dir?: 'ltr' | 'rtl';
  close?: boolean;
  minimize?: boolean;
  maximize?: boolean;
  closeClass?: string;
  minimizeClass?: string;
  maximizeClass?: string;
  reversedClass?: string;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  onMinimize?: MouseEventHandler<HTMLButtonElement>;
  onMaximize?: MouseEventHandler<HTMLButtonElement>;
};

export type WindowControlProps = HTMLAttributes<HTMLButtonElement> & WindowControls;

export const WindowControl = setup<WindowControlProps>((props) => {
  const ctx = getWindowCtx();

  const close: MouseEventHandler<HTMLButtonElement> = (e) => {
    ctx?.window?.close();
    props.onClose?.(e);
  };
  const minimize: MouseEventHandler<HTMLButtonElement> = (e) => {
    ctx?.window?.minimize();
    props.onMinimize?.(e);
  };
  const maximize: MouseEventHandler<HTMLButtonElement> = (e) => {
    ctx?.window?.maximize();
    props.onMaximize?.(e);
  };

  return render(() => {
    if (props.close === false && props.minimize === false && props.maximize === false) return;

    return (
      <div
        role="group"
        aria-label="window controls"
        className={classx(() => [
          props.className || WINDOW_CONFIGS.controls.class,
          { [props.reversedClass ?? WINDOW_CONFIGS.controls.reversedClass]: props.dir !== 'ltr' },
        ])}
      >
        {props.maximize !== false && (
          <button
            aria-label="Maximize"
            onClick={maximize}
            className={props.maximizeClass ?? WINDOW_CONFIGS.controls.maximize.class}
          >
            {ctx?.window?.maximized ? <RestoreIcon /> : <MaximizeIcon />}
            <Tooltip>{ctx?.window?.maximized ? 'Restore' : 'Maximize'}</Tooltip>
          </button>
        )}
        {props.minimize !== false && (
          <button
            aria-label="Minimize"
            onClick={minimize}
            className={props.minimizeClass ?? WINDOW_CONFIGS.controls.minimize.class}
          >
            <MinimizeIcon />
            <Tooltip>Minimize</Tooltip>
          </button>
        )}
        {props.close !== false && (
          <button
            aria-label="Close"
            onClick={close}
            className={props.closeClass ?? WINDOW_CONFIGS.controls.close.class}
          >
            <CloseIcon />
            <Tooltip>Close</Tooltip>
          </button>
        )}
      </div>
    );
  }, 'WindowControl');
}, 'WindowControl');
