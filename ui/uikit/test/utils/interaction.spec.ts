import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  attachFinish,
  bindInteraction,
  bindTrigger,
  captureStart,
  detachFinish,
  resetInteraction,
  unbindTrigger,
} from '../../src/utils/interaction.js';
import { MOUSE_BUTTONS } from '../../src/utils/mouse.js';

describe('interaction utilities', () => {
  let anchorEl: HTMLElement;
  let el: HTMLElement;
  let container: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    container = document.createElement('div');
    anchorEl = document.createElement('button');
    el = document.createElement('div');
    container.appendChild(anchorEl);
    container.appendChild(el);
    document.body.appendChild(container);
  });

  afterEach(() => {
    vi.useRealTimers();
    container.remove();
  });

  describe('bindInteraction - hover mode', () => {
    it('should trigger open and close on pointerenter/leave without delay', () => {
      const open = vi.fn();
      const close = vi.fn();
      const toggle = vi.fn();

      const teardown = bindInteraction(anchorEl, el, { interaction: ['hover'] }, open, close, toggle);

      anchorEl.dispatchEvent(new PointerEvent('pointerenter'));
      expect(open).toHaveBeenCalledTimes(1);

      anchorEl.dispatchEvent(new PointerEvent('pointerleave'));
      expect(close).toHaveBeenCalledTimes(1);

      teardown();
    });

    it('should handle open and close delays and moving between anchor and el', () => {
      const open = vi.fn();
      const close = vi.fn();
      const toggle = vi.fn();

      const teardown = bindInteraction(
        anchorEl,
        el,
        { interaction: ['hover'], delay: { open: 100, close: 200 } },
        open,
        close,
        toggle
      );

      // Enter anchor
      anchorEl.dispatchEvent(new PointerEvent('pointerenter'));
      expect(open).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(open).toHaveBeenCalledTimes(1);

      // Leave anchor, enter el before close delay
      anchorEl.dispatchEvent(new PointerEvent('pointerleave'));
      el.dispatchEvent(new PointerEvent('pointerenter'));
      vi.advanceTimersByTime(200);
      expect(close).not.toHaveBeenCalled();

      // Leave el
      el.dispatchEvent(new PointerEvent('pointerleave'));
      vi.advanceTimersByTime(200);
      expect(close).toHaveBeenCalledTimes(1);

      teardown();
    });

    it('should handle single number delay', () => {
      const open = vi.fn();
      const close = vi.fn();
      const toggle = vi.fn();

      const teardown = bindInteraction(anchorEl, el, { interaction: ['hover'], delay: 50 }, open, close, toggle);

      anchorEl.dispatchEvent(new PointerEvent('pointerenter'));
      vi.advanceTimersByTime(50);
      expect(open).toHaveBeenCalledTimes(1);

      anchorEl.dispatchEvent(new PointerEvent('pointerleave'));
      vi.advanceTimersByTime(50);
      expect(close).toHaveBeenCalledTimes(1);

      teardown();
    });
  });

  describe('bindInteraction - focus mode', () => {
    it('should trigger open on focusin and close on focusout outside', () => {
      const open = vi.fn();
      const close = vi.fn();
      const toggle = vi.fn();

      const teardown = bindInteraction(anchorEl, el, { interaction: ['focus'] }, open, close, toggle);

      anchorEl.dispatchEvent(new FocusEvent('focusin'));
      expect(open).toHaveBeenCalledTimes(1);

      el.dispatchEvent(new FocusEvent('focusin'));
      expect(open).toHaveBeenCalledTimes(2);

      // Focus moving inside anchor/el shouldn't close
      anchorEl.dispatchEvent(new FocusEvent('focusout', { relatedTarget: el }));
      expect(close).not.toHaveBeenCalled();

      // Focus moving outside should close
      const outside = document.createElement('input');
      container.appendChild(outside);
      anchorEl.dispatchEvent(new FocusEvent('focusout', { relatedTarget: outside }));
      expect(close).toHaveBeenCalledTimes(1);

      teardown();
    });
  });

  describe('bindInteraction - click mode', () => {
    it('should toggle on click and enter/space keydown, and close on outside pointerdown', () => {
      const open = vi.fn();
      const close = vi.fn();
      const toggle = vi.fn();

      const teardown = bindInteraction(anchorEl, el, { interaction: ['click'] }, open, close, toggle);

      anchorEl.dispatchEvent(new MouseEvent('click'));
      expect(toggle).toHaveBeenCalledTimes(1);

      anchorEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(toggle).toHaveBeenCalledTimes(2);

      anchorEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(toggle).toHaveBeenCalledTimes(3);

      anchorEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      expect(toggle).toHaveBeenCalledTimes(3);

      // Pointer down inside anchor/el shouldn't close
      document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      // Notice target of dispatched event on document directly is document, so it closes unless target is child
      expect(close).toHaveBeenCalledTimes(1);

      const inside = document.createElement('span');
      el.appendChild(inside);
      inside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(close).toHaveBeenCalledTimes(1);

      teardown();
    });
  });

  describe('bindInteraction - escape option', () => {
    it('should close on Escape keydown', () => {
      const open = vi.fn();
      const close = vi.fn();
      const toggle = vi.fn();

      const teardown = bindInteraction(anchorEl, el, { escape: true }, open, close, toggle);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(close).toHaveBeenCalledTimes(1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(close).toHaveBeenCalledTimes(1);

      teardown();
    });
  });

  describe('trigger and finish bindings & reset', () => {
    it('should bind and unbind trigger events', () => {
      const fn = vi.fn();
      bindTrigger(anchorEl, fn);
      anchorEl.dispatchEvent(new MouseEvent('mousedown'));
      expect(fn).toHaveBeenCalledTimes(1);

      unbindTrigger(anchorEl, fn);
      anchorEl.dispatchEvent(new MouseEvent('mousedown'));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should attach and detach finish events', () => {
      const fn = vi.fn();
      attachFinish(fn);
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(fn).toHaveBeenCalledTimes(1);

      detachFinish(fn);
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset interaction state and element styles', () => {
      const state: any = { x: 10, y: 20, width: 100, height: 200 };
      el.style.width = '100px';
      el.style.height = '200px';

      resetInteraction(state, el, ['width', 'height']);
      expect(state).toEqual({ x: 0, y: 0, width: 0, height: 0 });
      expect(el.style.width).toBe('');
      expect(el.style.height).toBe('');
    });

    it('should capture start geometry for mouse events', () => {
      const state: any = { x: 5, y: 10, width: 50, height: 60 };
      const event = new MouseEvent('mousedown', { clientX: 100, clientY: 200, button: MOUSE_BUTTONS.left });

      const start = captureStart(event, state, MOUSE_BUTTONS.left, el);
      expect(start).toMatchObject({
        cursorX: 100,
        cursorY: 200,
        offsetX: 5,
        offsetY: 10,
      });

      const wrongButton = new MouseEvent('mousedown', { clientX: 100, clientY: 200, button: MOUSE_BUTTONS.right });
      expect(captureStart(wrongButton, state, MOUSE_BUTTONS.left, el)).toBeNull();
    });
  });
});
