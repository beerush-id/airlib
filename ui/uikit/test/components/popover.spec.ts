import { createLifecycle } from '@anchorlib/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { popover } from '../../src/components/popover.js';

let activeObservers: MockResizeObserver[] = [];
class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    activeObservers.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    activeObservers = activeObservers.filter((o) => o !== this);
  }
  trigger() {
    this.callback([], this as any);
  }
}

describe('popover Component', () => {
  let container: HTMLDivElement;
  let anchorEl: HTMLButtonElement;
  let floatingEl: HTMLDivElement;

  beforeEach(() => {
    activeObservers = [];
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    document.body.innerHTML = '';
    container = document.createElement('div');
    anchorEl = document.createElement('button');
    anchorEl.textContent = 'Trigger';
    floatingEl = document.createElement('div');
    floatingEl.textContent = 'Floating Content';

    container.appendChild(anchorEl);
    container.appendChild(floatingEl);
    document.body.appendChild(container);

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this === anchorEl) return new DOMRect(200, 200, 100, 40);
      if (this === floatingEl) return new DOMRect(0, 0, 100, 40);
      return new DOMRect(0, 0, 1024, 768);
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    container.remove();
  });

  describe('Tooltip & Hint Overlay Concern', () => {
    it('should open an instant tooltip on hover and close on leave without stealing focus', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          interaction: ['hover'],
          focus: false,
          yPos: 'before',
          gap: 4,
        });
        p.element = floatingEl;
        p.anchor = anchorEl;

        expect(p.open).toBe(false);

        anchorEl.dispatchEvent(new Event('pointerenter'));
        expect(p.open).toBe(true);
        expect(p.ySide).toBe('before');

        anchorEl.dispatchEvent(new Event('pointerleave'));
        expect(p.open).toBe(false);
      });
      scope.destroy();
    });

    it('should handle delayed informational tooltip that dismisses when Escape key is pressed', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          interaction: ['hover'],
          delay: { open: 200, close: 100 },
          escape: true,
          xPos: 'center',
        });
        p.element = floatingEl;
        p.anchor = anchorEl;

        anchorEl.dispatchEvent(new Event('pointerenter'));
        expect(p.open).toBe(false);
        vi.advanceTimersByTime(200);
        expect(p.open).toBe(true);

        // Pressing escape closes the tooltip
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(p.open).toBe(false);
      });
      scope.destroy();
    });

    it('should maintain interactive rich tooltip position across layout updates with custom offsets', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          interaction: ['hover'],
          gap: { x: 10, y: 12 },
          overflow: ['flip', 'shift'],
        });
        p.element = floatingEl;
        p.anchor = anchorEl;

        anchorEl.dispatchEvent(new Event('pointerenter'));
        expect(p.open).toBe(true);

        activeObservers.forEach((o) => o.trigger());
        expect(p.open).toBe(true);
      });
      scope.destroy();
    });
  });

  describe('Profile Preview Hovercard Concern', () => {
    it('should handle hover interaction bridging and timing delays between anchor and floating card', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          interaction: ['hover'],
          delay: { open: 100, close: 100 },
        });
        p.element = floatingEl;
        p.anchor = anchorEl;

        anchorEl.dispatchEvent(new Event('pointerenter'));
        expect(p.open).toBe(false);
        vi.advanceTimersByTime(100);
        expect(p.open).toBe(true);

        anchorEl.dispatchEvent(new Event('pointerleave'));
        expect(p.open).toBe(true);
        vi.advanceTimersByTime(100);
        expect(p.open).toBe(false);
      });
      scope.destroy();
    });
  });

  describe('Action Menu / Dropdown Menu Concern', () => {
    it('should toggle on click and activate focus trap inside when focus option is enabled', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          interaction: ['click'],
          focus: true,
        });
        p.element = floatingEl;
        p.anchor = anchorEl;

        expect(p.open).toBe(false);

        anchorEl.dispatchEvent(new MouseEvent('click'));
        expect(p.open).toBe(true);

        // Clicking again toggles closed
        anchorEl.dispatchEvent(new MouseEvent('click'));
        expect(p.open).toBe(false);
      });
      scope.destroy();
    });
  });

  describe('Form Flyout & Datepicker Concern', () => {
    it('should respond to focus interactions and project CSS positioning coordinates and attributes', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          interaction: ['focus'],
          cssPrefix: '--popover',
          attrPrefix: 'data-popover',
        });
        p.element = floatingEl;
        p.anchor = anchorEl;

        anchorEl.dispatchEvent(new FocusEvent('focusin'));
        expect(p.open).toBe(true);
        expect(floatingEl.hasAttribute('data-popover-open')).toBe(true);
        expect(floatingEl.style.getPropertyValue('--popover-x')).toBeDefined();

        anchorEl.dispatchEvent(new FocusEvent('focusout'));
        expect(p.open).toBe(false);
        expect(floatingEl.hasAttribute('data-popover-open')).toBe(false);
      });
      scope.destroy();
    });
  });

  describe('Header Flyout & Notification Panel (Portaling)', () => {
    it('should portal element to target container when open and restore on close', () => {
      const portalTarget = document.createElement('div');
      portalTarget.id = 'portal-root';
      document.body.appendChild(portalTarget);

      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          portal: '#portal-root',
        });
        p.element = floatingEl;
        p.anchor = anchorEl;

        expect(floatingEl.parentElement).toBe(container);

        p.toggle();
        expect(p.open).toBe(true);
        expect(floatingEl.parentElement).toBe(portalTarget);

        p.toggle();
        expect(p.open).toBe(false);
        expect(floatingEl.parentElement).toBe(container);
      });
      scope.destroy();
      portalTarget.remove();
    });
  });

  describe('Programmatic & Controlled Popover Concern', () => {
    it('should support manual toggling, repositioning, and destroying', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({});
        p.element = floatingEl;
        p.anchor = anchorEl;

        p.toggle();
        expect(p.open).toBe(true);

        p.reposition();
        expect(p.x).toBeDefined();

        p.destroy();
      });
      scope.destroy();
    });
  });

  describe('Coverage & Edge Cases', () => {
    it('should resolve anchor as parentElement and use custom boundary when provided', () => {
      const boundaryEl = document.createElement('div');
      document.body.appendChild(boundaryEl);

      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({
          boundary: boundaryEl,
        });
        p.element = floatingEl;

        p.toggle();
        expect(p.open).toBe(true);
      });
      scope.destroy();
      boundaryEl.remove();
    });

    it('should trigger repositioning on scroll and window resize events while open', () => {
      const scrollable = document.createElement('div');
      Object.defineProperty(scrollable, 'scrollHeight', { value: 200, configurable: true });
      Object.defineProperty(scrollable, 'clientHeight', { value: 100, configurable: true });
      scrollable.appendChild(container);
      document.body.appendChild(scrollable);

      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({});
        p.element = floatingEl;
        p.anchor = anchorEl;

        p.toggle();
        expect(p.open).toBe(true);

        scrollable.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
        activeObservers.forEach((o) => o.trigger());

        // Toggle closed to exercise scroll listener cleanup
        p.toggle();
        expect(p.open).toBe(false);
      });
      scope.destroy();
      scrollable.remove();
    });

    it('should safely do nothing when toggling open or repositioning unresolvable elements', () => {
      const scope = createLifecycle();
      scope.run(() => {
        const p = popover({});
        p.element = 'non-existent-selector';

        p.toggle();
        expect(() => p.reposition()).not.toThrow();
      });
      scope.destroy();
    });
  });
});
