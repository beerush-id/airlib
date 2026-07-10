import { anchor, effect, mutable, untrack } from '@anchorlib/core';
import {
  type AnchorOffset,
  animationFrame,
  applyPlacement,
  type AxisPosition,
  bindInteraction,
  captureSnapshot,
  clearPlacement,
  createFocusTrap,
  getScrollables,
  placeRect,
  type RectPlacementOptions,
  resolveEl,
  resolvePortalTarget,
  restoreSnapshot,
} from '../utils/index.js';

export type Interaction = (typeof POPOVER_INTERACTION)[keyof typeof POPOVER_INTERACTION];

export type PopoverInit = RectPlacementOptions & {
  focus?: boolean;
  delay?: number | { open?: number; close?: number };
  escape?: boolean;
  portal?: boolean | HTMLElement | string;
  passive?: boolean;
  boundary?: HTMLElement;
  cssPrefix?: string;
  attrPrefix?: string;
  interaction?: Interaction[];
  unstyled?: boolean;
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
  anchorWidth: number;
  anchorHeight: number;
  parent?: PopoverInstance;
  toggle(): void;
  reposition(): void;
  destroy(): void;
};

export const POPOVER_INTERACTION = {
  hover: 'hover',
  click: 'click',
  focus: 'focus',
} as const;

/**
 * Creates a reactive popover component that tethers a floating element to an anchor element.
 * Computes and maintains position while open, goes dormant when closed.
 *
 * @param init - Popover configuration including placement preferences and trigger modes.
 * @returns A PopoverInstance reactive state controller.
 */
export function popover(init: PopoverInit): PopoverInstance {
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
    anchorWidth: 0,
    anchorHeight: 0,
    toggle,
    destroy,
    reposition,
  });

  if (!init.cssPrefix) {
    init.cssPrefix = '--popover';
  }

  function reposition() {
    const self = resolveEl(state.element);
    const target = resolveEl(state.anchor) ?? self?.parentElement;
    if (!self || !target || !state.open) return;

    const placement = placeRect(
      target.getBoundingClientRect(),
      self.getBoundingClientRect(),
      init.boundary?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight),
      init
    );

    untrack(() => anchor.assign(state, placement));
    applyPlacement(self, placement, init.cssPrefix, init.attrPrefix, init.unstyled);
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

  const reframe = animationFrame(reposition);

  effect.client(() => {
    if (!state.open) return;

    const self = resolveEl(state.element);
    const target = resolveEl(state.anchor) ?? self?.parentElement;
    if (!self || !target) return;

    const snapshot = captureSnapshot(self, init);

    if (init.portal) {
      const target = resolvePortalTarget(init.portal);
      if (target && self.parentElement !== target) target.appendChild(self);
    }

    const resizeObserver = !init.passive ? new ResizeObserver(reframe) : undefined;
    resizeObserver?.observe(target);
    resizeObserver?.observe(self);

    const scrollables = !init.passive ? getScrollables(target) : [];
    for (const scrollable of scrollables) {
      scrollable.addEventListener('wheel', reframe, { passive: true });
    }
    if (!init.passive) window.addEventListener('resize', reframe);

    const releaseFocus = init.focus
      ? createFocusTrap(self, { trapOverflow: false, releaseOnEsc: false, releaseOnClickOutside: false })
      : undefined;

    return () => {
      reframe.cancel();
      resizeObserver?.disconnect();

      for (const scrollable of scrollables) {
        scrollable.removeEventListener('wheel', reframe);
      }

      window.removeEventListener('resize', reframe);
      releaseFocus?.();

      if (!init.passive) clearPlacement(self, init.cssPrefix, init.attrPrefix, init.unstyled);
      restoreSnapshot(self, snapshot, init.passive, !init.passive);
    };
  });

  effect.client(() => {
    if (!state.open) return;
    reposition();
  });

  return state as unknown as PopoverInstance;
}
