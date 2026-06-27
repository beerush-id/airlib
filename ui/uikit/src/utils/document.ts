import type { StateUnsubscribe } from '@anchorlib/core';
import { ATTR_SUFFIXES, CSS_SUFFIXES } from './rect.js';
import { impure } from './state.js';

export type ElementSnapshot = {
  styles: Map<string, string>;
  vars: Map<string, string>;
  attrs: Map<string, string | null>;
  parent: HTMLElement | null;
  nextSibling: Node | null;
  activeElement: HTMLElement | null;
};

/**
 * Initializes global document focus tracking to monitor the currently active element.
 *
 * @returns A state subscription cleanup function.
 */
export function watchDocument() {
  if (disposeDocument) return disposeDocument;

  const handleFocus = (e: FocusEvent) => {
    currentDoc.activeElement = e.target as HTMLElement;
  };
  const handleBlur = () => {
    currentDoc.activeElement = null;
  };

  document.addEventListener('focusin', handleFocus);
  document.addEventListener('focusout', handleBlur);

  disposeDocument = () => {
    document.removeEventListener('focusin', handleFocus);
    document.removeEventListener('focusout', handleBlur);
    disposeDocument = null;
  };

  return disposeDocument;
}

/**
 * Retrieves the reactive global document instance.
 *
 * @returns The active LiveDocument state container.
 */
export function getDocument() {
  return currentDoc;
}

/**
 * Resolves an element reference from either a DOM node or a CSS selector string.
 *
 * @param ref - An HTMLElement, selector string, undefined, or null.
 * @returns The resolved HTMLElement, or undefined if unavailable.
 */
export function resolveEl(ref: HTMLElement | string | undefined | null): HTMLElement | undefined {
  if (!ref) return undefined;
  if (typeof ref === 'string') {
    return (document.querySelector(ref) as HTMLElement) ?? undefined;
  }
  return ref;
}

/**
 * Resolves the target container element for rendering a DOM portal.
 *
 * @param portal - True for document.body, an explicit HTMLElement, or a selector string.
 * @returns The target container HTMLElement, or null if unresolvable.
 */
export function resolvePortalTarget(portal: boolean | HTMLElement | string): HTMLElement | null {
  if (portal === true) return document.body;
  if (portal instanceof HTMLElement) return portal;
  if (typeof portal === 'string') return document.querySelector(portal);
  return null;
}

/**
 * Queries a parent element for all interactive child elements matching standard accessibility selectors.
 *
 * @param container - The DOM container to query within.
 * @param selector - Optional custom query selector string.
 * @returns An array of matching focusable HTMLElement nodes.
 */
export function getFocusable(container: HTMLElement, selector?: string): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(selector ?? FOCUSABLE_SELECTORS));
}

export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Captures an element's inline positioning styles, custom properties, and tree location
 * to allow subsequent restoration.
 *
 * @param el - The HTMLElement to snapshot.
 * @param options - Prefixes for custom properties and attributes to include.
 * @returns An ElementSnapshot container.
 */
export function captureSnapshot(
  el: HTMLElement,
  options: { cssPrefix?: string; attrPrefix?: string }
): ElementSnapshot {
  const styles = new Map<string, string>();
  const vars = new Map<string, string>();
  const attrs = new Map<string, string | null>();

  for (const p of ['position', 'left', 'top'] as const) styles.set(p, el.style[p]);

  if (options.cssPrefix) {
    for (const k of CSS_SUFFIXES) {
      const name = `${options.cssPrefix}${k}`;
      vars.set(name, el.style.getPropertyValue(name));
    }
  }

  if (options.attrPrefix) {
    for (const k of ATTR_SUFFIXES) {
      const name = `${options.attrPrefix}${k}`;
      attrs.set(name, el.getAttribute(name));
    }
  }

  return {
    styles,
    vars,
    attrs,
    parent: el.parentElement,
    nextSibling: el.nextSibling,
    activeElement: document.activeElement as HTMLElement | null,
  };
}

/**
 * Restores an element's inline styles, DOM hierarchy position, and focus state from a snapshot.
 *
 * @param el - The target HTMLElement to restore.
 * @param s - The snapshot previously captured via captureSnapshot.
 */
export function restoreSnapshot(el: HTMLElement, s: ElementSnapshot) {
  for (const [p, v] of s.styles) el.style.setProperty(p, v);
  for (const [n, v] of s.vars) v ? el.style.setProperty(n, v) : el.style.removeProperty(n);
  for (const [n, v] of s.attrs) v === null ? el.removeAttribute(n) : el.setAttribute(n, v);

  if (s.parent && el.parentElement !== s.parent) {
    s.nextSibling ? s.parent.insertBefore(el, s.nextSibling) : s.parent.appendChild(el);
  }

  s.activeElement?.focus();
}

/**
 * Subscribes an event listener to a DOM target and returns an unsubscribe teardown function.
 *
 * @param target - Event target object.
 * @param event - Name of the event.
 * @param handler - Event callback listener.
 * @returns A teardown function to detach the listener.
 */
export function subscribeEvent(target: EventTarget, event: string, handler: EventListener): () => void {
  target.addEventListener(event, handler);
  return () => target.removeEventListener(event, handler);
}

export class LiveDocument {
  public activeElement: HTMLElement | null = null;
}

const currentDoc = impure(new LiveDocument());
let disposeDocument: StateUnsubscribe | null = null;
