import { anchor, effect, microtask } from '@anchorlib/core';
import { KIT_CONFIGS, SNAP_BOUND, type SnapToBound } from '../config.js';
import type { AnyType } from '../types.js';
import { getPointer, MOUSE_BUTTONS, type MouseButton } from './mouse.js';
import { impure } from './state.js';

export type InteractionType = 'stay' | 'reset';

export const INTERACTIVE = 'a, button, input, textarea, select, label, [contenteditable]';

export const [later] = microtask(5);

export function minMax(min: number | undefined, max: number | undefined, value: number) {
  if (typeof min === 'number') {
    value = Math.max(min, value);
  }

  if (typeof max === 'number') {
    value = Math.min(max, value);
  }

  return value;
}

export function snapGrid(value: number, step: number | undefined) {
  if (typeof step !== 'number' || step <= 0) return value;
  return Math.round(value / step) * step;
}

export function trackPointer(state: { start?: unknown }, calculate: (cx: number, cy: number) => void) {
  const pointer = getPointer();

  let rafId = 0;
  effect.client(() => {
    if (state.start != null) {
      const { x: cx, y: cy } = pointer;
      rafId = requestAnimationFrame(() => {
        calculate(cx, cy);
      });
    }

    return () => cancelAnimationFrame(rafId);
  });
}

export type InteractionStart = {
  cursorX: number;
  cursorY: number;
  offsetX: number;
  offsetY: number;
  offsetWidth: number;
  offsetHeight: number;
  startWidth: number;
  startHeight: number;
  anchorLeft: number;
  anchorTop: number;
  anchorRight: number;
  anchorBottom: number;
};

export type InteractionState = {
  x: number;
  y: number;
  width: number;
  height: number;
  start?: InteractionStart;
};

export type InteractionRef<T extends HTMLElement> = {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  target?: T;
  trigger?: HTMLElement;
};

export type InteractionEvent<T extends HTMLElement> = {
  x: number;
  y: number;
  width: number;
  height: number;
  target?: T;
};

export type InteractionRefInit<T extends HTMLElement, Options = {}, Event = InteractionEvent<T>> = Partial<
  Omit<InteractionRef<T>, 'active'> & Options
> & {
  type?: InteractionType;
  button?: MouseButton;
  onStart?: (e: Event) => void | true;
  onMove?: (e: Event) => void | true;
  onEnd?: (e: Event) => void | true;
};

export function interactionState(
  init: { x?: number; y?: number; width?: number; height?: number },
  calculate: (state: InteractionState, cx: number, cy: number, rawState: InteractionState) => void,
  onChange?: (state: InteractionState) => void
): InteractionState {
  const { x = 0, y = 0, width = 0, height = 0 } = init;
  const state = impure<InteractionState>({ x, y, width, height }, { recursive: false });
  const rawState = anchor.get(state, true);

  trackPointer(state, (cx, cy) => {
    if (typeof state.start !== 'object') return;
    calculate(state, cx, cy, rawState);
    onChange?.(rawState);
  });

  return state;
}

export function captureStart(
  e: MouseEvent | TouchEvent,
  state: InteractionState,
  button: MouseButton = MOUSE_BUTTONS.left,
  target?: HTMLElement
): InteractionStart | null {
  let cursorX: number;
  let cursorY: number;

  if (e instanceof MouseEvent) {
    if (e.button !== button) return null;
    cursorX = e.clientX;
    cursorY = e.clientY;
  } else {
    const touch = e.touches[0];
    cursorX = touch.clientX;
    cursorY = touch.clientY;
  }

  const rect = target?.getBoundingClientRect();

  return {
    cursorX,
    cursorY,
    offsetX: state.x,
    offsetY: state.y,
    offsetWidth: state.width,
    offsetHeight: state.height,
    startWidth: target?.offsetWidth || 0,
    startHeight: target?.offsetHeight || 0,
    anchorLeft: rect?.left ?? 0,
    anchorTop: rect?.top ?? 0,
    anchorRight: rect?.right ?? 0,
    anchorBottom: rect?.bottom ?? 0,
  };
}

export function attachFinish(fn: () => void) {
  document.addEventListener('mouseup', fn);
  document.addEventListener('touchend', fn, { once: true });
  window.addEventListener('blur', fn);
}

export function detachFinish(fn: () => void) {
  document.removeEventListener('mouseup', fn);
  document.removeEventListener('touchend', fn);
  window.removeEventListener('blur', fn);
}

export function bindTrigger(el: HTMLElement, fn: (e: MouseEvent | TouchEvent) => void) {
  el.addEventListener('mousedown', fn as EventListener);
  el.addEventListener('touchstart', fn as EventListener, { passive: true });
}

export function unbindTrigger(el: HTMLElement, fn: (e: MouseEvent | TouchEvent) => void) {
  el.removeEventListener('mousedown', fn as EventListener);
  el.removeEventListener('touchstart', fn as EventListener);
}

export function freezeTransition(target: HTMLElement): string {
  const saved = target.style.transition;
  target.style.transition = 'none';
  return saved;
}

export function restoreTransition(target: HTMLElement | undefined, saved: string, dataMorph?: string) {
  if (!target) return;
  if (dataMorph) target.setAttribute(`data-${dataMorph}`, '');

  later(() => {
    target.style.transition = saved;
    if (dataMorph) target.removeAttribute(`data-${dataMorph}`);
  });
}
export function resetInteraction(state: InteractionState, target: HTMLElement, styles: string[]) {
  for (const prop of styles) {
    target.style[prop as AnyType] = '';
  }
  state.x = 0;
  state.y = 0;
  state.width = 0;
  state.height = 0;
}

export type SnapPoint = { x: number; y: number };

export function snapPointsFor(rect: DOMRect, tRect: DOMRect, bound: SnapToBound): SnapPoint[] {
  const pts: SnapPoint[] = [];
  if (bound === SNAP_BOUND.center || bound === SNAP_BOUND.all) {
    pts.push({
      x: rect.left + rect.width / 2 - tRect.left - tRect.width / 2,
      y: rect.top + rect.height / 2 - tRect.top - tRect.height / 2,
    });
  }
  if (bound === SNAP_BOUND.edge || bound === SNAP_BOUND.all) {
    pts.push(
      { x: rect.left - tRect.left, y: rect.top - tRect.top },
      { x: rect.right - tRect.right, y: rect.bottom - tRect.bottom },
      { x: rect.left - tRect.right, y: rect.top - tRect.bottom },
      { x: rect.right - tRect.left, y: rect.bottom - tRect.top }
    );
  }
  return pts;
}

export function collectSnapPoints(
  target?: HTMLElement,
  selectors?: string[],
  bound: SnapToBound = KIT_CONFIGS.snapBound
): SnapPoint[] {
  if (!target) return [];
  const tRect = target.getBoundingClientRect();
  const pts: SnapPoint[] = [];

  // Screen edge snapping
  const vRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  pts.push(...snapPointsFor(vRect, tRect, bound));

  if (selectors?.length) {
    const root = target.parentElement ?? document;
    for (const sel of selectors) {
      for (const el of root.querySelectorAll<HTMLElement>(sel)) {
        if (el === target) continue;
        pts.push(...snapPointsFor(el.getBoundingClientRect(), tRect, bound));
      }
    }
  }
  return pts;
}

export type EdgeSnaps = {
  x: number[];
  y: number[];
};

export function collectEdgeSnaps(
  target?: HTMLElement,
  selectors?: string[],
  bound: SnapToBound = KIT_CONFIGS.snapBound
): EdgeSnaps {
  if (!target) return { x: [], y: [] };
  const x: number[] = [];
  const y: number[] = [];

  const addRect = (r: DOMRect) => {
    if (bound === SNAP_BOUND.edge || bound === SNAP_BOUND.all) {
      x.push(r.left, r.right);
      y.push(r.top, r.bottom);
    }
    if (bound === SNAP_BOUND.center || bound === SNAP_BOUND.all) {
      x.push(r.left + r.width / 2);
      y.push(r.top + r.height / 2);
    }
  };

  addRect(new DOMRect(0, 0, window.innerWidth, window.innerHeight));

  if (selectors?.length) {
    const root = target.parentElement ?? document;
    for (const sel of selectors) {
      for (const el of root.querySelectorAll<HTMLElement>(sel)) {
        if (el === target) continue;
        addRect(el.getBoundingClientRect());
      }
    }
  }
  return { x, y };
}
