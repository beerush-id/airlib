import { describe, expect, it, vi } from 'vitest';
import { impure } from '../../src/utils/state.js';

describe('state', () => {
  describe('impure', () => {
    it('should return mutable proxy for objects in browser', () => {
      const obj = { count: 0 };
      const state = impure(obj);

      expect(state.count).toBe(0);
      state.count++;
      expect(state.count).toBe(1);
    });

    it('should return a ref for primitives in browser', () => {
      const state = impure(0);
      expect(state.value).toBe(0);
      state.value++;
      expect(state.value).toBe(1);
    });

    it('should return raw object in non-browser environment', () => {
      vi.stubGlobal('window', undefined);
      const obj = { count: 0 };
      const state = impure(obj);

      expect(state).toBe(obj);
      vi.unstubAllGlobals();
    });

    it('should return {value} for primitives in non-browser environment', () => {
      vi.stubGlobal('window', undefined);
      const state = impure(0);
      expect(state.value).toBe(0);
      vi.unstubAllGlobals();
    });
  });
});
