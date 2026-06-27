import { anchor, effect } from '@anchorlib/core';
import type { AnchorOffset, AxisPosition, RectPlacementOptions } from '../utils/index.js';
import {
  applyPlacement,
  bindInteraction,
  captureSnapshot,
  clearPlacement,
  collectScrollParents,
  createFocusTrap,
  impure,
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
  if (!anchor.has(init)) init = impure(init);

  const toggle = () => {
    state.open = !state.open;
  };

  const destroy = () => {
    anchor.destroy(state);
  };

  const state = impure<PopoverInstance>({
    open: false,
    x: 0,
    y: 0,
    xSide: init.xPos ?? 'center',
    ySide: init.yPos ?? 'after',
    anchorX: { start: 0, center: 0, end: 0 },
    anchorY: { start: 0, center: 0, end: 0 },
    toggle,
    destroy,
    reposition,
  });

  let rafId = 0;

  function reposition() {
    const el = resolveEl(state.element);
    const anch = resolveEl(state.anchor) ?? el?.parentElement ?? undefined;
    if (!el || !anch || !state.open) return;

    const result = placeRect(
      anch.getBoundingClientRect(),
      el.getBoundingClientRect(),
      init.boundary?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight),
      init
    );

    anchor.assign(state, result);

    applyPlacement(el, result, init.cssPrefix, init.attrPrefix);
  }

  function schedule() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(reposition);
  }

  effect.client(() => {
    const el = resolveEl(state.element);
    const anch = resolveEl(state.anchor) ?? el?.parentElement ?? undefined;
    if (!el || !anch) return;
    if (!init.interaction?.length && !init.escape) return;

    return bindInteraction(
      anch,
      el,
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
    const el = resolveEl(state.element);
    const anch = resolveEl(state.anchor) ?? el?.parentElement ?? undefined;
    if (!el || !anch) return;

    const snap = captureSnapshot(el, init);

    if (init.portal) {
      const target = resolvePortalTarget(init.portal);
      if (target && el.parentElement !== target) target.appendChild(el);
    }

    const ro = new ResizeObserver(schedule);
    ro.observe(anch);
    ro.observe(el);

    const sp = collectScrollParents(anch);
    for (const p of sp) p.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const releaseFocus = init.focus
      ? createFocusTrap(el, { trapOverflow: false, releaseOnEsc: false, releaseOnClickOutside: false })
      : undefined;

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      for (const p of sp) p.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      releaseFocus?.();

      clearPlacement(el, init.cssPrefix, init.attrPrefix);
      restoreSnapshot(el, snap);
    };
  });

  effect.client(() => {
    if (!state.open) return;
    reposition();
  });

  return state as unknown as PopoverInstance;
}
