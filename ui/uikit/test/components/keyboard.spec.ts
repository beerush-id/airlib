import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { arrowRef } from '../../src/components/keyboard.js';

describe('arrowRef', () => {
  let container: HTMLDivElement;
  let btn1: HTMLButtonElement;
  let btn2: HTMLButtonElement;
  let btn3: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    btn1 = document.createElement('button');
    btn1.textContent = 'Apple';
    btn2 = document.createElement('button');
    btn2.textContent = 'Avocado';
    btn3 = document.createElement('button');
    btn3.textContent = 'Banana';

    container.appendChild(btn1);
    container.appendChild(btn2);
    container.appendChild(btn3);
    document.body.appendChild(container);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    container.remove();
  });

  describe('Directional Navigation (Arrow Keys)', () => {
    it('should navigate forwards on ArrowRight and ArrowDown by default', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn2);

      btn2.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(btn3);
    });

    it('should navigate backwards on ArrowLeft and ArrowUp by default', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn3.focus();

      btn3.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(document.activeElement).toBe(btn2);

      btn2.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).toBe(btn1);
    });

    it('should wrap around from the last item to the first and vice versa', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn3.focus();

      btn3.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(document.activeElement).toBe(btn3);
    });

    it('should respect vertical axis restrictions', () => {
      const ref = arrowRef<HTMLDivElement>({ direction: 'vertical' });
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(btn2);
    });

    it('should respect horizontal axis restrictions', () => {
      const ref = arrowRef<HTMLDivElement>({ direction: 'horizontal' });
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn2);
    });
  });

  describe('Boundary Navigation (Home and End Keys)', () => {
    it('should jump to the first item when Home is pressed', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn3.focus();

      btn3.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      expect(document.activeElement).toBe(btn1);
    });

    it('should jump to the last item when End is pressed', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      expect(document.activeElement).toBe(btn3);
    });
  });

  describe('Typeahead Character Searching', () => {
    it('should focus item matching single typed character', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
      expect(document.activeElement).toBe(btn3);
    });

    it('should match multi-character prefix when typed quickly', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn3.focus();

      btn3.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', bubbles: true }));
      expect(document.activeElement).toBe(btn2);
    });

    it('should cycle through items starting with the same character when repeated', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(document.activeElement).toBe(btn2);

      btn2.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(document.activeElement).toBe(btn1);
    });

    it('should reset search query after timeout', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn3.focus();

      btn3.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      vi.advanceTimersByTime(500);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
      expect(document.activeElement).toBe(btn3);
    });

    it('should ignore typeahead when modifier keys are held', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', metaKey: true, bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', altKey: true, bubbles: true }));
      expect(document.activeElement).toBe(btn1);
    });
  });

  describe('Coverage & Edge Cases', () => {
    it('should handle null or non-object options gracefully', () => {
      const ref = arrowRef<HTMLDivElement>(null as any);
      ref.current = container;
      btn1.focus();

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn2);
    });

    it('should safely do nothing when container has no focusable items', () => {
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);

      const ref = arrowRef<HTMLDivElement>();
      ref.current = emptyContainer;

      emptyContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      emptyContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      emptyContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      emptyContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      emptyContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

      expect(document.activeElement).not.toBe(emptyContainer);
      emptyContainer.remove();
    });

    it('should handle navigation when active element is outside focusable items', () => {
      const outsideInput = document.createElement('input');
      document.body.appendChild(outsideInput);
      outsideInput.focus();

      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;

      // Next focus from outside (-1 index) should focus first item (0)
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      // Prev focus from outside when activeElement is not container should do nothing
      outsideInput.focus();
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(document.activeElement).toBe(outsideInput);

      outsideInput.remove();
    });

    it('should use custom focusable selector when provided', () => {
      btn2.classList.add('custom-item');
      const ref = arrowRef<HTMLDivElement>({ focusable: '.custom-item' });
      ref.current = container;

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn2);
    });

    it('should clean up listeners and search timeouts when ref is cleared', () => {
      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      btn3.focus();

      btn3.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      ref.current = null;

      vi.advanceTimersByTime(500);

      btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(document.activeElement).toBe(btn1);
    });

    it('should safely handle focusable items with empty or whitespace text content', () => {
      const emptyBtn = document.createElement('button');
      emptyBtn.textContent = '   ';
      container.insertBefore(emptyBtn, btn1);

      const ref = arrowRef<HTMLDivElement>();
      ref.current = container;
      emptyBtn.focus();

      emptyBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(document.activeElement).toBe(btn1);

      emptyBtn.remove();
    });
  });
});
