import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KIT_CONFIGS } from '../../src/config.js';
import { type AnyType, focusRef } from '../../src/index.js';
import { createFocusTrap } from '../../src/utils/focus.js';

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

describe('focusRef', () => {
  let container: HTMLDivElement;
  let btn1: HTMLButtonElement;
  let btn2: HTMLButtonElement;

  beforeEach(() => {
    KIT_CONFIGS.autofocus = true;
    KIT_CONFIGS.trapOverflow = true;

    document.body.innerHTML = '';
    document.body.style.overflow = '';

    container = document.createElement('div');
    btn1 = document.createElement('button');
    btn2 = document.createElement('button');
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    container.remove();
  });

  it('should return a ref with current initially null', () => {
    const ref = focusRef();
    expect(ref.current).toBeNull();
  });

  it('should activate focus trap when current is set to an element', () => {
    const onRelease = vi.fn();
    const ref = focusRef<HTMLDivElement>({ onRelease, autofocus: false });

    ref.current = container;

    // Trap should be active: Escape should trigger onRelease
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onRelease).toHaveBeenCalledOnce();

    ref.current = null;
  });

  it('should suspend overflow when current is set and trapOverflow is true', () => {
    const ref = focusRef<HTMLDivElement>({ autofocus: false, trapOverflow: true });

    ref.current = container;
    expect(document.body.style.overflow).toBe('hidden');

    ref.current = null;
    expect(document.body.style.overflow).toBe('');
  });

  it('should release trap when current is set back to null', () => {
    const onRelease = vi.fn();
    const ref = focusRef<HTMLDivElement>({ onRelease, autofocus: false });

    ref.current = container;

    // Release by setting to null
    ref.current = null;

    // After release, Escape should no longer trigger onRelease
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onRelease).not.toHaveBeenCalled();
  });

  it('should release old trap and create new one when current is replaced', () => {
    const onRelease1 = vi.fn();
    const ref = focusRef<HTMLDivElement>({ onRelease: onRelease1, autofocus: false });

    ref.current = container;

    // Swap to a new container
    const container2 = document.createElement('div');
    const btn3 = document.createElement('button');
    container2.appendChild(btn3);
    document.body.appendChild(container2);

    ref.current = container2;

    // Old trap should be released: Escape should NOT trigger old onRelease
    // (new trap has same onRelease since options are shared, but old listeners should be removed)
    // Actually both share same onRelease, so let's verify the old container's listeners are gone
    // by checking that only one set of listeners is active
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    // Only the new trap's onRelease should fire (called once, not twice)
    expect(onRelease1).toHaveBeenCalledOnce();

    ref.current = null;
    container2.remove();
  });

  it('should autofocus the first focusable element when current is set', () => {
    const ref = focusRef<HTMLDivElement>({ autofocus: true });
    ref.current = container;

    expect(document.activeElement).toBe(btn1);

    ref.current = null;
  });

  it('should restore previous focus when current is set to null', () => {
    const prevFocus = document.createElement('input');
    document.body.appendChild(prevFocus);
    prevFocus.focus();

    const ref = focusRef<HTMLDivElement>({ autofocus: true });
    ref.current = container;
    expect(document.activeElement).toBe(btn1);

    ref.current = null;
    expect(document.activeElement).toBe(prevFocus);

    prevFocus.remove();
  });

  it('should not activate trap when current remains null', () => {
    const onRelease = vi.fn();
    const ref = focusRef<HTMLDivElement>({ onRelease });

    // Don't set current
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onRelease).not.toHaveBeenCalled();
  });
});
