import { isBrowser, onCleanup } from '@anchorlib/core';
import { KIT_CONFIGS, type SnapToBound } from '../config.js';
import { MOUSE_BUTTONS, type MouseModifier } from './mouse.js';
import type {
  EdgeSnaps,
  InteractionEvent,
  InteractionRef,
  InteractionRefInit,
  InteractionState,
  InteractionType,
} from './rect.js';
import {
  attachFinish,
  bindTrigger,
  captureStart,
  collectEdgeSnaps,
  detachFinish,
  freezeTransition,
  interactionState,
  minMax,
  resetInteraction,
  restoreTransition,
  snapGrid,
  unbindTrigger,
} from './rect.js';

export type ResizeSize = {
  width: number;
  height: number;
};
export type ResizeState = InteractionState;
export type ResizeRef<T extends HTMLElement> = InteractionRef<T>;

export type ResizeDir = 'e' | 'w' | 's' | 'n' | 'all' | 'auto';
export type ResizeType = InteractionType;
export type ResizeEvent<T extends HTMLElement> = InteractionEvent<T>;

export type ResizeOptions = {
  dir?: ResizeDir | ResizeDir[];
  resizeThreshold?: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  snap?: number;
  snapW?: number;
  snapH?: number;
  wModifier?: MouseModifier;
  hModifier?: MouseModifier;
  snapTo?: string[];
  snapToBound?: SnapToBound;
  edgeSnaps?: EdgeSnaps;
};

export type ResizeInit = Partial<ResizeSize & ResizeOptions>;
export type ResizeRefInit<T extends HTMLElement> = InteractionRefInit<T, ResizeOptions, ResizeEvent<T>>;

export function resizeState(init: ResizeInit = {}, onChange?: (state: ResizeState) => void): ResizeState {
  return interactionState(
    init,
    (state, cx, cy, rawState) => {
      const { dir, minW, minH, maxW, maxH, snapW, snapH } = init;
      if (!dir?.length) return;

      const { cursorX, cursorY, startWidth, startHeight, offsetX, offsetY, offsetWidth, offsetHeight } =
        rawState.start!;
      const deltaX = cx - cursorX;
      const deltaY = cy - cursorY;

      let currentW = startWidth + (rawState.width - offsetWidth);
      let currentH = startHeight + (rawState.height - offsetHeight);

      if (dir.includes('e')) {
        const newW = minMax(minW, maxW, snapGrid(startWidth + deltaX, snapW));
        state.width = offsetWidth + (newW - startWidth);
        currentW = newW;
      } else if (dir.includes('w')) {
        const newW = minMax(minW, maxW, snapGrid(startWidth - deltaX, snapW));
        state.width = offsetWidth + (newW - startWidth);
        state.x = offsetX + (startWidth - newW);
        currentW = newW;
      }

      if (dir.includes('s')) {
        const newH = minMax(minH, maxH, snapGrid(startHeight + deltaY, snapH));
        state.height = offsetHeight + (newH - startHeight);
        currentH = newH;
      } else if (dir.includes('n')) {
        const newH = minMax(minH, maxH, snapGrid(startHeight - deltaY, snapH));
        state.height = offsetHeight + (newH - startHeight);
        state.y = offsetY + (startHeight - newH);
        currentH = newH;
      }

      // Snap dragged edges to nearby element edges
      const edges = init.edgeSnaps;
      if (edges) {
        const { anchorLeft, anchorTop, anchorRight, anchorBottom } = rawState.start!;
        const threshold = KIT_CONFIGS.snapThreshold ?? 10;

        if (dir.includes('e')) {
          const edge = anchorLeft + currentW;
          for (const sx of edges.x) {
            if (Math.abs(edge - sx) < threshold) {
              const newW = minMax(minW, maxW, sx - anchorLeft);
              state.width = offsetWidth + (newW - startWidth);
              break;
            }
          }
        } else if (dir.includes('w')) {
          const edge = anchorRight - currentW;
          for (const sx of edges.x) {
            if (Math.abs(edge - sx) < threshold) {
              const newW = minMax(minW, maxW, anchorRight - sx);
              state.width = offsetWidth + (newW - startWidth);
              state.x = offsetX + (startWidth - newW);
              break;
            }
          }
        }

        if (dir.includes('s')) {
          const edge = anchorTop + currentH;
          for (const sy of edges.y) {
            if (Math.abs(edge - sy) < threshold) {
              const newH = minMax(minH, maxH, sy - anchorTop);
              state.height = offsetHeight + (newH - startHeight);
              break;
            }
          }
        } else if (dir.includes('n')) {
          const edge = anchorBottom - currentH;
          for (const sy of edges.y) {
            if (Math.abs(edge - sy) < threshold) {
              const newH = minMax(minH, maxH, anchorBottom - sy);
              state.height = offsetHeight + (newH - startHeight);
              state.y = offsetY + (startHeight - newH);
              break;
            }
          }
        }
      }
    },
    onChange
  );
}

export function resizeRef<T extends HTMLElement>(init: ResizeRefInit<T> = {}): ResizeRef<T> {
  const options = { ...init };

  const state = resizeState(options, ({ width, height, x, y }) => {
    if (!target) return;
    if (state.start) {
      const w = state.start.startWidth + (width - state.start.offsetWidth);
      const h = state.start.startHeight + (height - state.start.offsetHeight);
      target!.style.width = `${w}px`;
      target!.style.height = `${h}px`;
    }
    if (x || y) {
      target!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    init.onMove?.({ width, height, x, y, target });
  });

  let target = init.target;
  let trigger = init.trigger;
  let savedTransition = '';

  const start = (e: MouseEvent | TouchEvent) => {
    if (state.start) finish();

    if (init.snap != null) {
      options.snapW = init.snapW ?? init.snap;
      options.snapH = init.snapH ?? init.snap;
    }

    const isAuto = init.dir === 'auto';
    const autoDirs: ResizeDir[] = [];

    if (isAuto && target) {
      const rect = target.getBoundingClientRect();
      const inner = 1;
      const outer = init.resizeThreshold ?? KIT_CONFIGS.resizeThreshold ?? 10;
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      if (clientX >= rect.right - inner && clientX <= rect.right + outer) autoDirs.push('e');
      if (clientX <= rect.left + inner && clientX >= rect.left - outer) autoDirs.push('w');
      if (clientY >= rect.bottom - inner && clientY <= rect.bottom + outer) autoDirs.push('s');
      if (clientY <= rect.top + inner && clientY >= rect.top - outer) autoDirs.push('n');

      if (!autoDirs.length) return;
    }

    options.dir = autoDirs.length
      ? autoDirs
      : init.dir === 'all'
        ? ['e', 'w', 's', 'n']
        : typeof init.dir === 'string'
          ? [init.dir]
          : init.dir;

    const start = captureStart(e, state, init?.button ?? MOUSE_BUTTONS.left, target);
    if (!start) return;

    state.start = start;

    if (init.snapTo?.length) {
      options.edgeSnaps = collectEdgeSnaps(target, init.snapTo, init.snapToBound ?? KIT_CONFIGS.snapBound);
    }

    init.onStart?.({ width: state.width, height: state.height, x: state.x, y: state.y, target });

    if (target) {
      savedTransition = freezeTransition(target);
    }

    attachFinish(finish);
  };

  const finish = () => {
    const endSize = { width: state.width, height: state.height, x: state.x, y: state.y };
    state.start = undefined;

    detachFinish(finish);

    if (target) {
      if (init.type === 'reset') {
        resetInteraction(state, target, ['transform', 'width', 'height']);
      }

      restoreTransition(target, savedTransition, 'resize-out');
    }

    options.edgeSnaps = undefined;
    init.onEnd?.({ ...endSize, target });
  };

  if (trigger) {
    bindTrigger(trigger, start);
  }

  onCleanup(() => {
    if (!isBrowser()) return;

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
    get width() {
      return state.width;
    },
    get height() {
      return state.height;
    },
    get active() {
      return state.start != null;
    },
    get target() {
      return target;
    },
    set target(value: T | undefined) {
      target = value;
    },
    get trigger() {
      return trigger;
    },
    set trigger(value: HTMLElement | undefined) {
      if (trigger) unbindTrigger(trigger, start);
      trigger = value;
      if (trigger) bindTrigger(trigger, start);
    },
  };
}
