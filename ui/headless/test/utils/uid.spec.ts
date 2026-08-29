import { createLifecycle } from '@airlib/core';
import { describe, expect, it } from 'vitest';
import { uIndex } from '../../src/utils/uid.js';

describe('uid', () => {
  describe('uIndex', () => {
    it('should initialize and increment index sequence for symbol keys within a lifecycle context', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const keyA = Symbol('uid-a');
        const keyB = Symbol('uid-b');

        expect(uIndex(keyA)).toBe(1);
        expect(uIndex(keyA)).toBe(2);
        expect(uIndex(keyB)).toBe(1);
        expect(uIndex(keyA)).toBe(3);
      });
      scope.destroy();
    });
  });
});
