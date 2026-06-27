import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getNearestScrollable, suspendOverflow } from '../../src/utils/scroll.js';

describe('scroll utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('suspendOverflow', () => {
    it('should set body overflow to "hidden" when no element provided', () => {
      const restore = suspendOverflow();
      expect(document.body.style.overflow).toBe('hidden');
      restore();
    });

    it('should restore body overflow to previous value', () => {
      document.body.style.overflow = 'auto';
      const restore = suspendOverflow();
      expect(document.body.style.overflow).toBe('hidden');
      restore();
      expect(document.body.style.overflow).toBe('auto');
    });

    it('should restore body overflow to empty string if it was empty', () => {
      const restore = suspendOverflow();
      expect(document.body.style.overflow).toBe('hidden');
      restore();
      expect(document.body.style.overflow).toBe('');
    });

    it('should target the nearest scrollable parent when element is provided', () => {
      const scrollable = document.createElement('div');
      // Mock scrollable dimensions
      Object.defineProperty(scrollable, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(scrollable, 'clientHeight', { value: 300, configurable: true });
      scrollable.style.overflow = 'scroll';

      const inner = document.createElement('div');
      scrollable.appendChild(inner);
      container.appendChild(scrollable);

      const restore = suspendOverflow(inner);
      expect(scrollable.style.overflow).toBe('hidden');
      restore();
      expect(scrollable.style.overflow).toBe('scroll');
    });

    it('should fall back to body when element has no scrollable parent', () => {
      const child = document.createElement('div');
      container.appendChild(child);

      const restore = suspendOverflow(child);
      expect(document.body.style.overflow).toBe('hidden');
      restore();
    });
  });

  describe('getNearestScrollableParent', () => {
    it('should return undefined when no element is provided', () => {
      expect(getNearestScrollable()).toBeUndefined();
    });

    it('should return undefined when element has no parent', () => {
      const orphan = document.createElement('div');
      expect(getNearestScrollable(orphan)).toBeUndefined();
    });

    it('should return undefined when no parent is scrollable', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      parent.appendChild(child);
      container.appendChild(parent);

      // jsdom defaults: scrollHeight === clientHeight (both 0), so not scrollable
      expect(getNearestScrollable(child)).toBeUndefined();
    });

    it('should return the nearest scrollable parent', () => {
      const scrollable = document.createElement('div');
      Object.defineProperty(scrollable, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(scrollable, 'clientHeight', { value: 300, configurable: true });

      const inner = document.createElement('div');
      scrollable.appendChild(inner);
      container.appendChild(scrollable);

      expect(getNearestScrollable(inner)).toBe(scrollable);
    });

    it('should return the closest scrollable ancestor when multiple exist', () => {
      const outer = document.createElement('div');
      Object.defineProperty(outer, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(outer, 'clientHeight', { value: 500, configurable: true });

      const inner = document.createElement('div');
      Object.defineProperty(inner, 'scrollHeight', { value: 400, configurable: true });
      Object.defineProperty(inner, 'clientHeight', { value: 200, configurable: true });

      const child = document.createElement('div');
      inner.appendChild(child);
      outer.appendChild(inner);
      container.appendChild(outer);

      expect(getNearestScrollable(child)).toBe(inner);
    });
  });
});
