import { beforeEach, describe, expect, it } from 'vitest';
import { getKeyboard, watchKeyboard } from '../../src/utils/keyboard.js';

describe('keyboard', () => {
  beforeEach(() => {
    const kb = getKeyboard();
    kb.clear();
  });

  describe('watchKeyboard', () => {
    it('should track keydown and keyup events', () => {
      const dispose = watchKeyboard();
      const kb = getKeyboard();

      expect(kb.size).toBe(0);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      expect(kb.has('a')).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
      expect(kb.has('a')).toBe(false);

      dispose();
    });

    it('should ignore duplicated keydown events', () => {
      const dispose = watchKeyboard();
      const kb = getKeyboard();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
      expect(kb.size).toBe(1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
      expect(kb.size).toBe(1);

      dispose();
    });

    it('should ignore unregistering non-tracked keys', () => {
      const dispose = watchKeyboard();
      const kb = getKeyboard();

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'c' }));
      expect(kb.size).toBe(0);

      dispose();
    });

    it('should handle uppercase keys by lowercasing them', () => {
      const dispose = watchKeyboard();
      const kb = getKeyboard();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
      expect(kb.has('a')).toBe(true);

      dispose();
    });

    it('should clean up tracked keys on window blur', () => {
      const dispose = watchKeyboard();
      const kb = getKeyboard();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'shift' }));
      expect(kb.has('shift')).toBe(true);

      window.dispatchEvent(new Event('blur'));
      expect(kb.size).toBe(0);

      dispose();
    });

    it('should stop tracking after dispose is called', () => {
      const dispose = watchKeyboard();
      const kb = getKeyboard();

      dispose();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
      expect(kb.has('d')).toBe(false);
    });

    it('should return the same dispose function on multiple calls', () => {
      const dispose1 = watchKeyboard();
      const dispose2 = watchKeyboard();

      expect(dispose1).toBe(dispose2);

      dispose1();
    });
  });
});
