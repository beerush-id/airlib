import { type AnyType, WebWin, type WebWindow, type WindowInstance } from '@airlib/headless';
import { isBrowser, subscribe } from '@airlib/core';
import { render, setContext, setup } from '@airlib/react';
import { createRoot } from 'react-dom/client';
import { WINDOW_SYMBOL } from '../../lib/index.js';
import { WINDOW_CONFIGS } from './config.js';

const HOST_REG = new WeakSet();
const ROOT_REG = new WeakMap();

if (isBrowser()) {
  subscribe(WebWin.windows, (s) => {
    for (const win of s.values()) {
      if (!HOST_REG.has(win)) {
        bootstrap(win);
        HOST_REG.add(win);
      }
    }
  });
}

const bootstrap = (win: WebWindow<AnyType, AnyType>) => {
  subscribe(win.instances, (_s, event) => {
    if (event.type === 'set:add') {
      const host = document.createElement('air-window');
      const root = createRoot(host);
      const child = event.value as WindowInstance<AnyType, AnyType>;

      host.style.display = 'contents';
      host.classList.add('air-window-host');
      host.setAttribute('data-window-id', child.id);
      host.setAttribute('data-window-name', child.name);

      document.body.appendChild(host);
      root.render(<WindowRenderer instance={child} />);

      ROOT_REG.set(child, () => {
        root.unmount();
        host.remove();
      });
    } else if (event.type === 'set:delete') {
      const child = event.prev as WindowInstance<AnyType, AnyType>;
      ROOT_REG.get(child)?.();
    }
  });
};

export type WindowRendererProps = {
  instance: WindowInstance<AnyType, AnyType>;
};

export const WindowRenderer = setup<WindowRendererProps>((props) => {
  setContext(WINDOW_SYMBOL, props.instance);

  return render(() => {
    const { state, render: Render, splash: Splash } = props.instance;

    if (state.status === 'pending' && Splash) {
      return <Splash state={state} instance={props.instance} />;
    }

    if (!Render) {
      return <div className={WINDOW_CONFIGS.error.class}>[WINDOW ERROR: No render function]</div>;
    }

    return <Render state={state} instance={props.instance} />;
  }, 'WindowRenderer');
}, 'WindowRenderer');
