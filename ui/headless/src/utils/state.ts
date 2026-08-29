import type { MutableRef, Primitive, StateOptions } from '@airlib/core';
import { isBrowser, linkable, mutable } from '@airlib/core';
import type { AnyType } from '../types.js';

/**
 * Creates a browser only reactive state.
 * This utility is for library authors as an escape hatch for warning suppression.
 * Don't use for general purpose state creation.
 */
export function impure<T>(init: T, options?: StateOptions): T extends Primitive ? MutableRef<T> : T {
  if (linkable(init)) {
    return isBrowser() ? mutable(init as AnyType, options) : (init as AnyType);
  }

  return isBrowser() ? mutable(init as AnyType, options) : ({ value: init } as AnyType);
}
