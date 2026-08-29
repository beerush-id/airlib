import { anchor, isBrowser, onCleanup } from '@airlib/core';
import { KIT_CONFIGS } from '../config.js';
import type { SnapToBound } from '../types.js';
import type {
  InteractionEvent,
  InteractionRef,
  InteractionRefInit,
  InteractionState,
  InteractionType,
  MouseModifier,
  SnapPoint,
} from '../utils/index.js';
import {
  attachFinish,
  bindTrigger,
  captureStart,
  collectSnapPoints,
  detachFinish,
  freezeTransition,
  getKeyboard,
  interactionState,
  INTERACTIVE,
  minMax,
  MOUSE_BUTTONS,
  resetInteraction,
  restoreTransition,
  snapGrid,
  unbindTrigger,
} from '../utils/index.js';

export type DragPos = {
  x: number;
  y: number;
};
export type DragState = InteractionState;
export type DragRef<T extends HTMLElement> = Omit<InteractionRef<T>, 'width' | 'height'> & {
  container?: HTMLElement;
};

export type DragType = InteractionType;
export type DragEvent<T extends HTMLElement> = Omit<InteractionEvent<T>, 'width' | 'height'> & {
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
  snap?: number;
  snapX?: number;
  snapY?: number;
  stepX?: number;
  stepY?: number;
  xModifier?: MouseModifier;
  yModifier?: MouseModifier;
  snapTo?: string[];
  snapToBound?: SnapToBound;
  snapPoints?: SnapPoint[];
};

export type DragInit = Partial<DragPos & DragOptions>;
export type DragRefInit<T extends HTMLElement> = InteractionRefInit<T, DragOptions, DragEvent<T>> & {
  container?: HTMLElement;
};

/**
 * Creates a standalone reactive 2D drag coordinate state container.
 * Computes snapped and bounded coordinates during pointer dragging.
 *
 * @param init - Initial coordinate limits, grid snapping, and modifier constraints.
 * @param onChange - Optional callback triggered whenever coordinates change.
 * @returns A reactive DragState instance.
 */
export function dragState(init: DragInit = {}, onChange?: (state: DragState) => void): DragState {
  const keyboard = anchor.get(getKeyboard(), true);

  return interactionState(
    init,
    (state, cx, cy, rawState) => {
      const { dir, minX, minY, maxX, maxY, snapX, snapY, xModifier, yModifier } = init;
      const { cursorX, cursorY, offsetX, offsetY } = rawState.start!;
      const deltaX = cx - cursorX;
      const deltaY = cy - cursorY;

      let activeDir = dir;
      if (xModifier && keyboard.has(xModifier)) activeDir = 'x';
      else if (yModifier && keyboard.has(yModifier)) activeDir = 'y';

      if (activeDir === 'x') {
        state.x = minMax(minX, maxX, snapGrid(offsetX + deltaX, snapX));
      } else if (activeDir === 'y') {
        state.y = minMax(minY, maxY, snapGrid(offsetY + deltaY, snapY));
      } else {
        state.x = minMax(minX, maxX, snapGrid(offsetX + deltaX, snapX));
        state.y = minMax(minY, maxY, snapGrid(offsetY + deltaY, snapY));
      }

      const pts = init.snapPoints;
      if (pts?.length) {
        const proxX = snapX ?? KIT_CONFIGS.snapThreshold;
        const proxY = snapY ?? KIT_CONFIGS.snapThreshold;
        const desiredX = offsetX + deltaX;
        const desiredY = offsetY + deltaY;
        for (const pt of pts) {
          if (Math.abs(desiredX - pt.x) < proxX) state.x = pt.x;
          if (Math.abs(desiredY - pt.y) < proxY) state.y = pt.y;
        }
      }
    },
    onChange
  );
}

/**
 * Creates a drag interaction controller bound to a DOM element.
 * Automatically projects computed transforms and tracks container boundary limits.
 *
 * @param init - Drag controller options including target element, trigger element, and container boundaries.
 * @returns A reactive DragRef controller instance.
 */
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
    if (state.start) finish();
    if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;

    const start = captureStart(e, state, init?.button ?? MOUSE_BUTTONS.left);
    if (!start) return;

    state.start = start;

    if (init.snap != null) {
      options.snapX = init.snapX ?? init.snap;
      options.snapY = init.snapY ?? init.snap;
    }

    if (init.snapTo?.length) {
      options.snapPoints = collectSnapPoints(target, init.snapTo, init.snapToBound ?? KIT_CONFIGS.snapBound);
    }

    init.onStart?.({ x: state.x, y: state.y, target, container });

    if (target) {
      savedTransition = freezeTransition(target);
    }

    attachFinish(finish);
  };
  const finish = () => {
    const endPos = { x: state.x, y: state.y };
    const startPos = { x: state.start!.offsetX, y: state.start!.offsetY };

    state.start = undefined;

    detachFinish(finish);

    if (target) {
      if (init.type === 'reset') {
        resetInteraction(state, target, ['transform']);
      }

      restoreTransition(target, savedTransition, 'drag-out');
    }

    options.snapPoints = [];

    if (endPos.x === startPos.x && endPos.y === startPos.y) return;
    init.onEnd?.({ ...endPos, target, container });
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

    const { minX, minY, maxX, maxY, gapX = 0, gapY = 0, stepX, stepY, snap } = init;
    const tRect = target.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    if (minX === undefined) options.minX = -(tRect.left - cRect.left) + gapX;
    if (minY === undefined) options.minY = -(tRect.top - cRect.top) + gapY;
    if (maxX === undefined) options.maxX = cRect.right - tRect.right - gapX;
    if (maxY === undefined) options.maxY = cRect.bottom - tRect.bottom - gapY;

    if (stepX) {
      const range = (options.maxX ?? maxX ?? 0) - (options.minX ?? minX ?? 0);
      options.snapX = (range * stepX) / 100;
    } else if (snap != null && init.snapX === undefined) {
      options.snapX = snap;
    }
    if (stepY) {
      const range = (options.maxY ?? maxY ?? 0) - (options.minY ?? minY ?? 0);
      options.snapY = (range * stepY) / 100;
    } else if (snap != null && init.snapY === undefined) {
      options.snapY = snap;
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
    bindTrigger(trigger, start);
  }

  onCleanup(() => {
    if (!isBrowser()) return;

    resizeObserver?.disconnect();
    detachFinish(finish);
    if (trigger) unbindTrigger(trigger, start);
  });

  return {
    get x() {
      return state.x;
    },
    get y() {
      return state.y;
    },
    get active() {
      return state.start != null;
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
      if (trigger) unbindTrigger(trigger, start);
      trigger = value;
      if (trigger) bindTrigger(trigger, start);
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
