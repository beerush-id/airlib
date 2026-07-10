import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KIT_CONFIGS } from '../../src/config.js';
import { focusRef } from '../../src/index.js';

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

  it('should deactivate trap when current is set to null', () => {
    const onRelease = vi.fn();
    const ref = focusRef<HTMLDivElement>({ onRelease, autofocus: false });

    ref.current = container;
    ref.current = null;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onRelease).not.toHaveBeenCalled();
  });

  it('should update trap when current changes to a new element', () => {
    const container2 = document.createElement('div');
    const input = document.createElement('input');
    container2.appendChild(input);
    document.body.appendChild(container2);

    const ref = focusRef<HTMLDivElement>({ autofocus: true });
    ref.current = container;
    expect(document.activeElement).toBe(btn1);

    ref.current = container2;
    expect(document.activeElement).toBe(input);

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
