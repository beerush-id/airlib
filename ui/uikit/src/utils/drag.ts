import { anchor, effect, mutable, onCleanup } from '@anchorlib/core';
import { getKeyboard } from './keyboard.js';
import { getPointer, MOUSE_BUTTONS, type MouseModifier } from './mouse.js';

export type DragPos = {
  x: number;
  y: number;
};
export type DragState = DragPos & {
  start:
    | {
        cursorX: number;
        cursorY: number;
        offsetX: number;
        offsetY: number;
      }
    | false;
};
export type DragRef<T extends HTMLElement> = DragPos & {
  active: boolean;
  target?: T;
  trigger?: HTMLElement;
  container?: HTMLElement;
};

export type DragType = 'stay' | 'reset';
export type DragEvent<T extends HTMLElement> = DragPos & {
  target?: T;
  container?: HTMLElement;
};

export type DragOptions = {
  dir?: 'x' | 'y';
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
  gapX?: number;
  gapY?: number;
  snapX?: number;
  snapY?: number;
  stepX?: number;
  stepY?: number;
  xModifier?: MouseModifier;
  yModifier?: MouseModifier;
};

export type DragInit = Partial<DragPos & DragOptions>;
export type DragRefInit<T extends HTMLElement> = Partial<Omit<DragRef<T>, 'active'> & DragOptions> & {
  type?: DragType;
  button?: (typeof MOUSE_BUTTONS)[keyof typeof MOUSE_BUTTONS];
  onStart?: (e: DragEvent<T>) => void;
  onMove?: (e: DragEvent<T>) => void;
  onEnd?: (e: DragEvent<T>) => void;
};

export function dragState(init: DragInit = {}, onChange?: (state: DragState) => void): DragState {
  const { x = 0, y = 0 } = init;

  const state = mutable<DragState>({ x, y, start: false }, { recursive: false });
  const pointer = getPointer();
  const keyboard = anchor.get(getKeyboard());

  const calculate = (cx = 0, cy = 0) => {
    if (typeof state.start !== 'object') return;

    const { dir, minX, minY, maxX, maxY, snapX, snapY, xModifier, yModifier } = init;
    const { cursorX, cursorY, offsetX, offsetY } = state.start;
    const deltaX = cx - cursorX;
    const deltaY = cy - cursorY;

    let activeDir = dir;
    if (xModifier && keyboard.has(xModifier)) activeDir = 'x';
    else if (yModifier && keyboard.has(yModifier)) activeDir = 'y';

    if (activeDir === 'x') {
      state.x = minMax(minX, maxX, snap(offsetX + deltaX, snapX));
    } else if (activeDir === 'y') {
      state.y = minMax(minY, maxY, snap(offsetY + deltaY, snapY));
    } else {
      state.x = minMax(minX, maxX, snap(offsetX + deltaX, snapX));
      state.y = minMax(minY, maxY, snap(offsetY + deltaY, snapY));
    }

    onChange?.(anchor.get(state));
  };

  let rafId = 0;
  effect(() => {
    if (typeof state.start === 'object' && state.start !== null) {
      const { x: cx, y: cy } = pointer;
      rafId = requestAnimationFrame(() => {
        calculate(cx, cy);
      });
    }

    return () => cancelAnimationFrame(rafId);
  });

  return state;
}

export function dragRef<T extends HTMLElement>(init: DragRefInit<T> = {}): DragRef<T> {
  const options = { ...init };
  const state = dragState(options, ({ x, y }) => {
    if (!target) return;
    target!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    init.onMove?.({ x, y, target, container });
  });

  let target = init.target;
  let trigger = init.trigger;
  let container = init.container;
  let resizeObserver: ResizeObserver | undefined;
  let savedTransition = '';

  const start = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent) {
      if (e.button !== (init?.button ?? MOUSE_BUTTONS.left)) return;
      state.start = { cursorX: e.clientX, cursorY: e.clientY, offsetX: state.x, offsetY: state.y };
    } else {
      const touch = e.touches[0];
      state.start = { cursorX: touch.clientX, cursorY: touch.clientY, offsetX: state.x, offsetY: state.y };
    }

    init.onStart?.({ x: state.x, y: state.y, target, container });

    if (target) {
      savedTransition = target.style.transition;
      target.style.transition = 'none';
    }
    document.addEventListener('mouseup', finish);
    document.addEventListener('touchend', finish, { once: true });
    window.addEventListener('blur', finish);
  };
  const finish = () => {
    const endPos = { x: state.x, y: state.y };
    state.start = false;

    init.onEnd?.({ ...endPos, target, container });

    document.removeEventListener('mouseup', finish);
    document.removeEventListener('touchend', finish);
    window.removeEventListener('blur', finish);

    if (target) {
      target.style.transition = savedTransition;

      if (init.type === 'reset') {
        state.x = 0;
        state.y = 0;
        target.style.transform = `translate3d(0px, 0px, 0)`;
      }
    }
  };
  const clearLimits = () => {
    if (init.minX === undefined) options.minX = undefined;
    if (init.minY === undefined) options.minY = undefined;
    if (init.maxX === undefined) options.maxX = undefined;
    if (init.maxY === undefined) options.maxY = undefined;
  };
  const assignLimits = () => {
    if (!target || !container) {
      clearLimits();
      return;
    }

    const { minX, minY, maxX, maxY, gapX = 0, gapY = 0, stepX, stepY } = init;
    const tRect = target.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    // Only override limits not explicitly provided via init
    if (minX === undefined) options.minX = -(tRect.left - cRect.left) + gapX;
    if (minY === undefined) options.minY = -(tRect.top - cRect.top) + gapY;
    if (maxX === undefined) options.maxX = cRect.right - tRect.right - gapX;
    if (maxY === undefined) options.maxY = cRect.bottom - tRect.bottom - gapY;

    // Compute snap from step percentage relative to computed range
    if (stepX) {
      const range = (options.maxX ?? maxX ?? 0) - (options.minX ?? minX ?? 0);
      options.snapX = (range * stepX) / 100;
    }
    if (stepY) {
      const range = (options.maxY ?? maxY ?? 0) - (options.minY ?? minY ?? 0);
      options.snapY = (range * stepY) / 100;
    }
  };

  const setupContainer = () => {
    resizeObserver?.disconnect();
    if (container) {
      resizeObserver = new ResizeObserver(assignLimits);
      resizeObserver.observe(container);
    }
    assignLimits();
  };

  setupContainer();
  if (trigger) {
    trigger.addEventListener('mousedown', start);
    trigger.addEventListener('touchstart', start, { passive: true });
  }

  onCleanup(() => {
    resizeObserver?.disconnect();
    document.removeEventListener('mouseup', finish);
    document.removeEventListener('touchend', finish);
    window.removeEventListener('blur', finish);
    trigger?.removeEventListener('mousedown', start);
    trigger?.removeEventListener('touchstart', start);
  });

  return {
    get x() {
      return state.x;
    },
    get y() {
      return state.y;
    },
    get active() {
      return state.start !== false;
    },
    get target() {
      return target;
    },
    set target(value: T | undefined) {
      target = value;
      assignLimits();
    },
    get trigger() {
      return trigger;
    },
    set trigger(value: HTMLElement | undefined) {
      trigger?.removeEventListener('mousedown', start);
      trigger?.removeEventListener('touchstart', start);
      trigger = value;
      trigger?.addEventListener('mousedown', start);
      trigger?.addEventListener('touchstart', start, { passive: true });
    },
    get container() {
      return container;
    },
    set container(value: HTMLElement | undefined) {
      container = value;
      setupContainer();
    },
  };
}

function minMax(min: number | undefined, max: number | undefined, value: number) {
  if (typeof min === 'number') {
    value = Math.max(min, value);
  }

  if (typeof max === 'number') {
    value = Math.min(max, value);
  }

  return value;
}

function snap(value: number, step: number | undefined) {
  if (typeof step !== 'number' || step <= 0) return value;
  return Math.round(value / step) * step;
}
