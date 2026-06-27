import { anchor, effect } from '@anchorlib/core';
import type { AnyType } from '../types.js';
import { subscribeEvent } from './document.js';
import { getPointer, MOUSE_BUTTONS, type MouseButton } from './mouse.js';
import { impure } from './state.js';

export type InteractionMode = 'hover' | 'click' | 'focus';

export type InteractionBindingOptions = {
  interaction?: InteractionMode[];
  delay?: number | { open?: number; close?: number };
  escape?: boolean;
};

export type InteractionType = 'stay' | 'reset';

export const INTERACTIVE = 'a, button, input, textarea, select, label, [contenteditable]';

/**
 * Attaches interaction listeners (hover, click, focus) and escape key handlers to trigger
 * open/close/toggle lifecycle callbacks on a target overlay element.
 *
 * @param anchorEl - The anchor trigger element listening for interaction events.
 * @param el - The controlled popup or overlay element.
 * @param init - Configuration specifying interaction trigger modes, delay timers, and escape handling.
 * @param open - Callback executed to activate/open the target.
 * @param close - Callback executed to deactivate/close the target.
 * @param toggle - Callback executed to toggle target state.
 * @returns A teardown cleanup function that disconnects all attached event listeners and timers.
 */
export function bindInteraction(
  anchorEl: HTMLElement,
  el: HTMLElement,
  init: InteractionBindingOptions,
  open: () => void,
  close: () => void,
  toggle: () => void
): () => void {
  const teardowns: (() => void)[] = [];
  const modes = init.interaction ?? [];
  const dOpen = typeof init.delay === 'number' ? init.delay : (init.delay?.open ?? 0);
  const dClose = typeof init.delay === 'number' ? init.delay : (init.delay?.close ?? 0);
  let tOpen: ReturnType<typeof setTimeout> | undefined;
  let tClose: ReturnType<typeof setTimeout> | undefined;

  const schedOpen = () => {
    clearTimeout(tClose);
    tClose = undefined;
    if (dOpen > 0) {
      tOpen = setTimeout(() => {
        tOpen = undefined;
        open();
      }, dOpen);
    } else {
      open();
    }
  };

  const schedClose = () => {
    clearTimeout(tOpen);
    tOpen = undefined;
    if (dClose > 0) {
      tClose = setTimeout(() => {
        tClose = undefined;
        close();
      }, dClose);
    } else {
      close();
    }
  };

  if (modes.includes('hover')) {
    let overAnchor = false;
    let overEl = false;
    const tryClose = () => {
      if (!overAnchor && !overEl) schedClose();
    };

    teardowns.push(
      subscribeEvent(anchorEl, 'pointerenter', () => {
        overAnchor = true;
        schedOpen();
      }),
      subscribeEvent(anchorEl, 'pointerleave', () => {
        overAnchor = false;
        tryClose();
      }),
      subscribeEvent(el, 'pointerenter', () => {
        overEl = true;
        clearTimeout(tClose);
        tClose = undefined;
      }),
      subscribeEvent(el, 'pointerleave', () => {
        overEl = false;
        tryClose();
      })
    );
  }

  if (modes.includes('focus')) {
    const onFocusOut = (e: Event) => {
      const rel = (e as FocusEvent).relatedTarget as Node | null;
      if (rel && (anchorEl.contains(rel) || el.contains(rel))) return;
      close();
    };
    teardowns.push(
      subscribeEvent(anchorEl, 'focusin', () => open()),
      subscribeEvent(el, 'focusin', () => open()),
      subscribeEvent(anchorEl, 'focusout', onFocusOut),
      subscribeEvent(el, 'focusout', onFocusOut)
    );
  }

  if (modes.includes('click')) {
    teardowns.push(
      subscribeEvent(anchorEl, 'click', () => toggle()),
      subscribeEvent(anchorEl, 'keydown', (e) => {
        const ke = e as KeyboardEvent;
        if (ke.key === 'Enter' || ke.key === ' ') {
          ke.preventDefault();
          toggle();
        }
      }),
      subscribeEvent(document, 'pointerdown', (e) => {
        if (anchorEl.contains(e.target as Node) || el.contains(e.target as Node)) return;
        close();
      })
    );
  }

  if (init.escape) {
    teardowns.push(
      subscribeEvent(document, 'keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Escape') close();
      })
    );
  }

  return () => {
    clearTimeout(tOpen);
    clearTimeout(tClose);
    for (const fn of teardowns) fn();
  };
}

/**
 * Tracks client pointer coordinates inside an animation frame loop while an interaction state is active.
 *
 * @param state - Interaction state tracking object containing active start coordinates.
 * @param calculate - Callback executed on each animation frame with pointer coordinates.
 */
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

/**
 * Initializes a reactive interaction state container that tracks spatial translation and dimensions
 * during pointer movement.
 */
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

/**
 * Captures initial geometry and cursor position at the start of a pointer interaction.
 */
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

/**
 * Attaches global finish event listeners (mouseup, touchend, window blur) to terminate interaction tracking.
 */
export function attachFinish(fn: () => void) {
  document.addEventListener('mouseup', fn);
  document.addEventListener('touchend', fn, { once: true });
  window.addEventListener('blur', fn);
}

/**
 * Detaches global finish event listeners.
 */
export function detachFinish(fn: () => void) {
  document.removeEventListener('mouseup', fn);
  document.removeEventListener('touchend', fn);
  window.removeEventListener('blur', fn);
}

/**
 * Binds interaction trigger listeners (mousedown, touchstart) to a DOM element.
 */
export function bindTrigger(el: HTMLElement, fn: (e: MouseEvent | TouchEvent) => void) {
  el.addEventListener('mousedown', fn as EventListener);
  el.addEventListener('touchstart', fn as EventListener, { passive: true });
}

/**
 * Unbinds interaction trigger listeners from a DOM element.
 */
export function unbindTrigger(el: HTMLElement, fn: (e: MouseEvent | TouchEvent) => void) {
  el.removeEventListener('mousedown', fn as EventListener);
  el.removeEventListener('touchstart', fn as EventListener);
}

/**
 * Resets target element inline styles and resets interaction state dimensions and coordinates to zero.
 */
export function resetInteraction(state: InteractionState, target: HTMLElement, styles: string[]) {
  for (const prop of styles) {
    target.style[prop as AnyType] = '';
  }
  state.x = 0;
  state.y = 0;
  state.width = 0;
  state.height = 0;
}
