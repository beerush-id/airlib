import { describe, expect, it } from 'vitest';
import { classx } from '../../src/utils/classx.js';

describe('classx', () => {
  describe('primitive inputs', () => {
    it('should return a plain string as-is', () => {
      expect(classx('foo bar')).toBe('foo bar');
    });

    it('should return empty string for empty string input', () => {
      expect(classx('')).toBe('');
    });

    it('should return empty string for false', () => {
      expect(classx(false)).toBe('');
    });

    it('should return "true" for true', () => {
      expect(classx(true)).toBe('true');
    });

    it('should return empty string for null', () => {
      expect(classx(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(classx(undefined)).toBe('');
    });
  });

  describe('array inputs', () => {
    it('should join multiple string classes with space', () => {
      expect(classx(['a', 'b', 'c'])).toBe('a b c');
    });

    it('should filter out falsy values from arrays', () => {
      expect(classx(['a', false, null, undefined, '', 'b'])).toBe('a b');
    });

    it('should return empty string for an empty array', () => {
      expect(classx([])).toBe('');
    });

    it('should handle nested arrays', () => {
      expect(classx(['a', ['b', 'c'], 'd'])).toBe('a b c d');
    });

    it('should handle deeply nested arrays', () => {
      expect(classx(['a', ['b', ['c', ['d']]]])).toBe('a b c d');
    });

    it('should handle arrays containing objects', () => {
      expect(classx(['base', { active: true, disabled: false }])).toBe('base active');
    });

    it('should handle arrays with only falsy values', () => {
      expect(classx([false, null, undefined, ''])).toBe('');
    });
  });

  describe('object inputs', () => {
    it('should return keys whose values are truthy', () => {
      expect(classx({ foo: true, bar: false, baz: 'yes' })).toBe('foo baz');
    });

    it('should return empty string when all values are falsy', () => {
      expect(classx({ a: false, b: null, c: undefined, d: '' })).toBe('');
    });

    it('should return empty string for an empty object', () => {
      expect(classx({})).toBe('');
    });

    it('should treat truthy numbers as active', () => {
      expect(classx({ visible: 1, hidden: 0 })).toBe('visible');
    });

    it('should handle objects nested inside arrays', () => {
      expect(classx([{ a: true }, { b: true, c: false }])).toBe('a b');
    });
  });

  describe('function provider', () => {
    it('should call a function provider and process its return value', () => {
      expect(classx(() => 'from-fn')).toBe('from-fn');
    });

    it('should process array returned by function provider', () => {
      expect(classx(() => ['x', 'y'])).toBe('x y');
    });

    it('should process object returned by function provider', () => {
      expect(classx(() => ({ active: true, disabled: false }))).toBe('active');
    });

    it('should handle function returning falsy value', () => {
      expect(classx(() => false)).toBe('');
      expect(classx(() => null)).toBe('');
      expect(classx(() => undefined)).toBe('');
    });
  });

  describe('mixed complex scenarios', () => {
    it('should handle a deeply mixed structure', () => {
      const result = classx(['base', { 'is-active': true, 'is-disabled': false }, ['nested-a', { 'nested-b': true }]]);
      expect(result).toBe('base is-active nested-a nested-b');
    });

    it('should handle provider returning mixed array', () => {
      const result = classx(() => ['root', { open: true, closed: false }, ['child']]);
      expect(result).toBe('root open child');
    });
  });
});
