import type { AnyType } from '../../types.js';
import type { WindowInstance } from './instance.js';
import type { WindowLauncher } from './launcher.js';
import type { WINDOW_STATUS } from './registry.js';
import type { WindowStacks } from './stack.js';
import type { WebWindow } from './window.js';

export type WindowData = {
  [key: string]: AnyType;
};

export type WindowStatus = (typeof WINDOW_STATUS)[keyof typeof WINDOW_STATUS];

export type WindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
};

export type WindowDisplay = {
  maximized: boolean;
};

export type WindowState<T extends WindowData> = WindowDisplay & {
  data: T;
  error?: Error;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  status: WindowStatus;
  minimized: boolean;
  fullscreen: boolean;
};

export type WebWindowOptions<O> = {
  name: string;
  icon?: string | (() => O);
  rect?: Partial<WindowRect>;
  remember?: boolean | 'default';
  multiple?: boolean;
  maximized?: boolean;

  title?: string;
  description?: string;
};

export type WindowStorage = {
  rect: WindowRect;
  fresh: boolean;
  display: WindowDisplay;
};

export type WindowRegistry = {
  stack: WindowStacks;
  windows: Map<string, WebWindow<AnyType, AnyType>>;
  launcher: WindowLauncher;
  activeWindow?: WindowInstance<AnyType, AnyType>;
};

export type WindowGuard<T extends WindowData> = (state: WindowState<T>, signal: AbortSignal) => Promise<void> | void;
export type WindowProvider<T extends WindowData, R> = (state: WindowState<T>, signal: AbortSignal) => Promise<R> | R;
export type WindowProviderList = {
  [name: string]: WindowProvider<AnyType, AnyType>;
};

export type WindowRendererProps<T extends WindowData, O> = {
  state: WindowState<T>;
  instance: WindowInstance<T, O>;
};
export type WebWindowRenderer<T extends WindowData, O> = (props: WindowRendererProps<T, O>) => O;
