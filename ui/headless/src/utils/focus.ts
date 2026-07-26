import { isBrowser, microtask } from '@anchorlib/core';
import { KIT_CONFIGS } from '../config.js';
import { FOCUSABLE_SELECTORS, getFocusable } from './document.js';
import { suspendOverflow } from './scroll.js';

export { FOCUSABLE_SELECTORS };

export type FocusTrapOptions = {
  onRelease?: (e: MouseEvent | KeyboardEvent) => void;
  area?: string;
  autofocus?: boolean;
  trapOverflow?: boolean;
  releaseOnEsc?: boolean;
  releaseOnClickOutside?: boolean;
};

const CURRENT_TRAP_CONTAINERS: HTMLElement[] = [];

/**
 * Traps keyboard navigation (Tab and Shift+Tab) within a specified DOM container.
 * Optionally focuses the initial interactive child and restores prior focus upon release.
 *
 * @param container - Target DOM element containing focusable elements.
 * @param options - Configuration for escape release, click-outside release, and scroll lock.
 * @returns Teardown callback function that removes event listeners and restores state.
 */
export function createFocusTrap(container: HTMLElement, options?: FocusTrapOptions) {
  if (!isBrowser() || !container) return () => {};

  CURRENT_TRAP_CONTAINERS.push(container);

  const {
    area = '[role="region"]',
    autofocus = KIT_CONFIGS.autofocus,
    trapOverflow = KIT_CONFIGS.trapOverflow,
    releaseOnEsc = true,
    releaseOnClickOutside = true,
    onRelease,
  } = options || {};
  const focusArea = container.querySelector(area) ?? container;
  const prevFocusElement: HTMLElement | undefined = document.activeElement as HTMLElement;
  const releaseOverflow = trapOverflow ? suspendOverflow(prevFocusElement) : () => {};
  const [schedule, cancel] = microtask(5);

  if (autofocus) {
    requestAnimationFrame(() => focusFrom(container));
    schedule(() => focusFrom(container));
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (CURRENT_TRAP_CONTAINERS[CURRENT_TRAP_CONTAINERS.length - 1] !== container) return;

    if (e.key === 'Escape' && releaseOnEsc) {
      onRelease?.(e);
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = getFocusable(container);
    if (!focusable.length) {
      e.preventDefault();
      return;
    }

    const firstFocusable = focusable[0] as HTMLElement;
    const lastFocusable = focusable[focusable.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (CURRENT_TRAP_CONTAINERS[CURRENT_TRAP_CONTAINERS.length - 1] !== container) return;

    if (focusArea.contains(e.target as Node)) return;
    onRelease?.(e);
  };

  document.addEventListener('keydown', handleKeydown);
  if (releaseOnClickOutside) {
    document.addEventListener('mouseup', handleClickOutside);
  }

  return () => {
    const idx = CURRENT_TRAP_CONTAINERS.indexOf(container);
    if (idx !== -1) CURRENT_TRAP_CONTAINERS.splice(idx, 1);

    cancel();
    releaseOverflow();
    if (autofocus) prevFocusElement?.focus();
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mouseup', handleClickOutside);
  };
}

/**
 * Searches a parent element for the first interactive element and sets browser focus to it.
 * Falls back to focusing the parent container itself if no interactive children exist.
 *
 * @param parent - The container element to search within.
 */
export function focusFrom(parent: HTMLElement) {
  const active = parent.querySelector(
    '[aria-selected="true"], [aria-checked="true"], [data-active="true"]'
  ) as HTMLElement;
  if (active && active.tabIndex !== -1) {
    active.focus();
    return;
  }

  const focusable = parent.querySelector(FOCUSABLE_SELECTORS) as HTMLElement;
  focusable ? focusable.focus() : parent.focus();
}
