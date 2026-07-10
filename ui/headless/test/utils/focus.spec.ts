import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KIT_CONFIGS } from '../../src/config.js';
import { createFocusTrap, focusFrom } from '../../src/utils/focus.js';

describe('createFocusTrap', () => {
  let container: HTMLDivElement;
  let btn1: HTMLButtonElement;
  let btn2: HTMLButtonElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    // Reset KIT_CONFIGS to defaults
    KIT_CONFIGS.autofocus = true;
    KIT_CONFIGS.trapOverflow = true;

    document.body.innerHTML = '';
    document.body.style.overflow = '';

    container = document.createElement('div');
    btn1 = document.createElement('button');
    btn1.textContent = 'Btn1';
    btn2 = document.createElement('button');
    btn2.textContent = 'Btn2';
    input = document.createElement('input');

    container.appendChild(btn1);
    container.appendChild(btn2);
    container.appendChild(input);
    document.body.appendChild(container);

    // Make requestAnimationFrame synchronous for testing
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    container.remove();
  });

  describe('basic lifecycle', () => {
    it('should return a cleanup function', () => {
      const release = createFocusTrap(container);
      expect(typeof release).toBe('function');
      release();
    });

    it('should return a no-op when container is null', () => {
      const release = createFocusTrap(null as AnyType);
      expect(typeof release).toBe('function');
      // should not throw
      release();
    });
  });

  describe('Escape key', () => {
    it('should call onRelease when Escape is pressed', () => {
      const onRelease = vi.fn();
      const release = createFocusTrap(container, { onRelease });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onRelease).toHaveBeenCalledOnce();

      release();
    });

    it('should not call onRelease for non-Escape/Tab keys', () => {
      const onRelease = vi.fn();
      const release = createFocusTrap(container, { onRelease });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      expect(onRelease).not.toHaveBeenCalled();

      release();
    });
  });

  describe('Tab key trapping', () => {
    it('should wrap focus from last to first on Tab', () => {
      const release = createFocusTrap(container, { autofocus: false });

      // Focus the last element
      input.focus();
      expect(document.activeElement).toBe(input);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(document.activeElement).toBe(btn1);

      release();
    });

    it('should wrap focus from first to last on Shift+Tab', () => {
      const release = createFocusTrap(container, { autofocus: false });

      btn1.focus();
      expect(document.activeElement).toBe(btn1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
      expect(document.activeElement).toBe(input);

      release();
    });

    it('should not interfere with Tab when focus is in the middle', () => {
      const release = createFocusTrap(container, { autofocus: false });

      btn2.focus();
      const preventDefaultSpy = vi.fn();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      vi.spyOn(event, 'preventDefault').mockImplementation(preventDefaultSpy);

      document.dispatchEvent(event);
      // preventDefault should NOT have been called for middle elements
      expect(preventDefaultSpy).not.toHaveBeenCalled();

      release();
    });

    it('should preventDefault and trap when container has no focusable elements', () => {
      const empty = document.createElement('div');
      document.body.appendChild(empty);

      const release = createFocusTrap(empty, { autofocus: false });

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();

      release();
      empty.remove();
    });
  });

  describe('click outside', () => {
    it('should call onRelease when clicking outside the container', () => {
      const onRelease = vi.fn();
      const release = createFocusTrap(container, { onRelease });

      const outside = document.createElement('div');
      document.body.appendChild(outside);

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      // The event target defaults to window, which is outside the container
      expect(onRelease).toHaveBeenCalled();

      release();
      outside.remove();
    });

    it('should NOT call onRelease when clicking inside the container', () => {
      const onRelease = vi.fn();
      const release = createFocusTrap(container, { onRelease });

      container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(onRelease).not.toHaveBeenCalled();

      release();
    });

    it('should NOT call onRelease when clicking on a child of the container', () => {
      const onRelease = vi.fn();
      const release = createFocusTrap(container, { onRelease });

      btn1.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(onRelease).not.toHaveBeenCalled();

      release();
    });
  });

  describe('autofocus', () => {
    it('should focus the first focusable element when autofocus is true', () => {
      const release = createFocusTrap(container, { autofocus: true });
      expect(document.activeElement).toBe(btn1);
      release();
    });

    it('should focus the container itself when no focusable elements exist', () => {
      const empty = document.createElement('div');
      empty.tabIndex = -1;
      document.body.appendChild(empty);

      const release = createFocusTrap(empty, { autofocus: true });
      expect(document.activeElement).toBe(empty);

      release();
      empty.remove();
    });

    it('should NOT autofocus when option is false', () => {
      const prevFocused = document.createElement('input');
      document.body.appendChild(prevFocused);
      prevFocused.focus();

      const release = createFocusTrap(container, { autofocus: false });
      expect(document.activeElement).toBe(prevFocused);

      release();
      prevFocused.remove();
    });

    it('should respect KIT_CONFIGS.autofocus default', () => {
      KIT_CONFIGS.autofocus = false;
      const prevFocused = document.createElement('input');
      document.body.appendChild(prevFocused);
      prevFocused.focus();

      const release = createFocusTrap(container);
      expect(document.activeElement).toBe(prevFocused);

      release();
      prevFocused.remove();
    });
  });

  describe('trapOverflow', () => {
    it('should suspend body overflow when trapOverflow is true', () => {
      const release = createFocusTrap(container, { trapOverflow: true });
      expect(document.body.style.overflow).toBe('hidden');
      release();
      expect(document.body.style.overflow).toBe('');
    });

    it('should NOT suspend overflow when trapOverflow is false', () => {
      document.body.style.overflow = 'auto';
      const release = createFocusTrap(container, { trapOverflow: false });
      expect(document.body.style.overflow).toBe('auto');
      release();
    });

    it('should respect KIT_CONFIGS.trapOverflow default', () => {
      KIT_CONFIGS.trapOverflow = false;
      document.body.style.overflow = 'auto';
      const release = createFocusTrap(container);
      expect(document.body.style.overflow).toBe('auto');
      release();
    });
  });

  describe('data-focus-area', () => {
    it('should use [data-focus-area] element as click boundary when present', () => {
      const onRelease = vi.fn();
      const focusArea = document.createElement('div');
      focusArea.setAttribute('data-focus-area', '');
      container.appendChild(focusArea);

      const innerBtn = document.createElement('button');
      focusArea.appendChild(innerBtn);

      const release = createFocusTrap(container, { onRelease, autofocus: false });

      // Clicking inside focus-area should not trigger onRelease
      innerBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(onRelease).not.toHaveBeenCalled();

      // Clicking on container (outside focus-area) should trigger onRelease
      container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(onRelease).toHaveBeenCalled();

      release();
    });
  });

  describe('cleanup', () => {
    it('should remove event listeners on release', () => {
      const onRelease = vi.fn();
      const release = createFocusTrap(container, { onRelease });
      release();

      // After release, events should no longer trigger onRelease
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onRelease).not.toHaveBeenCalled();
    });

    it('should restore focus to previously focused element on cleanup', () => {
      const prevFocus = document.createElement('input');
      document.body.appendChild(prevFocus);
      prevFocus.focus();
      expect(document.activeElement).toBe(prevFocus);

      const release = createFocusTrap(container, { autofocus: true });
      expect(document.activeElement).toBe(btn1);

      release();
      expect(document.activeElement).toBe(prevFocus);

      prevFocus.remove();
    });

    it('should restore overflow on cleanup', () => {
      document.body.style.overflow = 'auto';
      const release = createFocusTrap(container, { trapOverflow: true });
      expect(document.body.style.overflow).toBe('hidden');
      release();
      expect(document.body.style.overflow).toBe('auto');
    });
  });
});

describe('focusFrom', () => {
  it('should focus the first focusable element inside the parent container', () => {
    const parent = document.createElement('div');
    const input = document.createElement('input');
    parent.appendChild(input);
    document.body.appendChild(parent);

    focusFrom(parent);
    expect(document.activeElement).toBe(input);
    parent.remove();
  });

  it('should fall back to focusing the parent container if no focusable child exists', () => {
    const parent = document.createElement('div');
    parent.tabIndex = 0;
    document.body.appendChild(parent);

    focusFrom(parent);
    expect(document.activeElement).toBe(parent);
    parent.remove();
  });
});
