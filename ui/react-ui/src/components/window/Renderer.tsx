import type { AnyType, WindowInstance } from '@airlib/uikit';
import { render, setContext, setup } from '@anchorlib/react';
import { teleport, WINDOW_SYMBOL } from '../../lib/index.js';

export type WindowRendererProps = {
  instance: WindowInstance<AnyType, AnyType>;
};

export const WindowRenderer = setup<WindowRendererProps>((props) => {
  setContext(WINDOW_SYMBOL, props.instance);

  return render(() => {
    const { state, render: Render, splash: Splash } = props.instance;

    if (state.status === 'pending' && Splash) {
      return teleport(<Splash state={state} instance={props.instance} />);
    }

    if (!Render) {
      return teleport(<div className="air-window-error">[WINDOW ERROR: No render function]</div>);
    }

    return teleport(<Render state={state} instance={props.instance} />);
  }, 'WindowRenderer');
}, 'WindowRenderer');
