import { anchor, getContext, type Linkable, mutable, setContext } from '@anchorlib/core';

export const TAB_SYMBOL = Symbol('air-tab');

export type TabOptions = {
  deferred?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

export function getTab<T>() {
  return getContext<Tab<T>>(TAB_SYMBOL);
}

export function setTab<T>(tab: Tab<T>) {
  setContext(TAB_SYMBOL, tab);
}

export function createTabState<T>(options?: TabOptions) {
  const tab = mutable(new Tab<T>(options), { recursive: false });
  setTab(tab);
  return tab;
}

export class Tab<T = string> {
  public current?: T;
  public trigger?: HTMLElement;
  public triggerRect?: DOMRect;
  public orientation: 'vertical' | 'horizontal' = 'horizontal';

  constructor(public options?: TabOptions) {
    this.orientation = options?.orientation ?? 'horizontal';
  }

  public activate(name: T, rect?: DOMRect, trigger?: HTMLElement) {
    anchor.assign(this as Linkable, { current: name, triggerRect: rect, trigger });
  }

  public item(name: T) {
    return mutable(new TabItem(this, name), { recursive: false });
  }
}

class TabItem<T = string> {
  public get active() {
    return this.tab?.current === this.name;
  }

  constructor(
    public tab: Tab<T>,
    public name: T,
    public trigger?: HTMLElement
  ) {}

  public activate() {
    this.tab?.activate(this.name, this.trigger?.getBoundingClientRect(), this.trigger);
  }
}
