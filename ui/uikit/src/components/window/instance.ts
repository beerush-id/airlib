import { createObserver, onCleanup, type StateUnsubscribe, untrack, uuid } from '@anchorlib/core';
import { KIT_CONFIGS } from '../../config.js';
import type { AnyType } from '../../types.js';
import { impure } from '../../utils/index.js';
import { WebWin, WINDOW_STATUS } from './registry.js';
import type { WebWindowOptions, WindowData, WindowRect, WindowState } from './types.js';
import type { WebWindow } from './window.js';

export class WindowInstance<T extends WindowData, O> {
  private _element?: HTMLElement;

  public id = uuid();
  public rect: WindowRect;
  public state: WindowState<T>;
  public resolving: Set<string> = impure(new Set());
  public activities: Set<string> = impure(new Set());

  public get name() {
    return this.options.name;
  }
  public get icon() {
    return this.options.icon;
  }
  public get title() {
    return this.options.title;
  }
  public get description() {
    return this.options.description;
  }

  public get render() {
    return this.owner.viewRenderer;
  }
  public get splash() {
    return this.owner.splashRenderer;
  }

  public get x() {
    return this.state.x;
  }
  public get y() {
    return this.state.y;
  }
  public get width() {
    return this.state.width;
  }
  public get height() {
    return this.state.height;
  }
  public get zIndex() {
    return this.state.zIndex;
  }

  public get minimized() {
    return this.state.minimized;
  }
  public get maximized() {
    return this.state.maximized;
  }
  public get fullscreen() {
    return this.state.fullscreen;
  }

  public get element() {
    return this._element;
  }
  public set element(value: HTMLElement | undefined) {
    this._element = value;
    this.initRect();
  }

  #cleanupHandlers = new Set<StateUnsubscribe>();
  #controller?: AbortController;

  constructor(
    private owner: WebWindow<T, O>,
    private options: WebWindowOptions<O>,
    init: T
  ) {
    const rect = untrack(() => ({
      ...this.owner.storage.rect,
    }));
    const display = untrack(() => ({
      ...this.owner.storage.display,
    }));

    this.rect = rect;
    this.state = impure<WindowState<T>>({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      data: init,
      zIndex: 0,
      status: WINDOW_STATUS.IDLE,
      minimized: false,
      maximized: display.maximized,
      fullscreen: false,
    });
  }

  public async boot() {
    const state = this.state;
    if (state.status === WINDOW_STATUS.PENDING) return this;

    state.status = WINDOW_STATUS.PENDING;

    if (!this.owner.viewRenderer && this.owner.renderLoader) {
      this.activities.add('Resolving view...');

      try {
        this.owner.render(await this.owner.renderLoader());
      } catch (error) {
        state.error = error as Error;
        state.status = WINDOW_STATUS.ERROR;
        return this;
      } finally {
        this.activities.delete('Resolving view...');
      }
    }

    const controller = new AbortController();
    const guardPromises: Promise<void>[] = [];

    this.activities.add('Authenticating...');
    for (const guard of this.owner.guards) {
      const observer = createObserver(() => {
        resolve();
      });

      const resolve = () => {
        return observer.run(async () => {
          try {
            await guard(state, controller.signal);
          } catch (error) {
            state.error = error as Error;
            state.status = WINDOW_STATUS.ERROR;
          }
        });
      };

      guardPromises.push(resolve());
      this.#cleanupHandlers.add(() => {
        observer.destroy();
      });
    }

    await Promise.all(guardPromises);
    this.activities.delete('Authenticating...');

    if (state.error) {
      controller.abort(state.error);
      return this.cleanup();
    }

    for (const group of this.owner.providers) {
      const groupEntries = Object.entries(group);
      const groupPromises: Promise<AnyType>[] = [];

      const groupNames = groupEntries.map(([name]) => name).join(', ');
      this.activities.add(`Resolving ${groupNames} data...`);

      for (const [name, provider] of groupEntries) {
        const observer = createObserver(() => {
          resolve();
        });

        const resolve = () => {
          return observer.run(async () => {
            this.resolving.add(name);

            try {
              (state.data as AnyType)[name] = await provider(state, controller.signal);
            } catch (error) {
              state.error = error as Error;
              state.status = WINDOW_STATUS.ERROR;
              throw error;
            } finally {
              this.resolving.delete(name);
            }
          });
        };

        groupPromises.push(resolve());
        this.#cleanupHandlers.add(() => {
          observer.destroy();
        });
      }

      try {
        await Promise.all(groupPromises);
      } catch (error) {
        controller.abort(error);
        return this.cleanup();
      } finally {
        this.activities.delete(`Resolving ${groupNames} data...`);
      }
    }

    state.status = WINDOW_STATUS.OPEN;
    this.#controller = controller;
    return this;
  }

  public focus() {
    WebWin.activeWindow = this;
    WebWin.stack.focus(this);
    this.element?.focus();
    return this;
  }

  public close() {
    this.remember();
    return this.owner.close(this);
  }

  public cleanup() {
    for (const cleanup of this.#cleanupHandlers) {
      cleanup();
    }

    this.resolving.clear();
    this.#controller?.abort();
    return this;
  }

  public minimize() {
    untrack(() => {
      this.state.minimized = true;
    });
    return this;
  }

  public maximize() {
    untrack(() => {
      if (this.state.maximized) {
        Object.assign(this.state, {
          maximized: false,
          width: this.rect.width,
          height: this.rect.height,
        });
        this.applyRect();
      } else {
        Object.assign(this.state, {
          maximized: true,
          width: this.rect.maxWidth,
          height: this.rect.maxHeight,
        });
        this.applyRect();
      }
    });
    return this;
  }

  public expand() {
    untrack(() => {
      this.state.fullscreen = true;
    });
    return this;
  }

  public restore() {
    untrack(() => {
      this.state.minimized = false;
    });
    this.focus();
    return this;
  }

  public moveTo(x: number, y: number, width?: number, height?: number) {
    if (this.maximized) return this;

    Object.assign(this.rect, {
      x,
      y,
      ...(width != null ? { width } : {}),
      ...(height != null ? { height } : {}),
    });

    untrack(() => {
      Object.assign(this.state, {
        x: this.rect.x,
        y: this.rect.y,
        ...(width != null ? { width: this.rect.width } : {}),
        ...(height != null ? { height: this.rect.height } : {}),
      });
      this.applyRect();
    });

    return this;
  }

  public redraw(offset?: Partial<WindowRect>) {
    if (this.maximized) return;

    const rect = this.rect;

    if (offset?.x) rect.x = rect.x + offset.x;
    if (offset?.y) rect.y = rect.y + offset.y;
    if (offset?.width) rect.width = rect.width + offset.width;
    if (offset?.height) rect.height = rect.height + offset.height;

    untrack(() => {
      Object.assign(this.state, { ...rect });
      this.applyRect();
    });

    return this;
  }

  private initRect() {
    if (!this.element) return this;

    const freshBoot = untrack(() => this.owner.storage.fresh);

    if (freshBoot) {
      const { x, y, width, height } = this.rect;
      const { innerWidth, innerHeight } = window;
      const center = { x: x || (innerWidth - width) / 2, y: y || (innerHeight - height) / 2 };

      Object.assign(this.rect, { ...center });
    }

    untrack(() => {
      Object.assign(this.state, { ...this.rect });
      this.applyRect();
    });

    const autofocus = () => {
      this.focus();
    };

    this.element.setAttribute('data-online', 'true');
    this.element.addEventListener('mousedown', autofocus);
    onCleanup(() => {
      this.element!.removeEventListener('mousedown', autofocus);
    });
  }

  private applyRect() {
    if (!this.element) return this;

    const { x, y, width, height, minWidth, maxWidth, minHeight, maxHeight } = this.rect;
    const styles = [
      ['x', `${x}px`],
      ['y', `${y}px`],
      ['min-x', `${-x}px`],
      ['min-y', `${-y}px`],
      ['width', `${width}px`],
      ['height', `${height}px`],
      ['min-width', `${minWidth}px`],
      ['max-width', `${maxWidth}px`],
      ['min-height', `${minHeight}px`],
      ['max-height', `${maxHeight}px`],
      ['z-index', `${this.zIndex + (KIT_CONFIGS.windowZIndex ?? 999)}`],
    ];

    for (const [property, value] of styles) {
      if (value.includes('undefined')) continue;
      this.element.style.setProperty(`--window-${property}`, value);
    }

    this.remember();
    this.element.focus();
    return this;
  }

  private remember() {
    untrack(() => {
      if (!this.options.remember) return;

      Object.assign(this.owner.storage, {
        rect: this.rect,
        fresh: false,
        display: { maximized: this.maximized },
      });
    });
  }
}
