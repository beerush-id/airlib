import { dragRef, KIT_CONFIGS, resizeRef } from '@airlib/uikit';
import { focusRef } from '@airlib/uikit/utils';
import { nodeRef, render, setContext, setup } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { getWindow, WINDOW_CTX_SYMBOL } from '../../lib/index.js';
import type { WindowControls } from './Control.js';
import { WINDOW_CONFIGS } from './config.js';
import { WindowToolbar } from './Toolbar.js';

export type WindowProps = HTMLAttributes<HTMLDivElement> &
  WindowControls & {
    title?: string;
    headless?: boolean;
    contained?: boolean;
  };

export const Window = setup<WindowProps>((props) => {
  const window = getWindow();
  const nodeCtx = nodeRef<HTMLDivElement>(() => ({
    className: props.className || WINDOW_CONFIGS.class,
    'data-minimized': window?.minimized,
    'data-maximized': window?.maximized,
    'data-fullscreen': window?.fullscreen,
  }));
  const trapCtx = focusRef({ trapOverflow: false, autofocus: false, releaseOnEsc: false });
  const dragCtx = dragRef({
    type: 'reset',
    snapTo: ['[role=region]'],
    onEnd: (e) => {
      window?.redraw(e);
    },
  });
  const sizeCtx = resizeRef({
    type: 'reset',
    dir: 'auto',
    snapTo: ['[role=region]'],
    minW: window?.rect.minWidth ?? KIT_CONFIGS.windowMinWidth,
    minH: window?.rect.minHeight ?? KIT_CONFIGS.windowMinHeight,
    onEnd: (e) => {
      window?.redraw(e);
    },
  });

  const assignRef = (element: HTMLDivElement) => {
    dragCtx.target = element;
    sizeCtx.target = element;
    sizeCtx.trigger = element;
    trapCtx.current = element;
    nodeCtx.current = element;

    if (props.contained) dragCtx.container = document.body;
    if (window) window.element = element;
  };

  setContext(WINDOW_CTX_SYMBOL, {
    window,
    dragger: dragCtx,
  });

  return render(
    () => (
      <div role="region" ref={assignRef} {...nodeCtx.attributes} tabIndex={-1}>
        <div className={WINDOW_CONFIGS.resize.t.class}></div>
        <div className={WINDOW_CONFIGS.resize.l.class}></div>
        <div className={WINDOW_CONFIGS.resize.r.class}></div>
        <div className={WINDOW_CONFIGS.resize.b.class}></div>
        <div className={WINDOW_CONFIGS.resize.tl.class}></div>
        <div className={WINDOW_CONFIGS.resize.tr.class}></div>
        <div className={WINDOW_CONFIGS.resize.bl.class}></div>
        <div className={WINDOW_CONFIGS.resize.br.class}></div>
        <div className={WINDOW_CONFIGS.offset.class}>
          {!props.headless && (
            <WindowToolbar close minimize maximize>
              <h2 className={WINDOW_CONFIGS.title.class}>{props.title}</h2>
            </WindowToolbar>
          )}
          {props.children}
        </div>
      </div>
    ),
    'Window'
  );
}, 'Window');
