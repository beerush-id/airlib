import { untrack } from '@anchorlib/core';
import type { AnyType } from '../../types.js';

import type { WindowInstance } from './instance.js';

export class WindowStacks {
  public windows: WindowInstance<AnyType, AnyType>[] = [];

  public add(instance: WindowInstance<AnyType, AnyType>) {
    untrack(() => {
      if (this.windows.indexOf(instance) > -1) return;
      this.windows.push(instance);
    });
    return this;
  }

  public rem(instance: WindowInstance<AnyType, AnyType>) {
    untrack(() => {
      const index = this.windows.indexOf(instance);
      if (index > -1) this.windows.splice(index, 1);
    });

    return this;
  }

  public focus(instance: WindowInstance<AnyType, AnyType>) {
    return untrack(() => {
      this.rem(instance);
      this.add(instance);
      this.windows.forEach((win, index) => {
        win.state.zIndex = index;
        if (win.element) win.element.style.setProperty('--window-z-index', `${index + 50}`);
      });
    });
  }
}
