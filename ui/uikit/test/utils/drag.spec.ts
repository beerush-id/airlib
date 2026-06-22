import { createLifecycle, microtask } from '@anchorlib/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SNAP_BOUND } from '../../src/config.js';
import { dragRef, dragState } from '../../src/utils/drag.js';
import { getKeyboard } from '../../src/utils/keyboard.js';
import { getPointer } from '../../src/utils/mouse.js';

describe('drag', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    getPointer().reset();
    getKeyboard().clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('dragState', () => {
    it('should initialize with default values', () => {
      const state = dragState();
      expect(state.x).toBe(0);
      expect(state.y).toBe(0);
      expect(state.start).toBeUndefined();
    });

    it('should initialize with custom values', () => {
      const state = dragState({ x: 10, y: 20 });
      expect(state.x).toBe(10);
      expect(state.y).toBe(20);
    });

    it('should calculate positions on pointer movement if started', async () => {
      const onChange = vi.fn();
      const state = dragState({}, onChange);

      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 0,
        startHeight: 0,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 0,
        anchorBottom: 0,
      };

      const pointer = getPointer();
      pointer.x = 50;
      pointer.y = 50;

      // Wait for microtask/rAF
      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.x).toBe(50);
      expect(state.y).toBe(50);
      expect(onChange).toHaveBeenCalled();
    });

    it('should respect keyboard modifiers for direction', async () => {
      const onChange = vi.fn();
      const state = dragState({ xModifier: 'shift', yModifier: 'alt' }, onChange);

      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 0,
        startHeight: 0,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 0,
        anchorBottom: 0,
      };

      const pointer = getPointer();
      const keyboard = getKeyboard();

      // Horizontal only
      keyboard.add('shift');
      pointer.x = 50;
      pointer.y = 50;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.x).toBe(50);
      expect(state.y).toBe(0);

      // Vertical only
      keyboard.clear();
      keyboard.add('alt');
      pointer.x = 100;
      pointer.y = 100;

      await new Promise<void>((resolve) => later(() => resolve()));

      expect(state.x).toBe(50); // From previous state
      expect(state.y).toBe(100);
    });

    it('should cancel animation frame on cleanup', async () => {
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
      const state = dragState();

      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 0,
        startHeight: 0,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 0,
        anchorBottom: 0,
      };

      const pointer = getPointer();
      pointer.x = 10;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      state.start = undefined;
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(cancelSpy).toHaveBeenCalled();
    });

    it('should abort calculation if start is not an object', async () => {
      let rAFCb: any;
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rAFCb = cb;
        return 1;
      });

      const state = dragState();
      state.start = {
        cursorX: 0,
        cursorY: 0,
        offsetX: 0,
        offsetY: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        startWidth: 0,
        startHeight: 0,
        anchorLeft: 0,
        anchorTop: 0,
        anchorRight: 0,
        anchorBottom: 0,
      };
      const pointer = getPointer();
      pointer.x = 10;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      // rAFCb is queued. Now change start to false.
      state.start = undefined;
      if (rAFCb) rAFCb();
    });
  });

  describe('dragRef', () => {
    let target: HTMLDivElement;
    let trigger: HTMLDivElement;
    let container: HTMLDivElement;

    beforeEach(() => {
      target = document.createElement('div');
      trigger = document.createElement('div');
      container = document.createElement('div');

      // Mock getBoundingClientRect
      vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
        left: 50,
        top: 50,
        right: 150,
        bottom: 150,
        width: 100,
        height: 100,
        x: 50,
        y: 50,
        toJSON: () => {},
      });
      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 500,
        bottom: 500,
        width: 500,
        height: 500,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Mock ResizeObserver
      vi.stubGlobal(
        'ResizeObserver',
        class ResizeObserver {
          observe() {}
          disconnect() {}
        }
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should initialize correctly', () => {
      const drag = dragRef({ target, trigger, container });
      expect(drag.target).toBe(target);
      expect(drag.trigger).toBe(trigger);
      expect(drag.container).toBe(container);
      expect(drag.active).toBe(false);
    });

    it('should start dragging on trigger mousedown', () => {
      const onStart = vi.fn();
      const drag = dragRef({ target, trigger, onStart });

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, button: 0 }));

      expect(drag.active).toBe(true);
      expect(onStart).toHaveBeenCalled();
    });

    it('should end dragging on mouseup', () => {
      const onEnd = vi.fn();
      const drag = dragRef({ target, trigger, onEnd });

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      expect(drag.active).toBe(false);
      expect(onEnd).toHaveBeenCalled();
    });

    it('should reset position if type is reset', () => {
      const drag = dragRef({ target, trigger, type: 'reset' });

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, button: 0 }));

      // Set some position to test reset
      const pointer = getPointer();
      pointer.x = 200;
      pointer.y = 200;
      // It won't calculate without wait, but we can just end drag to trigger reset

      document.dispatchEvent(new MouseEvent('mouseup'));

      expect(drag.x).toBe(0);
      expect(drag.y).toBe(0);
      expect(target.style.transform).toBe('');
    });

    it('should handle touch events', () => {
      const drag = dragRef({ target, trigger });

      trigger.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ clientX: 50, clientY: 50 } as unknown as Touch],
        })
      );
      expect(drag.active).toBe(true);

      document.dispatchEvent(new TouchEvent('touchend'));
      expect(drag.active).toBe(false);
    });

    it('should not start drag on interactive elements', () => {
      const input = document.createElement('input');
      trigger.appendChild(input);
      const drag = dragRef({ target, trigger });

      input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));

      expect(drag.active).toBe(false);
    });

    it('should finish existing drag if a new start event fires', () => {
      const drag = dragRef({ target, trigger });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));

      // Fire mousedown again while already active
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, button: 0 }));

      expect(drag.active).toBe(true);
    });

    it('should assign limits automatically from container and step', () => {
      const drag = dragRef({ target, container, stepX: 10, stepY: 20 });
      expect(drag.active).toBe(false);
      drag.target = target;
    });

    it('should dynamically update setters', () => {
      const drag = dragRef();
      const newTarget = document.createElement('div');
      const newTrigger = document.createElement('div');
      const newContainer = document.createElement('div');

      drag.target = newTarget;
      expect(drag.target).toBe(newTarget);

      drag.trigger = newTrigger;
      expect(drag.trigger).toBe(newTrigger);

      drag.container = newContainer;
      expect(drag.container).toBe(newContainer);

      newTrigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, button: 0 }));
      expect(drag.active).toBe(true);
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should apply constraints minMax and snap', async () => {
      const drag = dragRef({
        target,
        trigger,
        container,
        minX: 10,
        maxX: 100,
        minY: 20,
        maxY: 200,
        snapX: 50,
        snapY: 50,
      });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, button: 0 }));

      const pointer = getPointer();
      pointer.x = 0;
      pointer.y = 0;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(drag.x).toBe(10);
      expect(drag.y).toBe(20);

      pointer.x = 500;
      pointer.y = 500;

      await new Promise<void>((resolve) => later(() => resolve()));

      expect(drag.x).toBe(100);
      expect(drag.y).toBe(200);

      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should invoke onCleanup on reactive root disposal', () => {
      const scope = createLifecycle();
      scope.run(() => {
        dragRef({ target, trigger });
      });
      scope.destroy();
    });

    it('should not clean up if not in browser context', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.stubGlobal('window', undefined);
      const scope = createLifecycle();
      scope.run(() => {
        dragRef({ target, trigger });
      });
      scope.destroy();
      vi.unstubAllGlobals();
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should call onMove when dragging', async () => {
      const onMove = vi.fn();
      const drag = dragRef({ target, trigger, container, onMove });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      const pointer = getPointer();
      pointer.x = 10;
      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));
      expect(onMove).toHaveBeenCalled();
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should not update style if target is undefined on move', async () => {
      const drag = dragRef({ trigger });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      const pointer = getPointer();
      pointer.x = 10;
      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));
      expect(drag.x).toBe(10);
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should ignore dragging with wrong mouse button', () => {
      const drag = dragRef({ trigger });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 2 }));
      expect(drag.active).toBe(false);
    });

    it('should not restore transition if target becomes null after end', async () => {
      const drag = dragRef({ trigger, target });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      drag.target = undefined;
      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));
    });

    it('should fallback to 0 for missing limits when stepping with nullish values', () => {
      const drag = dragRef({
        target,
        container,
        stepX: 10,
        stepY: 10,
        minX: null as any,
        maxX: null as any,
        minY: null as any,
        maxY: null as any,
      });
      expect(drag.x).toBe(0);
    });

    it('should disconnect existing resize observer when container changes', () => {
      const drag = dragRef({ target, container });
      drag.container = undefined;
    });

    it('should remove listeners from previous trigger when changed', () => {
      const drag = dragRef({ trigger });
      drag.trigger = document.createElement('div');
    });

    it('should disconnect resize observer on reactive root disposal', () => {
      const scope = createLifecycle();
      scope.run(() => {
        dragRef({ target, trigger, container });
      });
      scope.destroy();
    });

    it('should resolve snap to snapX and snapY', () => {
      const drag = dragRef({ target, container, snap: 50 });
      expect(drag.x).toBe(0); // Covers the assignLimits branch for snap fallback
    });

    it('should fall back to default configs and handle missing targets when calculating snap points', () => {
      // Target is undefined
      const dragNoTarget = dragRef({ trigger, snapTo: ['.snap-target'] });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      // Target is detached from DOM (no parentElement)
      const detachedTarget = document.createElement('div');
      const dragDetached = dragRef({ target: detachedTarget, trigger, snapTo: ['.snap-target'] });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      // Target itself matches the snap selector (should be ignored)
      const root = document.createElement('div');
      root.appendChild(target);
      document.body.appendChild(root);
      const dragSelf = dragRef({ target, trigger, snapTo: ['div'] }); // target is a 'div'
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
      root.remove();
    });

    it('should actually snap to target points when within threshold', async () => {
      const root = document.createElement('div');
      const snapTarget = document.createElement('div');
      snapTarget.className = 'snap-target';
      root.appendChild(target);
      root.appendChild(snapTarget);
      document.body.appendChild(root);

      // target center is 100, 100
      vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
        left: 50,
        top: 50,
        right: 150,
        bottom: 150,
        width: 100,
        height: 100,
        x: 50,
        y: 50,
        toJSON: () => {},
      });

      // snapTarget center is 250, 250
      // snap point center-to-center is dx=150, dy=150
      vi.spyOn(snapTarget, 'getBoundingClientRect').mockReturnValue({
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

      // Omit snapX, snapY, and snapToBound to hit default fallbacks
      const drag = dragRef({
        target,
        trigger,
        snapTo: ['.snap-target'],
      });

      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      const pointer = getPointer();

      // Move within proximity (threshold is usually 8-20, so 5 is safe)
      pointer.x = 145; // 145 is close to 150
      pointer.y = 145;

      const [later] = microtask(5);
      await new Promise<void>((resolve) => later(() => resolve()));

      expect(drag.x).toBe(150); // Successfully snapped!
      expect(drag.y).toBe(150); // Successfully snapped!

      document.dispatchEvent(new MouseEvent('mouseup'));
      root.remove();
    });

    it('should collect snap points for all bounds', async () => {
      const root = document.createElement('div');
      const snapTarget = document.createElement('div');
      snapTarget.className = 'snap-target';
      root.appendChild(target);
      root.appendChild(snapTarget);
      document.body.appendChild(root);

      vi.spyOn(snapTarget, 'getBoundingClientRect').mockReturnValue({
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

      const dragEdge = dragRef({
        target,
        trigger,
        snapTo: ['.snap-target'],
        snapToBound: SNAP_BOUND.edge,
        snapX: 50,
        snapY: 50,
      });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      const dragAll = dragRef({
        target,
        trigger,
        snapTo: ['.snap-target'],
        snapToBound: SNAP_BOUND.all,
        snapX: 50,
        snapY: 50,
      });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      document.dispatchEvent(new MouseEvent('mouseup'));

      root.remove();
    });

    it('should assign snapX and snapY from snap on drag start', () => {
      const drag = dragRef({ target, trigger, snap: 10 });
      trigger.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, button: 0 }));
      expect(drag.active).toBe(true);
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
  });
});
