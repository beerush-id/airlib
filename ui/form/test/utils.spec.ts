import { describe, expect, it } from 'vitest';
import type { AnyType } from '../src/index.js';
import { writePath } from '../src/utils.js';

describe('writePath', () => {
  it('should bail safely if object is null or undefined', () => {
    const obj: AnyType = undefined;
    writePath(obj, 'name', 'Bob');
    expect(obj).toBeUndefined(); // Hits line 2
  });

  it('should write shallow properties', () => {
    const obj: AnyType = {};
    writePath(obj, 'name', 'Bob');
    expect(obj.name).toBe('Bob');
  });

  it('should dynamically create deep objects when writing', () => {
    const obj: AnyType = {};
    writePath(obj, 'user.profile.age', 25);
    expect(obj.user.profile.age).toBe(25);
  });

  it('should dynamically create arrays when writing to numeric paths', () => {
    const obj: AnyType = {};
    writePath(obj, 'users.0.name', 'Alice');
    expect(Array.isArray(obj.users)).toBe(true); // Hits line 8 true branch for array creation
    expect(obj.users[0].name).toBe('Alice');
  });
});
