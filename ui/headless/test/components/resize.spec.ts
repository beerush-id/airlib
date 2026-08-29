import { createLifecycle, microtask } from '@airlib/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KIT_CONFIGS } from '../../src/config.js';
import { resizeRef, resizeState } from '../../src/index.js';
import { getPointer } from '../../src/utils/mouse.js';

describe('resize', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    getPointer().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('resizeState', () => {
    it('should calculate resize for east direction', async () => {
      const state = resizeState({ dir: ['e'], snapW: 10 });
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 100,
        anchorBottom: 100,
      };

      const pointer = getPointer();
      pointer.x = 20;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.width).toBe(20);
    });

    it('should calculate resize for west direction', async () => {
      const state = resizeState({ dir: ['w'] });
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 50,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 50,
        anchorTop: 0,
        anchorRight: 150,
        anchorBottom: 100,
      };

      const pointer = getPointer();
      pointer.x = -20; // moving left

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.width).toBe(20);
      expect(state.x).toBe(30); // 50 + (100 - 120)
    });

    it('should calculate resize for south direction', async () => {
      const state = resizeState({ dir: ['s'] });
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 100,
        anchorBottom: 100,
      };

      const pointer = getPointer();
      pointer.y = 30;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.height).toBe(30);
    });

    it('should calculate resize for north direction', async () => {
      const state = resizeState({ dir: ['n'] });
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 50,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 0,
        anchorTop: 50,
        anchorRight: 100,
        anchorBottom: 150,
      };

      const pointer = getPointer();
      pointer.y = -30; // moving up

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.height).toBe(30);
      expect(state.y).toBe(20); // 50 + (100 - 130)
    });

    it('should ignore if dir is not provided or empty', async () => {
      const state = resizeState({ dir: [] });
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 100,
        anchorBottom: 100,
      };
      const pointer = getPointer();
      pointer.x = 20;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.width).toBe(0);
    });

    it('should snap edges to edgeSnaps within threshold for all directions', async () => {
      const state = resizeState({
        dir: ['e', 'w', 's', 'n'],
        edgeSnaps: { x: [155, -55], y: [155, -55] },
      });
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 100,
        anchorBottom: 100,
      };

      const pointer = getPointer();
      pointer.x = 52;
      pointer.y = 52;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.width).toBe(55);
      expect(state.height).toBe(55);

      const state2 = resizeState({
        dir: ['w', 'n'],
        edgeSnaps: { x: [-55], y: [-55] },
      });
      state2.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 100,
        anchorBottom: 100,
      };

      const pointer2 = getPointer();
      pointer2.x = -52;
      pointer2.y = -52;

      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state2.width).toBe(55);
      expect(state2.x).toBe(-55);
      expect(state2.height).toBe(55);
      expect(state2.y).toBe(-55);
    });

    it('should use default snapThreshold of 10 if KIT_CONFIGS.snapThreshold is missing', async () => {
      const original = KIT_CONFIGS.snapThreshold;
      // @ts-expect-error
      KIT_CONFIGS.snapThreshold = undefined;

      const state = resizeState({
        dir: ['e'],
        edgeSnaps: { x: [105], y: [] },
      });
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 100,
        startHeight: 100,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 100,
        anchorBottom: 100,
      };

      const pointer = getPointer();
      pointer.x = 2; // move 2px, new absolute width 102. 105 is within 10px threshold.

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.width).toBe(5); // snapped to 105 (delta 5)

      KIT_CONFIGS.snapThreshold = original;
    });
  });

  describe('resizeRef', () => {
    let target: HTMLDivElement;
    let trigger: HTMLDivElement;

    beforeEach(() => {
      target = document.createElement('div');
      trigger = document.createElement('div');

      Object.defineProperty(target, 'offsetWidth', { configurable: true, get: () => 100 });
      Object.defineProperty(target, 'offsetHeight', { configurable: true, get: () => 100 });

      vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        toJSON: () => {},
      });
    });

    it('should initialize and start on mousedown', () => {
      const onStart = vi.fn();
      const ref = resizeRef({ target, trigger, onStart, dir: 'all' });

      expect(ref.active).toBe(false);

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      expect(ref.active).toBe(true);
      expect(onStart).toHaveBeenCalled();

      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(ref.active).toBe(false);
    });

    it('should update element styles on move', async () => {
      const onMove = vi.fn();
      const ref = resizeRef({ target, trigger, onMove, dir: ['e'] });

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));

      const pointer = getPointer();
      pointer.x = 50;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(target.style.width).toBe('150px');
      expect(onMove).toHaveBeenCalled();

      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should handle reset on end', async () => {
      const ref = resizeRef({ target, trigger, type: 'reset', dir: ['e'] });

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(target.style.width).toBe('');
      expect(target.style.height).toBe('');
      expect(target.style.transform).toBe('');
    });

    it('should collect edge snaps if snapTo is provided', () => {
      const root = document.createElement('div');
      const sibling = document.createElement('div');
      sibling.className = 'snap-target';
      root.appendChild(target);
      root.appendChild(sibling);
      document.body.appendChild(root);

      vi.spyOn(sibling, 'getBoundingClientRect').mockReturnValue({
        left: 200,
        top: 200,
        right: 300,
        bottom: 300,
        width: 100,
        height: 100,
        x: 200,
        y: 200,
        toJSON: () => {},
      });

      const ref = resizeRef({ target, trigger, snapTo: ['.snap-target'], dir: ['e'] });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));

      document.dispatchEvent(new MouseEvent('mouseup'));
      root.remove();
    });

    it('should assign snapW and snapH from snap', () => {
      const ref = resizeRef({ target, trigger, snap: 10, dir: 'all' });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should finish existing resize if mousedown triggered again', () => {
      const ref = resizeRef({ target, trigger, dir: 'e' });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      expect(ref.active).toBe(true);

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, button: 0 }));
      expect(ref.active).toBe(true);
    });

    it('should update trigger binding dynamically', () => {
      const ref = resizeRef({ target, dir: 'e' });
      const newTrigger = document.createElement('div');

      ref.trigger = newTrigger;
      expect(ref.trigger).toBe(newTrigger);

      newTrigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      expect(ref.active).toBe(true);
    });

    it('should apply transforms when resizing w or n', async () => {
      const ref = resizeRef({ target, trigger, dir: ['w', 'n'] });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));

      const pointer = getPointer();
      pointer.x = 20;
      pointer.y = 20;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(target.style.width).toBe('80px');
      expect(target.style.height).toBe('80px');
      expect(target.style.transform).toBe('translate3d(20px, 20px, 0)');

      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should dynamically update setters and return getters', () => {
      const ref = resizeRef();
      const newTarget = document.createElement('div');

      ref.target = newTarget;
      expect(ref.target).toBe(newTarget);

      expect(ref.width).toBe(0);
      expect(ref.height).toBe(0);
      expect(ref.x).toBe(0);
      expect(ref.y).toBe(0);
      expect(ref.active).toBe(false);
    });

    it('should invoke onCleanup on reactive root disposal', () => {
      const scope = createLifecycle();
      scope.run(() => {
        resizeRef({ target, trigger });
      });
      scope.destroy();
    });

    it('should not clean up if not in browser context', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.stubGlobal('window', undefined);
      const scope = createLifecycle();
      scope.run(() => {
        resizeRef({ target, trigger });
      });
      scope.destroy();
      vi.unstubAllGlobals();
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should not update style if target is undefined on move', async () => {
      const ref = resizeRef({ trigger, dir: 'e' });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      const pointer = getPointer();
      pointer.x = 10;
      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));
      expect(ref.width).toBe(10);
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should ignore resizing with wrong mouse button', () => {
      const ref = resizeRef({ trigger, dir: 'e' });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 2 }));
      expect(ref.active).toBe(false);
    });

    it('should call onEnd when resizing finishes', async () => {
      const onEnd = vi.fn();
      const ref = resizeRef({ target, trigger, onEnd, dir: 'e' });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(onEnd).toHaveBeenCalled();
      // This also allows restoreTransition to hit line 179 in rect.ts
    });

    it('should remove listeners from previous trigger when changed', () => {
      const ref = resizeRef({ trigger, dir: 'e' });
      ref.trigger = document.createElement('div');
      expect(ref.trigger).not.toBe(trigger);
    });

    it('should autodetect edges based on threshold and coordinates outside the content area', () => {
      const ref = resizeRef({ target, trigger, dir: 'auto' });

      // Click slightly inside the right edge, should NOT activate
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 95, clientY: 50, button: 0 }));
      expect(ref.active).toBe(false);

      // Click exactly on or slightly outside the right edge, SHOULD activate
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 105, clientY: 50, button: 0 }));
      expect(ref.active).toBe(true);
      document.dispatchEvent(new MouseEvent('mouseup'));

      // Click slightly inside the bottom right corner, should NOT activate
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 95, clientY: 95, button: 0 }));
      expect(ref.active).toBe(false);

      // Click exactly on or slightly outside the bottom right corner, SHOULD activate
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 105, clientY: 105, button: 0 }));
      expect(ref.active).toBe(true);
      document.dispatchEvent(new MouseEvent('mouseup'));

      // Click center of element, should not activate
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50, button: 0 }));
      expect(ref.active).toBe(false);

      // Touch slightly inside the top left corner, should NOT activate
      const touchInEvent = new Event('touchstart');
      Object.assign(touchInEvent, { touches: [{ clientX: 5, clientY: 5 }] });
      trigger.dispatchEvent(touchInEvent);
      expect(ref.active).toBe(false);

      // Touch exactly on or slightly outside the top left corner, SHOULD activate
      const touchOutEvent = new Event('touchstart');
      Object.assign(touchOutEvent, { touches: [{ clientX: -5, clientY: -5 }] });
      trigger.dispatchEvent(touchOutEvent);
      expect(ref.active).toBe(true);
      document.dispatchEvent(new Event('touchend'));
    });

    it('should use custom resizeThreshold if provided', () => {
      const ref = resizeRef({ target, trigger, dir: 'auto', resizeThreshold: 20 });

      // Click at 115px (within 20px threshold of right edge 100)
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 115, clientY: 50, button: 0 }));
      expect(ref.active).toBe(true);
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should use default resizeThreshold of 10 if KIT_CONFIGS.resizeThreshold is missing', () => {
      const original = KIT_CONFIGS.resizeThreshold;
      // @ts-expect-error
      KIT_CONFIGS.resizeThreshold = undefined;

      const ref = resizeRef({ target, trigger, dir: 'auto' });

      // Click at 108px (within default 10px threshold of right edge 100)
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 108, clientY: 50, button: 0 }));
      expect(ref.active).toBe(true);
      document.dispatchEvent(new MouseEvent('mouseup'));

      KIT_CONFIGS.resizeThreshold = original;
    });
  });
});
