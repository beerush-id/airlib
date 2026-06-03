import { describe, expect, it } from 'vitest';
import { z, ZodError } from 'zod';
import { flattenData, unflattenData, flattenError } from '../src/flatten.js';

describe('Flatten & Unflatten Utilities', () => {
  describe('flattenData', () => {
    it('should flatten nested objects into dot-notation paths', () => {
      const store: Record<string, any> = {};
      flattenData(store, { user: { name: 'Alice', age: 25 } });

      expect(store['user.name']).toBe('Alice');
      expect(store['user.age']).toBe(25);
    });

    it('should flatten arrays into index-based paths', () => {
      const store: Record<string, any> = {};
      flattenData(store, { tags: ['js', 'ts'] });

      expect(store['tags.0']).toBe('js');
      expect(store['tags.1']).toBe('ts');
    });

    it('should handle root-level arrays correctly', () => {
      const store: Record<string, any> = {};
      flattenData(store, ['a', 'b']);

      expect(store['0']).toBe('a');
      expect(store['1']).toBe('b');
    });

    it('should preserve empty objects and arrays', () => {
      const store: Record<string, any> = {};
      flattenData(store, { emptyObj: {}, emptyArr: [] });

      expect(store['emptyObj']).toEqual({});
      expect(store['emptyArr']).toEqual([]);
    });

    it('should preserve Date objects and null values as scalars', () => {
      const store: Record<string, any> = {};
      const date = new Date();
      flattenData(store, { nullValue: null, dateValue: date });

      expect(store['nullValue']).toBeNull();
      expect(store['dateValue']).toBe(date);
    });
  });

  describe('unflattenData', () => {
    it('should rebuild nested objects from dot-notation paths', () => {
      const store: Record<string, any> = {
        'user.name': 'Alice',
        'user.age': 25,
      };
      const result = unflattenData(store);

      expect(result).toEqual({ user: { name: 'Alice', age: 25 } });
    });

    it('should rebuild arrays from numeric index paths', () => {
      const store: Record<string, any> = {
        'tags.0': 'js',
        'tags.1': 'ts',
      };
      const result = unflattenData(store);

      expect(result).toEqual({ tags: ['js', 'ts'] });
    });

    it('should handle empty stores by returning an empty object', () => {
      const store: Record<string, any> = {};
      const result = unflattenData(store);

      expect(result).toEqual({});
    });

    it('should handle root scalar updates', () => {
      const store: Record<string, any> = { root: 'primitive' };
      const result = unflattenData(store);

      expect(result).toBe('primitive');
    });
  });

  describe('flattenError', () => {
    it('should flatten ZodError issues into an array of messages mapped by path', () => {
      const store: Record<string, string[]> = {};
      const schema = z.object({
        user: z.object({
          name: z.string().min(3, 'Too short'),
          age: z.number().min(18, 'Too young'),
        }),
      });

      const validation = schema.safeParse({ user: { name: 'Al', age: 10 } });
      if (!validation.success) {
        flattenError(store, validation.error);
      }

      expect(store['user.name']).toEqual(['Too short']);
      expect(store['user.age']).toEqual(['Too young']);
    });

    it('should aggregate multiple errors for the exact same path', () => {
      const store: Record<string, string[]> = {};
      const schema = z.object({
        password: z.string().min(8, 'Too short').regex(/[A-Z]/, 'Needs uppercase'),
      });

      const validation = schema.safeParse({ password: 'short' });
      if (!validation.success) {
        flattenError(store, validation.error);
      }

      expect(store['password']).toHaveLength(2);
      expect(store['password']).toContain('Too short');
      expect(store['password']).toContain('Needs uppercase');
    });
  });
});
