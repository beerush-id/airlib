import { microtask } from '@anchorlib/core';
import { KIT_CONFIGS, SNAP_BOUND, type SnapToBound } from '../config.js';

const [later] = microtask(5);

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
      for (const el of Array.from(root.querySelectorAll<HTMLElement>(sel))) {
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
      for (const el of Array.from(root.querySelectorAll<HTMLElement>(sel))) {
        if (el === target) continue;
        addRect(el.getBoundingClientRect());
      }
    }
  }
  return { x, y };
}

export type AxisPosition = 'before' | 'start' | 'center' | 'end' | 'after';

export type AnchorOffset = {
  start: number;
  center: number;
  end: number;
};

export type RectPlacementOptions = {
  xPos?: AxisPosition;
  yPos?: AxisPosition;
  gap?: number | { x?: number; y?: number };
  overflow?: ('flip' | 'shift')[];
  shiftTolerance?: number;
};

export type RectPlacement = {
  x: number;
  y: number;
  xSide: AxisPosition;
  ySide: AxisPosition;
  anchorX: AnchorOffset;
  anchorY: AnchorOffset;
};

/**
 * Computes the placement coordinates of a floating rectangle relative to an anchor rectangle,
 * keeping it constrained within a boundary rectangle.
 *
 * Resolves horizontal and vertical axes independently by applying the preferred alignment
 * and correcting collisions using configured overflow strategies (shift or flip).
 *
 * @param anchorRect - Bounding rectangle of the anchor element.
 * @param elementRect - Bounding rectangle of the floating element.
 * @param boundaryRect - Constraining boundary rectangle (e.g. viewport).
 * @param options - Preferred positioning and overflow collision handling options.
 * @returns Resolved 2D coordinates, actual axis sides, and anchor offsets.
 */
export function placeRect(
  anchorRect: DOMRect,
  elementRect: DOMRect,
  boundaryRect: DOMRect,
  options: RectPlacementOptions = {}
): RectPlacement {
  const {
    xPos = 'center',
    yPos = 'after',
    gap = 8,
    overflow: strats = ['flip', 'shift'],
    shiftTolerance = 0.5,
  } = options;

  const gX = typeof gap === 'number' ? gap : (gap.x ?? 0);
  const gY = typeof gap === 'number' ? gap : (gap.y ?? 0);
  const xGap = xPos === 'before' || xPos === 'after' ? gX : 0;
  const yGap = yPos === 'before' || yPos === 'after' ? gY : 0;

  const xr = resolveAxis(
    xPos,
    baseCoord(xPos, anchorRect.left, anchorRect.width, elementRect.width, xGap),
    elementRect.width,
    anchorRect.left,
    anchorRect.width,
    boundaryRect.left,
    boundaryRect.right,
    xGap,
    shiftTolerance,
    strats
  );

  const yr = resolveAxis(
    yPos,
    baseCoord(yPos, anchorRect.top, anchorRect.height, elementRect.height, yGap),
    elementRect.height,
    anchorRect.top,
    anchorRect.height,
    boundaryRect.top,
    boundaryRect.bottom,
    yGap,
    shiftTolerance,
    strats
  );

  return {
    x: xr.coord,
    y: yr.coord,
    xSide: xr.side,
    ySide: yr.side,
    anchorX: anchorOff(xr.coord, anchorRect.left, anchorRect.width),
    anchorY: anchorOff(yr.coord, anchorRect.top, anchorRect.height),
  };
}

/**
 * Applies a computed rectangle placement onto a DOM element by assigning fixed inline position styles
 * or CSS custom properties.
 *
 * @param el - The target HTMLElement to position.
 * @param placement - The computed rectangle placement coordinates and sides.
 * @param cssPrefix - Optional custom property prefix (e.g. '--popover').
 * @param attrPrefix - Optional data attribute prefix for state projection.
 */
export function applyPlacement(el: HTMLElement, placement: RectPlacement, cssPrefix?: string, attrPrefix?: string) {
  el.style.position = 'fixed';

  if (cssPrefix) {
    el.style.setProperty(`${cssPrefix}-x`, `${placement.x}px`);
    el.style.setProperty(`${cssPrefix}-y`, `${placement.y}px`);
    el.style.setProperty(`${cssPrefix}-anchor-x-start`, `${placement.anchorX.start}px`);
    el.style.setProperty(`${cssPrefix}-anchor-x-center`, `${placement.anchorX.center}px`);
    el.style.setProperty(`${cssPrefix}-anchor-x-end`, `${placement.anchorX.end}px`);
    el.style.setProperty(`${cssPrefix}-anchor-y-start`, `${placement.anchorY.start}px`);
    el.style.setProperty(`${cssPrefix}-anchor-y-center`, `${placement.anchorY.center}px`);
    el.style.setProperty(`${cssPrefix}-anchor-y-end`, `${placement.anchorY.end}px`);
  } else {
    el.style.left = `${placement.x}px`;
    el.style.top = `${placement.y}px`;
  }

  if (attrPrefix) {
    el.setAttribute(`${attrPrefix}-open`, '');
    el.setAttribute(`${attrPrefix}-x-side`, placement.xSide);
    el.setAttribute(`${attrPrefix}-y-side`, placement.ySide);
  }
}

/**
 * Removes applied placement styles and data attributes from a DOM element.
 *
 * @param el - The target HTMLElement to reset.
 * @param cssPrefix - Optional custom property prefix used during placement.
 * @param attrPrefix - Optional attribute prefix used during placement.
 */
export function clearPlacement(el: HTMLElement, cssPrefix?: string, attrPrefix?: string) {
  if (cssPrefix) {
    for (const k of CSS_SUFFIXES) el.style.removeProperty(`${cssPrefix}${k}`);
  } else {
    el.style.left = '';
    el.style.top = '';
  }
  el.style.position = '';

  if (attrPrefix) {
    for (const k of ATTR_SUFFIXES) el.removeAttribute(`${attrPrefix}${k}`);
  }
}

export const CSS_SUFFIXES = [
  'x',
  'y',
  'anchor-x-start',
  'anchor-x-center',
  'anchor-x-end',
  'anchor-y-start',
  'anchor-y-center',
  'anchor-y-end',
];

export const ATTR_SUFFIXES = ['-open', '-x-side', '-y-side'];

/**
 * Calculates the initial unconstrained coordinate along a single axis based on alignment preference.
 *
 * @param pos - Preferred alignment side.
 * @param near - Starting edge coordinate of the anchor.
 * @param span - Size of the anchor along the axis.
 * @param size - Size of the floating element along the axis.
 * @param gap - Separation gap offset.
 * @returns The base unconstrained coordinate.
 */
export function baseCoord(pos: AxisPosition, near: number, span: number, size: number, gap: number): number {
  switch (pos) {
    case 'before':
      return near - size - gap;
    case 'after':
      return near + span + gap;
    case 'start':
      return near;
    case 'center':
      return near + (span - size) / 2;
    case 'end':
      return near + span - size;
  }
}

/**
 * Resolves collisions along a single axis by adjusting the coordinate via shifting or flipping alignment sides.
 */
export function resolveAxis(
  side: AxisPosition,
  coord: number,
  size: number,
  aNear: number,
  aSpan: number,
  bNear: number,
  bFar: number,
  gap: number,
  tolerance: number,
  strategies: ('flip' | 'shift')[]
): { side: AxisPosition; coord: number } {
  if (strategies.includes('shift')) {
    const max = tolerance * aSpan;
    const oNear = Math.max(0, bNear - coord);
    const oFar = Math.max(0, coord + size - bFar);
    coord += Math.max(-max, Math.min(max, oNear - oFar));
  }

  if (strategies.includes('flip')) {
    const total = Math.max(0, bNear - coord) + Math.max(0, coord + size - bFar);
    if (total > 0) {
      const f = FLIP[side];
      const fc = baseCoord(f, aNear, aSpan, size, gap);
      if (Math.max(0, bNear - fc) + Math.max(0, fc + size - bFar) < total) {
        return { side: f, coord: fc };
      }
    }
  }

  return { side, coord };
}

/**
 * Computes the relative distances from the element coordinate to the anchor's start, center, and end positions.
 */
export function anchorOff(elNear: number, aNear: number, aSpan: number): AnchorOffset {
  return {
    start: aNear - elNear,
    center: aNear + aSpan / 2 - elNear,
    end: aNear + aSpan - elNear,
  };
}

const FLIP: Record<AxisPosition, AxisPosition> = {
  before: 'after',
  after: 'before',
  start: 'end',
  end: 'start',
  center: 'center',
};
