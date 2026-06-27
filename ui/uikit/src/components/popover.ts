import { anchor, effect, mutable, untrack } from '@anchorlib/core';
import type { AnchorOffset, AxisPosition, RectPlacementOptions } from '../utils/index.js';
import {
  applyPlacement,
  bindInteraction,
  captureSnapshot,
  clearPlacement,
  createFocusTrap,
  getScrollables,
  placeRect,
  resolveEl,
  resolvePortalTarget,
  restoreSnapshot,
} from '../utils/index.js';

export type Interaction = 'hover' | 'click' | 'focus';

export type PopoverInit = RectPlacementOptions & {
  boundary?: HTMLElement;
  interaction?: Interaction[];
  delay?: number | { open?: number; close?: number };
  cssPrefix?: string;
  attrPrefix?: string;
  escape?: boolean;
  portal?: boolean | HTMLElement | string;
  focus?: boolean;
};

export type PopoverInstance = {
  element?: HTMLElement | string;
  anchor?: HTMLElement | string;
  open: boolean;
  x: number;
  y: number;
  xSide: AxisPosition;
  ySide: AxisPosition;
  anchorX: AnchorOffset;
  anchorY: AnchorOffset;
  toggle(): void;
  reposition(): void;
  destroy(): void;
};

/**
 * Creates a reactive popover component that tethers a floating element to an anchor element.
 * Computes and maintains position while open, goes dormant when closed.
 *
 * @param init - Popover configuration including placement preferences and trigger modes.
 * @returns A PopoverInstance reactive state controller.
 */
export function popover(init: PopoverInit): PopoverInstance {
  if (!anchor.has(init)) init = mutable(init);

  const toggle = () => {
    state.open = !state.open;
  };

  const destroy = () => {
    anchor.destroy(state);
  };

  const state = mutable<PopoverInstance>({
    x: 0,
    y: 0,
    open: false,
    xSide: init.xPos ?? 'center',
    ySide: init.yPos ?? 'after',
    anchorX: { start: 0, center: 0, end: 0 },
    anchorY: { start: 0, center: 0, end: 0 },
    toggle,
    destroy,
    reposition,
  });

  function reposition() {
    const self = resolveEl(state.element);
    const target = resolveEl(state.anchor) ?? self?.parentElement ?? undefined;
    if (!self || !target || !state.open) return;

    const placement = placeRect(
      target.getBoundingClientRect(),
      self.getBoundingClientRect(),
      init.boundary?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight),
      init
    );

    untrack(() => anchor.assign(state, placement));
    applyPlacement(self, placement, init.cssPrefix, init.attrPrefix);
  }

  let rafId = 0;
  function schedule() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(reposition);
  }

  effect.client(() => {
    if (!init.interaction?.length) return;

    const self = resolveEl(state.element);
    const target = resolveEl(state.anchor) ?? self?.parentElement ?? undefined;

    if (!self || !target) return;

    return bindInteraction(
      target,
      self,
      init,
      () => {
        state.open = true;
      },
      () => {
        state.open = false;
      },
      () => {
        state.open = !state.open;
      }
    );
  });

  effect.client(() => {
    if (!state.open) return;

    const self = resolveEl(state.element);
    const target = resolveEl(state.anchor) ?? self?.parentElement ?? undefined;
    if (!self || !target) return;

    const snapshot = captureSnapshot(self, init);

    if (init.portal) {
      const target = resolvePortalTarget(init.portal);
      if (target && self.parentElement !== target) target.appendChild(self);
    }

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(target);
    resizeObserver.observe(self);

    const scrollables = getScrollables(target);
    for (const scrollable of scrollables) scrollable.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const releaseFocus = init.focus
      ? createFocusTrap(self, { trapOverflow: false, releaseOnEsc: false, releaseOnClickOutside: false })
      : undefined;

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      for (const p of scrollables) p.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      releaseFocus?.();

      clearPlacement(self, init.cssPrefix, init.attrPrefix);
      restoreSnapshot(self, snapshot);
    };
  });

  effect.client(() => {
    if (!state.open) return;
    reposition();
  });

  return state as unknown as PopoverInstance;
}
