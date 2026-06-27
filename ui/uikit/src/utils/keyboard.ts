import { effect, mutable, type StateUnsubscribe } from '@anchorlib/core';
import { getFocusable } from './document.js';
import type { MouseModifier } from './mouse.js';
import { impure } from './state.js';

export type ArrowRefOptions = {
  direction?: 'vertical' | 'horizontal' | 'both';
  focusable?: string;
};

/**
 * Initializes global window and document keyboard tracking to record currently pressed keys.
 * Automatically clears state on window blur events.
 *
 * @returns A state subscription teardown function.
 */
export function watchKeyboard() {
  if (disposeKeyboard) return disposeKeyboard;

  const cleanup = () => {
    currentKeyboard.clear();
  };
  const register = (e: KeyboardEvent) => {
    currentKeyboard.pressed = true;

    const key = e.key.toLowerCase();
    if (currentKeyboard.has(key)) return;
    currentKeyboard.add(key);
  };
  const unregister = (e: KeyboardEvent) => {
    currentKeyboard.pressed = false;

    const key = e.key.toLowerCase();
    if (!currentKeyboard.has(key)) return;
    currentKeyboard.delete(key);
  };

  window.addEventListener('blur', cleanup);
  document.addEventListener('keydown', register);
  document.addEventListener('keyup', unregister);

  disposeKeyboard = () => {
    window.removeEventListener('blur', cleanup);
    document.removeEventListener('keydown', register);
    document.removeEventListener('keyup', unregister);

    disposeKeyboard = undefined;
  };

  return disposeKeyboard;
}

/**
 * Retrieves the global reactive keyboard tracking set container.
 *
 * @returns The LiveKeyboard state instance.
 */
export function getKeyboard() {
  return currentKeyboard;
}

/**
 * Creates a reactive DOM ref container that enables directional arrow key navigation (up, down, left, right),
 * home/end jumping, and typeahead character searching across focusable children.
 *
 * @param options - Navigation configuration specifying allowed direction axes and custom child selectors.
 * @returns A reactive mutable element reference container.
 */
export function arrowRef<T extends HTMLElement>(options: ArrowRefOptions = {}) {
  if (!options || typeof options !== 'object') options = {};

  const state = mutable<{ current: T | null }>({ current: null });

  const getFocusableState = () => {
    const focusable = getFocusable(state.current!, options.focusable);
    if (!focusable.length) return { focusable: [], current: -1 };

    const currentFocus = focusable.indexOf(document.activeElement as HTMLElement);
    return { focusable, current: currentFocus };
  };

  const nextFocus = () => {
    const { focusable, current } = getFocusableState();
    const nextIndex = current === -1 || current >= focusable.length - 1 ? 0 : current + 1;
    focusable[nextIndex]?.focus();
  };

  const prevFocus = () => {
    const { focusable, current } = getFocusableState();
    if (current === -1 && document.activeElement !== state.current) return;
    const prevIndex = current <= 0 ? focusable.length - 1 : current - 1;
    focusable[prevIndex]?.focus();
  };

  let searchQuery = '';
  let searchTimeout: ReturnType<typeof setTimeout>;

  const handleKeyDown = (e: KeyboardEvent) => {
    const { direction = 'both' } = options;

    const isNext =
      (direction !== 'vertical' && e.key === 'ArrowRight') || (direction !== 'horizontal' && e.key === 'ArrowDown');

    const isPrev =
      (direction !== 'vertical' && e.key === 'ArrowLeft') || (direction !== 'horizontal' && e.key === 'ArrowUp');

    if (isNext) {
      e.preventDefault();
      nextFocus();
    } else if (isPrev) {
      e.preventDefault();
      prevFocus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      const { focusable } = getFocusableState();
      focusable[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const { focusable } = getFocusableState();
      focusable[focusable.length - 1]?.focus();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Typeahead search
      searchQuery += e.key.toLowerCase();
      const { focusable, current } = getFocusableState();

      const startIndex = current === -1 ? 0 : current;
      let matchedIndex = -1;

      // If typing the same character repeatedly, cycle to the next match.
      // Otherwise, search the full string starting from the current item.
      const isCycling = searchQuery.length > 1 && searchQuery.split('').every((char) => char === searchQuery[0]);
      const searchStr = isCycling ? searchQuery[0] : searchQuery;
      const searchStart = isCycling ? startIndex + 1 : startIndex;

      for (let i = 0; i < focusable.length; i++) {
        const index = (searchStart + i) % focusable.length;
        const text = focusable[index].textContent?.trim().toLowerCase() || '';

        if (text.startsWith(searchStr)) {
          matchedIndex = index;
          break;
        }
      }

      if (matchedIndex !== -1) {
        focusable[matchedIndex]?.focus();
      }

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = '';
      }, 500);
    }
  };

  effect.client(() => {
    const element = state.current;
    if (!element) return;

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(searchTimeout);
      element!.removeEventListener('keydown', handleKeyDown);
    };
  });

  return state;
}

export class LiveKeyboard extends Set<string | MouseModifier> {
  public pressed = false;
}

const currentKeyboard = impure(new LiveKeyboard());
let disposeKeyboard: StateUnsubscribe | undefined;
