import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SNAP_BOUND } from '../../src/config.js';
import {
  anchorOff,
  applyPlacement,
  baseCoordinate,
  clearPlacement,
  collectEdgeSnaps,
  freezeTransition,
  placeRect,
  resolveAxis,
} from '../../src/utils/rect.js';

describe('rect utils', () => {
  beforeEach(() => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('collectEdgeSnaps', () => {
    it('should return empty arrays if target is undefined', () => {
      const result = collectEdgeSnaps();
      expect(result).toEqual({ x: [], y: [] });
    });

    it('should collect window edges and center if no selectors are provided', () => {
      const target = document.createElement('div');

      const resultAll = collectEdgeSnaps(target, undefined, SNAP_BOUND.all);
      // Window is 1000x1000
      expect(resultAll.x).toContain(0); // left edge
      expect(resultAll.x).toContain(1000); // right edge
      expect(resultAll.x).toContain(500); // center x
      expect(resultAll.y).toContain(0); // top edge
      expect(resultAll.y).toContain(1000); // bottom edge
      expect(resultAll.y).toContain(500); // center y

      const resultEdge = collectEdgeSnaps(target, undefined, SNAP_BOUND.edge);
      expect(resultEdge.x).toContain(0);
      expect(resultEdge.x).toContain(1000);
      expect(resultEdge.x).not.toContain(500);

      const resultCenter = collectEdgeSnaps(target, undefined, SNAP_BOUND.center);
      expect(resultCenter.x).toContain(500);
      expect(resultCenter.x).not.toContain(0);
    });

    it('should collect snaps from elements matching selectors', () => {
      const root = document.createElement('div');
      const target = document.createElement('div');
      const sibling = document.createElement('div');
      sibling.className = 'snap';

      root.appendChild(target);
      root.appendChild(sibling);

      vi.spyOn(sibling, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        top: 100,
        right: 200,
        bottom: 200,
        width: 100,
        height: 100,
        x: 100,
        y: 100,
        toJSON: () => {},
      });

      const result = collectEdgeSnaps(target, ['.snap'], SNAP_BOUND.edge);
      expect(result.x).toContain(100);
      expect(result.x).toContain(200);
      expect(result.y).toContain(100);
      expect(result.y).toContain(200);
    });

    it('should ignore the target element itself if it matches selector', () => {
      const root = document.createElement('div');
      const target = document.createElement('div');
      target.className = 'snap';

      root.appendChild(target);

      vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        top: 100,
        right: 200,
        bottom: 200,
        width: 100,
        height: 100,
        x: 100,
        y: 100,
        toJSON: () => {},
      });

      const result = collectEdgeSnaps(target, ['.snap'], SNAP_BOUND.edge);
      // Window bounds only
      expect(result.x).not.toContain(100);
      expect(result.x).not.toContain(200);
    });

    it('should fallback to document if target has no parentElement', () => {
      const target = document.createElement('div'); // detached, no parent
      const other = document.createElement('div');
      other.className = 'doc-snap';
      document.body.appendChild(other);

      vi.spyOn(other, 'getBoundingClientRect').mockReturnValue({
        left: 50,
        top: 50,
        right: 150,
        bottom: 150,
        width: 100,
        height: 100,
        x: 50,
        y: 50,
        toJSON: () => {},
      });

      const result = collectEdgeSnaps(target, ['.doc-snap'], SNAP_BOUND.edge);
      expect(result.x).toContain(50);
      expect(result.x).toContain(150);

      other.remove();
    });
  });

  describe('restoreTransition', () => {
    it('should restore transition style on target after microtask', async () => {
      const { restoreTransition } = await import('../../src/utils/rect.js');
      const target = document.createElement('div');

      target.style.transition = 'none';
      restoreTransition(target, 'all 0.3s ease');

      // Before microtask runs, it shouldn't be applied yet
      expect(target.style.transition).toBe('none');

      // Wait for the singleton later() queue to clear
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(target.style.transition).toBe('all 0.3s ease');
    });

    it('should safely do nothing if target is undefined', async () => {
      const { restoreTransition } = await import('../../src/utils/rect.js');
      // Should not throw
      restoreTransition(undefined, 'all 0.3s ease');
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
  });

  describe('baseCoordinate', () => {
    it('should calculate correct coordinates for all AxisPosition values', () => {
      expect(baseCoordinate('before', 100, 50, 20, 10)).toBe(70); // 100 - 20 - 10
      expect(baseCoordinate('after', 100, 50, 20, 10)).toBe(160); // 100 + 50 + 10
      expect(baseCoordinate('start', 100, 50, 20, 10)).toBe(100); // 100
      expect(baseCoordinate('center', 100, 50, 20, 10)).toBe(115); // 100 + (50 - 20) / 2
      expect(baseCoordinate('end', 100, 50, 20, 10)).toBe(130); // 100 + 50 - 20
    });
  });

  describe('resolveAxis', () => {
    it('should shift coordinate within tolerance when shift strategy is enabled', () => {
      // Out of bounds on near side (bNear = 0, coordinate = -10)
      const res1 = resolveAxis('start', -10, 20, 0, 100, 0, 500, 0, 0.5, ['shift']);
      expect(res1.coordinate).toBe(0);

      // Out of bounds on far side
      const res2 = resolveAxis('start', 490, 20, 400, 100, 0, 500, 0, 0.5, ['shift']);
      expect(res2.coordinate).toBe(480);
    });

    it('should flip side and coordinate when flip strategy is enabled and flipped position fits better', () => {
      // side = 'before' (FLIP['before'] is 'after'), near boundary collision
      const res = resolveAxis('before', -10, 20, 10, 50, 0, 500, 5, 0.5, ['flip']);
      expect(res.side).toBe('after');
      expect(res.coordinate).toBe(65); // 10 + 50 + 5
    });

    it('should return unmodified side and coordinate if no strategies or no collision', () => {
      const res = resolveAxis('start', 100, 20, 100, 50, 0, 500, 5, 0.5, []);
      expect(res).toEqual({ side: 'start', coordinate: 100 });
    });
  });

  describe('anchorOff', () => {
    it('should compute relative offsets correctly', () => {
      expect(anchorOff(50, 100, 40)).toEqual({
        start: 50,
        center: 70,
        end: 90,
      });
    });
  });

  describe('placeRect', () => {
    const anchorRect = new DOMRect(100, 100, 50, 50);
    const elementRect = new DOMRect(0, 0, 20, 20);
    const boundaryRect = new DOMRect(0, 0, 500, 500);

    it('should resolve placement with default options', () => {
      const placement = placeRect(anchorRect, elementRect, boundaryRect);
      expect(placement.xSide).toBe('center');
      expect(placement.ySide).toBe('after');
    });

    it('should resolve placement with custom options including object gap', () => {
      const placement = placeRect(anchorRect, elementRect, boundaryRect, {
        xPos: 'before',
        yPos: 'start',
        gap: { x: 5, y: 10 },
      });
      expect(placement.xSide).toBe('before');
      expect(placement.ySide).toBe('start');
    });

    it('should fall back to 0 when gap object properties are undefined', () => {
      const placement = placeRect(anchorRect, elementRect, boundaryRect, {
        xPos: 'before',
        yPos: 'after',
        gap: {},
      });
      expect(placement.x).toBeDefined();
      expect(placement.y).toBeDefined();
    });
  });

  describe('applyPlacement & clearPlacement', () => {
    it('should apply and clear placement with cssPrefix and attrPrefix', () => {
      const el = document.createElement('div');
      const placement = {
        x: 10,
        y: 20,
        xSide: 'before' as const,
        ySide: 'after' as const,
        anchorX: { start: 1, center: 2, end: 3 },
        anchorY: { start: 4, center: 5, end: 6 },
      };

      applyPlacement(el, placement, '--popover', 'data-popover');
      expect(el.style.position).toBe('fixed');
      expect(el.style.getPropertyValue('--popover-x')).toBe('10px');
      expect(el.style.getPropertyValue('--popover-y')).toBe('20px');
      expect(el.getAttribute('data-popover-open')).toBe('');
      expect(el.getAttribute('data-popover-x-side')).toBe('before');

      clearPlacement(el, '--popover', 'data-popover');
      expect(el.style.position).toBe('');
      expect(el.style.getPropertyValue('--popover-x')).toBe('');
      expect(el.hasAttribute('data-popover-open')).toBe(false);
    });

    it('should apply and clear placement without prefixes (using left/top)', () => {
      const el = document.createElement('div');
      const placement = {
        x: 15,
        y: 25,
        xSide: 'start' as const,
        ySide: 'end' as const,
        anchorX: { start: 0, center: 0, end: 0 },
        anchorY: { start: 0, center: 0, end: 0 },
      };

      applyPlacement(el, placement);
      expect(el.style.left).toBe('15px');
      expect(el.style.top).toBe('25px');

      clearPlacement(el);
      expect(el.style.left).toBe('');
      expect(el.style.top).toBe('');
    });
  });

  describe('freezeTransition', () => {
    it('should set transition to none and return previous value', () => {
      const el = document.createElement('div');
      el.style.transition = 'opacity 0.2s';
      const prev = freezeTransition(el);
      expect(prev).toBe('opacity 0.2s');
      expect(el.style.transition).toBe('none');
    });
  });
});
