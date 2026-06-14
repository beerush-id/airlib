import { captureStack, isBrowser } from '@anchorlib/core';

import type { AnyType } from '../../types.js';
import { impure } from '../../utils/index.js';
import { WindowInstance } from './instance.js';
import { WebWin, WINDOW_STATUS } from './registry.js';
import type {
  WebWindowOptions,
  WebWindowRenderer,
  WindowData,
  WindowGuard,
  WindowProvider,
  WindowProviderList,
  WindowState,
} from './types.js';

export class WebWindow<T extends WindowData, O> {
  children: Set<WindowInstance<T, O>> = impure(new Set(), { recursive: false });
  childMap = new Map<string, WindowInstance<T, O>>();
  guards = new Set<WindowGuard<T>>();
  providers = new Set<WindowProviderList>();

  public renderLoader?: () => Promise<WebWindowRenderer<T, O>>;
  public viewRenderer?: WebWindowRenderer<T, O>;
  public splashRenderer?: WebWindowRenderer<T, O>;

  public get online() {
    return this.childMap.size > 0;
  }

  constructor(private options: WebWindowOptions<O>) {
    WebWin.windows.set(options.name, this);
  }

  public guard(handler: WindowGuard<T>) {
    this.guards.add(handler);
    return this;
  }

  public provide<P extends Record<string, (state: WindowState<T>, signal: AbortSignal) => AnyType>>(
    providers: P
  ): WebWindow<T & { [K in keyof P]: Awaited<ReturnType<P[K]>> }, O>;
  public provide<N extends string, R>(name: N, handler: WindowProvider<T, R>): WebWindow<T & { [K in N]: R }, O>;
  public provide<R>(
    nameOrProviders: string | Record<string, WindowProvider<T, R>>,
    handler?: WindowProvider<T, R>
  ): WebWindow<AnyType, AnyType> {
    if (typeof nameOrProviders === 'object') {
      this.providers.add(nameOrProviders as AnyType);
    } else {
      this.providers.add({ [nameOrProviders]: handler } as AnyType);
    }

    return this;
  }

  public render(renderer: WebWindowRenderer<T, O>) {
    this.viewRenderer = renderer;
    return this;
  }

  public splash(renderer: WebWindowRenderer<T, O>) {
    this.splashRenderer = renderer;
    return this;
  }

  public async open(init?: T) {
    if (!isBrowser()) {
      const error = new Error(`Window violation detected.`);
      captureStack.violation.general(
        'Window violation detected.',
        'Attempted to open a window on non browser environment.',
        error,
        ['Windows are designed for browser environments only.'],
        this.open
      );
      return new WindowInstance(this, this.options, {} as T);
    }

    if (!this.options.multiple && this.children.size) {
      const instance = [...this.children][0];
      instance.focus();
      return instance;
    }

    const instance = new WindowInstance<T, O>(this, this.options, init ?? ({} as T));
    this.children.add(instance);
    this.childMap.set(instance.id, instance);
    WebWin.stack.add(instance);

    await instance.focus().boot();

    return instance;
  }

  public restore() {
    if (!this.online) {
      return this.open();
    }

    let lastInstance: WindowInstance<T, O>;
    for (const instance of this.children) {
      lastInstance = instance.restore();
    }
    return lastInstance!;
  }

  public close(instance: string | WindowInstance<T, O>) {
    if (typeof instance === 'string') instance = this.childMap.get(instance)!;
    if (!this.children.has(instance)) return;

    instance.cleanup();
    instance.state.status = WINDOW_STATUS.CLOSED;

    this.children.delete(instance);
    this.childMap.delete(instance.id);

    WebWin.stack.rem(instance);

    const nextFocus = WebWin.stack.windows.at(-1);
    if (nextFocus) {
      nextFocus.focus();
    } else {
      WebWin.activeWindow = undefined;
    }
  }
}
