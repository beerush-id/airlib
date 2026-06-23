import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { getWindowCtx } from '../../lib/index.js';
import { WindowControl, type WindowControls } from './Control.js';
import { WINDOW_CONFIGS } from './config.js';

export type WindowToolbarProps = HTMLAttributes<HTMLDivElement> & WindowControls;

export const WindowToolbar = setup<WindowToolbarProps>((props) => {
  const ctx = getWindowCtx();
  const assignRef = (el: HTMLDivElement | null) => {
    if (!ctx) return;
    ctx.dragger.trigger = el as HTMLDivElement;
  };

  return render(
    () => (
      <div role="toolbar" ref={assignRef} className={props.className ?? WINDOW_CONFIGS.toolbar.class}>
        {props.dir === 'rtl' && props.children}
        <WindowControl
          dir={props.dir}
          close={props.close}
          minimize={props.minimize}
          maximize={props.maximize}
          closeClass={props.closeClass}
          minimizeClass={props.minimizeClass}
          maximizeClass={props.maximizeClass}
          reversedClass={props.reversedClass}
          onClose={props.onClose}
          onMinimize={props.onMinimize}
          onMaximize={props.onMaximize}
        />
        {props.dir !== 'ltr' && props.children}
      </div>
    ),
    'WindowToolbar'
  );
}, 'WindowToolbar');
