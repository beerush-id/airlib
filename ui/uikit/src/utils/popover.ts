import { anchor, effect } from '@anchorlib/core';
import { KIT_CONFIGS, type OverflowStrategy } from '../config.js';
import { createFocusTrap, type FocusTrapOptions } from './focus.js';
import { getNearestScrollableParent } from './scroll.js';
import { impure } from './state.js';

// --- Types ---

export type PopX = 'before' | 'start' | 'center' | 'end' | 'after';
export type PopY = PopX;
export type Offset = number | { x?: number; y?: number };

export type PopoverComputed = {
  left: number;
  top: number;
  popX: PopX;
  popY: PopY;
  maxWidth?: number;
  maxHeight?: number;
};

export type PopoverRefInit = {
  x?: PopX;
  y?: PopY;
  offset?: Offset;
  overflow?: OverflowStrategy[];
  anchor?: HTMLElement;
  content?: HTMLElement;
  boundary?: HTMLElement;
  portal?: string | HTMLElement;
  focusTrap?: boolean | FocusTrapOptions;
  onReposition?: (computed: PopoverComputed) => void;
};

export type PopoverRef = {
  anchor?: HTMLElement;
  content?: HTMLElement;
  readonly popX: PopX;
  readonly popY: PopY;
  readonly left: number;
  readonly top: number;
  reposition(): void;
  destroy(): void;
};

// --- Exports ---

const FLIP: Record<string, PopX | PopY> = {
  before: 'after',
  after: 'before',
  start: 'end',
  end: 'start',
  center: 'center',
};

/**
 * Pure positioning. No DOM, no side effects.
 */
export function popoverPosition(
  anchorRect: DOMRect,
  contentRect: DOMRect,
  boundaryRect: DOMRect,
  x: PopX = 'center',
  y: PopY = 'after',
  offset: Offset = KIT_CONFIGS.popoverOffset,
  overflow: OverflowStrategy[] = KIT_CONFIGS.popoverOverflow
): PopoverComputed {
  const offX = typeof offset === 'number' ? offset : (offset.x ?? KIT_CONFIGS.popoverOffset);
  const offY = typeof offset === 'number' ? offset : (offset.y ?? KIT_CONFIGS.popoverOffset);

  const xr = resolveAxis(
    x,
    anchorRect.left,
    anchorRect.width,
    contentRect.width,
    boundaryRect.left,
    boundaryRect.right,
    offX,
    overflow
  );
  const yr = resolveAxis(
    y,
    anchorRect.top,
    anchorRect.height,
    contentRect.height,
    boundaryRect.top,
    boundaryRect.bottom,
    offY,
    overflow
  );

  return {
    left: xr.coord,
    top: yr.coord,
    popX: xr.pos as PopX,
    popY: yr.pos as PopY,
    maxWidth: xr.max,
    maxHeight: yr.max,
  };
}

/**
 * DOM lifecycle for floating element positioning.
 * Observes resize/scroll, manages portal, composes focus trap.
 *
 * If `init` is a reactive object (mutable), changes to any property
 * trigger repositioning or lifecycle updates automatically.
 */
export function popoverRef(init: PopoverRefInit = {}): PopoverRef {
  if (!anchor.has(init)) {
    init = impure(init);
  }

  const computed = impure<PopoverComputed>({
    left: 0,
    top: 0,
    popX: init.x ?? 'center',
    popY: init.y ?? 'after',
  });

  let originalParent: HTMLElement | null = null;
  let resizeObserver: ResizeObserver | undefined;
  let scrollParents: HTMLElement[] = [];
  let releaseFocusTrap: (() => void) | undefined;
  let rafId = 0;

  const reposition = () => {
    const { anchor, content } = init;
    if (!anchor || !content) return;

    const boundaryRect = init.boundary
      ? init.boundary.getBoundingClientRect()
      : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

    const result = popoverPosition(
      anchor.getBoundingClientRect(),
      content.getBoundingClientRect(),
      boundaryRect,
      init.x,
      init.y,
      init.offset,
      init.overflow
    );

    computed.left = result.left;
    computed.top = result.top;
    computed.popX = result.popX;
    computed.popY = result.popY;

    content.style.position = 'fixed';
    content.style.left = `${result.left}px`;
    content.style.top = `${result.top}px`;
    if (result.maxWidth != null) content.style.maxWidth = `${result.maxWidth}px`;
    if (result.maxHeight != null) content.style.maxHeight = `${result.maxHeight}px`;

    init.onReposition?.(result);
  };

  const scheduleReposition = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(reposition);
  };

  // Reactive positioning — tracks init.x, init.y, init.offset, init.overflow, init.anchor, init.content
  effect.client(() => {
    reposition();
  });

  // Lifecycle — tracks init.anchor, init.content for observer/portal/focus management
  effect.client(() => {
    const { anchor, content } = init;
    if (!anchor || !content) return;

    // Portal
    originalParent = content.parentElement;
    const portal =
      init.portal instanceof HTMLElement
        ? init.portal
        : (document.querySelector(typeof init.portal === 'string' ? init.portal : KIT_CONFIGS.popoverPortal) ??
          document.body);
    if (content.parentElement !== portal) portal.appendChild(content);

    // Observers
    resizeObserver = new ResizeObserver(scheduleReposition);
    resizeObserver.observe(anchor);
    resizeObserver.observe(content);

    scrollParents = init.boundary ? [init.boundary] : collectScrollParents(anchor);
    for (const p of scrollParents) p.addEventListener('scroll', scheduleReposition, { passive: true });
    window.addEventListener('resize', scheduleReposition);

    content.setAttribute('data-popover-open', '');

    // Focus trap
    if (init.focusTrap) {
      releaseFocusTrap = createFocusTrap(content, typeof init.focusTrap === 'object' ? init.focusTrap : undefined);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      releaseFocusTrap?.();
      releaseFocusTrap = undefined;

      for (const p of scrollParents) p.removeEventListener('scroll', scheduleReposition);
      window.removeEventListener('resize', scheduleReposition);
      scrollParents = [];

      content.removeAttribute('data-popover-open');
      content.style.position = '';
      content.style.left = '';
      content.style.top = '';
      content.style.maxWidth = '';
      content.style.maxHeight = '';

      if (originalParent && content.parentElement !== originalParent) {
        originalParent.appendChild(content);
      }
      originalParent = null;
    };
  });

  return {
    get anchor() {
      return init.anchor;
    },
    set anchor(el) {
      init.anchor = el;
    },
    get content() {
      return init.content;
    },
    set content(el) {
      init.content = el;
    },
    get popX() {
      return computed.popX;
    },
    get popY() {
      return computed.popY;
    },
    get left() {
      return computed.left;
    },
    get top() {
      return computed.top;
    },
    reposition,
    destroy() {
      init.anchor = undefined;
      init.content = undefined;
    },
  };
}

function collectScrollParents(element: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let current = getNearestScrollableParent(element);
  while (current) {
    parents.push(current);
    current = getNearestScrollableParent(current);
  }
  return parents;
}

function computeAxis(
  pos: PopX | PopY,
  anchorStart: number,
  anchorSize: number,
  contentSize: number,
  offset: number
): number {
  switch (pos) {
    case 'before':
      return anchorStart - contentSize - offset;
    case 'after':
      return anchorStart + anchorSize + offset;
    case 'start':
      return anchorStart;
    case 'center':
      return anchorStart + (anchorSize - contentSize) / 2;
    case 'end':
      return anchorStart + anchorSize - contentSize;
  }
}

function resolveAxis(
  pos: PopX | PopY,
  anchorStart: number,
  anchorSize: number,
  contentSize: number,
  boundaryStart: number,
  boundaryEnd: number,
  offset: number,
  overflow: OverflowStrategy[]
): { pos: PopX | PopY; coord: number; max?: number } {
  let coord = computeAxis(pos, anchorStart, anchorSize, contentSize, offset);

  for (const strategy of overflow) {
    if (strategy === 'flip' && (coord < boundaryStart || coord + contentSize > boundaryEnd)) {
      const flipped = FLIP[pos] as PopX | PopY;
      const fc = computeAxis(flipped, anchorStart, anchorSize, contentSize, offset);
      if (!(fc < boundaryStart || fc + contentSize > boundaryEnd)) {
        pos = flipped;
        coord = fc;
      }
    }

    if (strategy === 'shift') {
      if (coord < boundaryStart) coord = boundaryStart;
      else if (coord + contentSize > boundaryEnd) coord = boundaryEnd - contentSize;
    }

    if (strategy === 'resize' && (coord < boundaryStart || coord + contentSize > boundaryEnd)) {
      if (coord < boundaryStart) coord = boundaryStart;
      return { pos, coord, max: boundaryEnd - boundaryStart };
    }
  }

  return { pos, coord };
}
