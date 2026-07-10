import { untrack } from '@anchorlib/core';
import { KIT_CONFIGS } from '../../config.js';
import type { AnyType } from '../../types.js';
import type { WindowInstance } from './instance.js';

/**
 * Maintains ordered z-index stacking of open desktop window instances.
 * Automatically computes CSS custom property levels during active window focusing.
 */
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

        if (win.element) {
          win.element.style.setProperty(
            '--window-z-index',
            `${index + (KIT_CONFIGS.windowZIndex - this.windows.length)}`
          );
        }
      });
    });
  }
}
