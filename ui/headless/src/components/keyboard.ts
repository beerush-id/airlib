import { effect, mutable } from '@airlib/core';
import { getFocusable } from '../utils/index.js';

export type ArrowRefOptions = {
  direction?: 'vertical' | 'horizontal' | 'both';
  focusable?: string;
};

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

      const isRepeatedChar = searchQuery.split('').every((char) => char === searchQuery[0]);
      const searchStr = isRepeatedChar ? searchQuery[0] : searchQuery;

      const currentText = current !== -1 ? focusable[current].textContent?.trim().toLowerCase() || '' : '';
      const startNext = isRepeatedChar && currentText.startsWith(searchStr);
      const searchStart = startNext ? startIndex + 1 : startIndex;

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
