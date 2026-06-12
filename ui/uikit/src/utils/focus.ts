import { effect, isBrowser, microtask, mutable } from '@anchorlib/core';
import { KIT_CONFIGS } from '../config.js';
import { suspendOverflow } from './scroll.js';

export type FocusTrapOptions = {
  onRelease?: (e: MouseEvent | KeyboardEvent) => void;
  autofocus?: boolean;
  trapOverflow?: boolean;
};

export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function focusRef<T extends HTMLElement>(options?: FocusTrapOptions) {
  const elRef = mutable<{ current: T | null }>({ current: null });

  effect(() => {
    if (elRef.current) {
      return createFocusTrap(elRef.current, options);
    }
  });

  return elRef;
}

export function createFocusTrap(container: HTMLElement, options?: FocusTrapOptions) {
  if (!isBrowser() || !container) return () => {};

  const { autofocus = KIT_CONFIGS.autofocus, trapOverflow = KIT_CONFIGS.trapOverflow, onRelease } = options || {};
  const focusArea = container.querySelector('[data-focus-area]') ?? container;
  const prevFocusElement: HTMLElement | undefined = document.activeElement as HTMLElement;
  const releaseOverflow = trapOverflow ? suspendOverflow(prevFocusElement) : () => {};
  const [schedule, cancel] = microtask(5);

  if (autofocus) {
    requestAnimationFrame(() => focusFrom(container));
    schedule(() => focusFrom(container));
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onRelease?.(e);
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements(container);
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
    if (focusArea.contains(e.target as Node)) return;
    onRelease?.(e);
  };

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('mouseup', handleClickOutside);

  return () => {
    cancel();
    releaseOverflow();
    if (autofocus) prevFocusElement?.focus();
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mouseup', handleClickOutside);
  };
}

export function focusFrom(parent: HTMLElement) {
  const focusable = parent.querySelector(FOCUSABLE_SELECTORS) as HTMLElement;
  focusable ? focusable.focus() : parent.focus();
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));
}
