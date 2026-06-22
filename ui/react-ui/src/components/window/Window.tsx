import { type AnyType, KIT_CONFIGS } from '@airlib/uikit';
import type { WindowInstance } from '@airlib/uikit/components';
import { type DragRef, dragRef, focusRef, resizeRef } from '@airlib/uikit/utils';
import { nodeRef, render, setContext, setup } from '@anchorlib/react';
import type { HTMLAttributes, ReactNode } from 'react';
import { getWindow, WINDOW_CTX_SYMBOL } from '../../lib/index.js';
import { WindowToolbar } from './Toolbar.js';

export type WindowProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  headless?: boolean;
  contained?: boolean;
};

export type WindowContext = {
  window: WindowInstance<AnyType, ReactNode>;
  dragger: DragRef<HTMLDivElement>;
};

export const Window = setup<WindowProps>((props) => {
  const win = getWindow();
  const nodeCtx = nodeRef<HTMLDivElement>(() => ({
    className: props.className ?? 'air-window',
    'data-minimized': win?.minimized,
    'data-maximized': win?.maximized,
    'data-fullscreen': win?.fullscreen,
  }));
  const trapCtx = focusRef({ trapOverflow: false, autofocus: false, releaseOnEsc: false });
  const dragCtx = dragRef({
    type: 'reset',
    snapTo: ['[role=region]'],
    onEnd: (e) => {
      win?.redraw(e);
    },
  });
  const sizeCtx = resizeRef({
    type: 'reset',
    dir: 'auto',
    snapTo: ['[role=region]'],
    minW: win?.rect.minWidth ?? KIT_CONFIGS.windowMinWidth,
    minH: win?.rect.minHeight ?? KIT_CONFIGS.windowMinHeight,
    onEnd: (e) => {
      console.log(e);
      win?.redraw(e);
    },
  });

  const assignRef = (element: HTMLDivElement) => {
    dragCtx.target = element;
    sizeCtx.target = element;
    sizeCtx.trigger = element;
    trapCtx.current = element;
    nodeCtx.current = element;

    if (props.contained) dragCtx.container = document.body;
    if (win) win.element = element;
  };

  setContext(WINDOW_CTX_SYMBOL, {
    window: win,
    dragger: dragCtx,
  });

  return render(
    () => (
      <div role="region" ref={assignRef} {...nodeCtx.attributes} tabIndex={-1}>
        <div className="air-resize-t"></div>
        <div className="air-resize-l"></div>
        <div className="air-resize-r"></div>
        <div className="air-resize-b"></div>
        <div className="air-resize-tl"></div>
        <div className="air-resize-tr"></div>
        <div className="air-resize-bl"></div>
        <div className="air-resize-br"></div>
        <div className="air-window-offset">
          {!props.headless && (
            <WindowToolbar close minimize maximize>
              <h2 className="air-window-title">{props.title}</h2>
            </WindowToolbar>
          )}
          {props.children}
        </div>
      </div>
    ),
    'Window'
  );
}, 'Window');
