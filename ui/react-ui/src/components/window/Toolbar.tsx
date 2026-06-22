import { classx } from '@airlib/uikit/utils';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { getWindowCtx } from '../../lib/index.js';
import { WindowControl, type WindowControls } from './Control.js';

export type WindowToolbarProps = HTMLAttributes<HTMLDivElement> & WindowControls;

export const WindowToolbar = setup<WindowToolbarProps>((props) => {
  const ctx = getWindowCtx();
  const assignRef = (el: HTMLDivElement | null) => {
    if (!ctx) return;

    ctx.dragger.trigger = el as HTMLDivElement;
  };

  return render(
    () => (
      <div role="toolbar" ref={assignRef} className={classx(['air-window-toolbar', props.className])}>
        {props.dir === 'ltr' && props.children}
        <WindowControl dir={props.dir} close={props.close} minimize={props.minimize} maximize={props.maximize} />
        {props.dir !== 'ltr' && props.children}
      </div>
    ),
    'WindowToolbar'
  );
}, 'WindowToolbar');
