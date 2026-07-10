import {
  type AnyType,
  WebWindow,
  type WebWindowOptions,
  type WebWindowRenderer,
  type WindowData,
  type WindowInstance,
} from '@airlib/headless';
import type { DragRef } from '@airlib/headless/components';
import { getContext, setup } from '@anchorlib/react';
import type { ReactNode } from 'react';
import { WindowSplash } from '../components/index.js';

export const WINDOW_SYMBOL = Symbol('web-window');
export const WINDOW_CTX_SYMBOL = Symbol('window-context');

export function webWindow<T extends WindowData>(options: WebWindowOptions<ReactNode>) {
  return new ReactWindow<T>(options);
}

export function getWindow() {
  return getContext<WindowInstance<AnyType, ReactNode>>(WINDOW_SYMBOL);
}

export type WindowContext = {
  window: WindowInstance<AnyType, ReactNode>;
  dragger: DragRef<HTMLDivElement>;
};

export function getWindowCtx() {
  return getContext<WindowContext>(WINDOW_CTX_SYMBOL);
}

export class ReactWindow<T extends WindowData> extends WebWindow<T, ReactNode> {
  public constructor(options: WebWindowOptions<ReactNode>) {
    super(options);
    this.splash(WindowSplash);
  }

  public get current(): WindowInstance<T, ReactNode> {
    return getWindow() as WindowInstance<T, ReactNode>;
  }

  public render(renderer: WebWindowRenderer<T, ReactNode>) {
    return super.render(setup(renderer, 'WebWindow') as WebWindowRenderer<T, ReactNode>);
  }

  public splash(renderer: WebWindowRenderer<T, ReactNode>) {
    return super.splash(setup(renderer, 'WebSplash') as WebWindowRenderer<T, ReactNode>);
  }

  public renderAsync(loader: () => Promise<{ default: WebWindowRenderer<T, ReactNode> }>) {
    this.renderLoader = async () => {
      return (await loader()).default;
    };
    return this;
  }
}
