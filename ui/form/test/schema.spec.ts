import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import type { AnyType } from '../src/index.js';
import { getSchemaByPath } from '../src/schema.js';

describe('getSchemaByPath', () => {
  it('should resolve shallow object properties', () => {
    const schema = z.object({ name: z.string() });
    const result = getSchemaByPath(schema, 'name');
    expect(result?.safeParse('valid').success).toBe(true);
  });

  it('should resolve deeply nested object properties', () => {
    const schema = z.object({
      user: z.object({
        profile: z.object({
          age: z.number(),
        }),
      }),
    });
    const result = getSchemaByPath(schema, 'user.profile.age');
    expect(result?.safeParse(25).success).toBe(true);
  });

  it('should resolve array elements by index', () => {
    const schema = z.object({ tags: z.array(z.string()) });
    const result = getSchemaByPath(schema, 'tags.0');
    expect(result?.safeParse('tag').success).toBe(true);
  });

  it('should resolve array elements by wildcard ($)', () => {
    const schema = z.object({ tags: z.array(z.string()) });
    const result = getSchemaByPath(schema, 'tags.$');
    expect(result?.safeParse('tag').success).toBe(true);
  });

  it('should resolve nested objects inside arrays', () => {
    const schema = z.object({
      users: z.array(z.object({ name: z.string() })),
    });
    const result = getSchemaByPath(schema, 'users.$.name');
    expect(result?.safeParse('alice').success).toBe(true);
  });

  it('should seamlessly unwrap modifier wrappers (Optional, Nullable, Default, Effects)', () => {
    const schema = z.object({
      user: z
        .object({
          opt: z.string().optional(),
          nullb: z.number().nullable(),
          def: z.boolean().default(false),
          eff: z.string().transform((v) => v),
        })
        .optional()
        .nullable()
        .default({} as never)
        .transform((v) => v),
    });

    // The traverser must unwrap the parent modifiers to get inside 'user',
    // then unwrap the child modifiers to return the base types.
    expect(getSchemaByPath(schema, 'user.opt')?.safeParse('valid').success).toBe(true);
    expect(getSchemaByPath(schema, 'user.nullb')?.safeParse(42).success).toBe(true);
    expect(getSchemaByPath(schema, 'user.def')?.safeParse(true).success).toBe(true);
    expect(getSchemaByPath(schema, 'user.eff')?.safeParse('transform').success).toBe(true);
  });

  it('should safely return undefined for non-existent properties', () => {
    const schema = z.object({ name: z.string() });
    expect(getSchemaByPath(schema, 'age')).toBeUndefined();
    expect(getSchemaByPath(schema, 'name.deep')).toBeUndefined();
    expect(getSchemaByPath(schema, 'age.deep')).toBeUndefined(); // Hits line 31 (!current)
  });

  it('should safely return undefined for invalid array paths', () => {
    const schema = z.object({ tags: z.array(z.string()) });
    // Arrays only accept numeric indexes or '$'
    expect(getSchemaByPath(schema, 'tags.invalid')).toBeUndefined();
  });

  it('should return the root schema for empty paths or "root"', () => {
    const schema = z.object({ name: z.string() });
    expect(getSchemaByPath(schema, '')).toBe(schema);
    expect(getSchemaByPath(schema, 'root')).toBe(schema);
  });

  describe('Legacy & Structural Fallbacks', () => {
    // These tests ensure that the function can traverse Zod structures from different versions
    // where properties like .shape or .element might be methods instead of objects, or located on _def.

    it('should resolve ZodObjects where shape is a function', () => {
      const legacyObj = {
        shape: () => ({ prop: z.number() }),
      } as AnyType;

      expect(getSchemaByPath(legacyObj, 'prop')?.safeParse(42).success).toBe(true);
    });

    it('should resolve ZodObjects where shape is an object', () => {
      const legacyObj = {
        shape: { prop: z.boolean() },
      } as AnyType;

      expect(getSchemaByPath(legacyObj, 'prop')?.safeParse(true).success).toBe(true);
    });

    it('should resolve ZodArrays where element is defined', () => {
      const legacyArr = {
        element: z.string(),
      } as AnyType;

      expect(getSchemaByPath(legacyArr, '0')?.safeParse('hello').success).toBe(true);
      expect(getSchemaByPath(legacyArr, '$')?.safeParse('hello').success).toBe(true);
    });

    it('should safely return undefined for broken object schemas missing shape completely', () => {
      const brokenObj = { _def: { typeName: 'ZodObject' } } as AnyType;
      expect(getSchemaByPath(brokenObj, 'prop')).toBeUndefined();
    });

    it('should safely return undefined if a legacy shape function returns null/undefined', () => {
      const brokenLegacyObj = {
        shape: () => null,
      } as AnyType;

      expect(getSchemaByPath(brokenLegacyObj, 'prop')).toBeUndefined();
    });

    it('should resolve legacy ZodDefault via removeDefault()', () => {
      const legacyDefault = { removeDefault: () => z.object({ prop: z.string() }) } as AnyType;
      expect(getSchemaByPath(legacyDefault, 'prop')?.safeParse('valid').success).toBe(true);
    });

    it('should resolve legacy ZodEffects via innerType()', () => {
      const legacyEffect = { innerType: () => z.object({ prop: z.number() }) } as AnyType;
      expect(getSchemaByPath(legacyEffect, 'prop')?.safeParse(42).success).toBe(true);
    });
  });
});
