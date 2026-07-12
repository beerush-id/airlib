import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  captureSnapshot,
  getDocument,
  getFocusable,
  resolveEl,
  resolvePortalTarget,
  restoreSnapshot,
  subscribeEvent,
  watchDocument,
} from '../../src/utils/document.js';

describe('document utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('watchDocument & getDocument', () => {
    it('should track active element on focusin and focusout', () => {
      const dispose = watchDocument();
      const dispose2 = watchDocument();
      expect(dispose).toBe(dispose2);

      const input = document.createElement('input');
      container.appendChild(input);

      input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(getDocument().activeElement).toBe(input);

      input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      expect(getDocument().activeElement).toBeNull();

      dispose();
    });
  });

  describe('resolveEl', () => {
    it('should resolve HTMLElement or string selector or undefined', () => {
      const div = document.createElement('div');
      div.id = 'my-div';
      container.appendChild(div);

      expect(resolveEl(div)).toBe(div);
      expect(resolveEl('#my-div')).toBe(div);
      expect(resolveEl('#non-existent')).toBeUndefined();
      expect(resolveEl(null)).toBeUndefined();
      expect(resolveEl(undefined)).toBeUndefined();
    });
  });

  describe('resolvePortalTarget', () => {
    it('should resolve portal target correctly', () => {
      const div = document.createElement('div');
      div.id = 'portal-container';
      container.appendChild(div);

      expect(resolvePortalTarget(true)).toBe(document.body);
      expect(resolvePortalTarget(div)).toBe(div);
      expect(resolvePortalTarget('#portal-container')).toBe(div);
      expect(resolvePortalTarget('#non-existent')).toBeNull();
      expect(resolvePortalTarget(false as any)).toBeNull();
    });
  });

  describe('getFocusable', () => {
    it('should return empty array if container is null', () => {
      expect(getFocusable(null as any)).toEqual([]);
    });

    it('should return focusable children', () => {
      const btn = document.createElement('button');
      const input = document.createElement('input');
      const disabledBtn = document.createElement('button');
      disabledBtn.disabled = true;
      container.appendChild(btn);
      container.appendChild(input);
      container.appendChild(disabledBtn);

      const focusable = getFocusable(container);
      expect(focusable).toContain(btn);
      expect(focusable).toContain(input);
      expect(focusable).not.toContain(disabledBtn);
    });
  });

  describe('captureSnapshot & restoreSnapshot', () => {
    it('should capture and restore styles, variables, attributes, and DOM hierarchy', () => {
      const parent1 = document.createElement('div');
      const parent2 = document.createElement('div');
      const sibling = document.createElement('span');
      const el = document.createElement('div');

      parent1.appendChild(sibling);
      parent1.insertBefore(el, sibling);
      container.appendChild(parent1);
      container.appendChild(parent2);

      el.style.position = 'absolute';
      el.style.left = '10px';
      el.style.top = '20px';
      el.style.setProperty('--test-x', '100px');
      el.setAttribute('data-test-open', '');

      const snapshot = captureSnapshot(el, { cssPrefix: '--test', attrPrefix: 'data-test' });

      // Modify element
      el.style.position = 'fixed';
      el.style.left = '50px';
      el.style.removeProperty('--test-x');
      el.removeAttribute('data-test-open');
      parent2.appendChild(el);

      restoreSnapshot(el, snapshot);

      expect(el.style.position).toBe('fixed');
      expect(el.style.left).toBe('10px');
      expect(el.style.getPropertyValue('--test-x')).toBe('100px');
      expect(el.hasAttribute('data-test-open')).toBe(true);
      expect(el.parentElement).toBe(parent1);
      expect(el.nextSibling).toBe(sibling);
    });

    it('should restore element via appendChild when nextSibling is null', () => {
      const parent = document.createElement('div');
      const el = document.createElement('div');
      parent.appendChild(el);
      container.appendChild(parent);

      const snapshot = captureSnapshot(el, {});
      el.remove();

      restoreSnapshot(el, snapshot);
      expect(el.parentElement).toBe(parent);
      expect(el.nextSibling).toBeNull();
    });
  });

  describe('subscribeEvent', () => {
    it('should subscribe and unsubscribe event listener', () => {
      const fn = vi.fn();
      const unsubscribe = subscribeEvent(container, 'click', fn);

      container.dispatchEvent(new MouseEvent('click'));
      expect(fn).toHaveBeenCalledTimes(1);

      unsubscribe();
      container.dispatchEvent(new MouseEvent('click'));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
