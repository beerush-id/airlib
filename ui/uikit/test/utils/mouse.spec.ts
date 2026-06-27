import { beforeEach, describe, expect, it } from 'vitest';
import { getPointer, MousePointer, watchPointer } from '../../src/utils/mouse.js';

describe('mouse', () => {
  beforeEach(() => {
    getPointer().reset();
  });

  describe('MousePointer', () => {
    it('should reset its values', () => {
      const pointer = new MousePointer();
      pointer.x = 10;
      pointer.modifiers.add('shift');

      pointer.reset();
      expect(pointer.x).toBe(0);
      expect(pointer.modifiers.size).toBe(0);
    });
  });

  describe('watchPointer', () => {
    it('should track mouse movement', () => {
      const dispose = watchPointer();
      const pointer = getPointer();

      document.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 100,
          clientY: 200,
          screenX: 110,
          screenY: 210,
          movementX: 5,
          movementY: 10,
        })
      );

      expect(pointer.x).toBe(100);
      expect(pointer.y).toBe(200);
      expect(pointer.screenX).toBe(110);
      expect(pointer.screenY).toBe(210);
      expect(pointer.deltaX).toBe(5);
      expect(pointer.deltaY).toBe(10);

      dispose();
    });

    it('should track mouse buttons and modifiers', () => {
      const dispose = watchPointer();
      const pointer = getPointer();

      document.dispatchEvent(
        new MouseEvent('mousedown', {
          button: 2,
          altKey: true,
          ctrlKey: true,
          metaKey: true,
          shiftKey: true,
        })
      );

      expect(pointer.button).toBe(2);
      expect(pointer.modifiers.has('alt')).toBe(true);
      expect(pointer.modifiers.has('ctrl')).toBe(true);
      expect(pointer.modifiers.has('meta')).toBe(true);
      expect(pointer.modifiers.has('shift')).toBe(true);

      document.dispatchEvent(new MouseEvent('mouseup'));

      expect(pointer.button).toBeNull();
      expect(pointer.modifiers.size).toBe(0);

      dispose();
    });

    it('should clean up event listeners on dispose', () => {
      const dispose = watchPointer();
      const pointer = getPointer();

      dispose();

      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
      expect(pointer.x).toBe(0);
    });

    it('should return the same dispose function', () => {
      const dispose1 = watchPointer();
      const dispose2 = watchPointer();
      expect(dispose1).toBe(dispose2);
      dispose1();
    });
  });
});
