import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SNAP_BOUND } from '../../src/config.js';
import { collectEdgeSnaps } from '../../src/utils/rect.js';

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
});
