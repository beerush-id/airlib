import { effect, mutable } from '@airlib/core';
import { createFocusTrap, type FocusTrapOptions } from '../utils/index.js';

export type FocusRefOptions = FocusTrapOptions;

/**
 * Creates a reactive DOM ref container that automatically activates and binds a focus trap
 * whenever an element is assigned to it.
 *
 * @param options - Focus trapping options including auto-focus and overflow trapping.
 * @returns A reactive mutable element reference container.
 */
export function focusRef<T extends HTMLElement>(options?: FocusRefOptions) {
  const elRef = mutable<{ current: T | null }>({ current: null });

  effect(() => {
    if (elRef.current) {
      return createFocusTrap(elRef.current, options);
    }
  });

  return elRef;
}
