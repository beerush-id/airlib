import { anchor, type Linkable, mutable, type StateUnsubscribe, untrack } from '@anchorlib/core';
import { impure } from './state.js';

export type MouseButton = 0 | 1 | 2 | 3 | 4;
export type MouseModifier = 'shift' | 'ctrl' | 'alt' | 'meta';

/**
 * Initializes global window pointer tracking to monitor cursor coordinates, movements,
 * pressed buttons, and active keyboard modifiers.
 *
 * @returns A state subscription teardown callback.
 */
export function watchPointer() {
  if (disposePointer) return disposePointer;

  const handleMouseMove = (e: MouseEvent) => {
    anchor.assign(currentPointer, {
      x: e.clientX,
      y: e.clientY,
      pageX: e.pageX,
      pageY: e.pageY,
      deltaX: e.movementX,
      deltaY: e.movementY,
      screenX: e.screenX,
      screenY: e.screenY,
    });
  };
  const handleMouseDown = (e: MouseEvent) => {
    anchor.assign(currentPointer, { button: e.button });

    if (e.altKey) currentPointer.modifiers.add('alt');
    if (e.ctrlKey) currentPointer.modifiers.add('ctrl');
    if (e.metaKey) currentPointer.modifiers.add('meta');
    if (e.shiftKey) currentPointer.modifiers.add('shift');
  };
  const handleMouseUp = () => {
    currentPointer.button = null;
    currentPointer.modifiers.clear();
  };

  disposePointer = () => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mousedown', handleMouseDown);

    disposePointer = undefined;
  };

  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mousedown', handleMouseDown);

  return disposePointer;
}

/**
 * Retrieves the global reactive pointer tracking state container.
 *
 * @returns The active MousePointer state instance.
 */
export function getPointer() {
  return currentPointer;
}

/**
 * Creates a standalone reactive pointer coordinate container.
 *
 * @returns A mutable MousePointer reference.
 */
export function createPointer() {
  return mutable(new MousePointer());
}

export const MOUSE_BUTTONS = {
  left: 0,
  right: 2,
  middle: 1,
  back: 3,
  forward: 4,
} as const;

export const MOUSE_MODIFIERS = {
  shift: 'shift',
  ctrl: 'ctrl',
  alt: 'alt',
  meta: 'meta',
} as const;

export class MousePointer {
  public x = 0;
  public y = 0;

  public pageX = 0;
  public pageY = 0;

  public deltaX = 0;
  public deltaY = 0;

  public screenX = 0;
  public screenY = 0;

  public button: number | null = null;
  public modifiers = new Set<MouseModifier>();

  public reset() {
    untrack(() => {
      anchor.assign(this as Linkable, {
        x: 0,
        y: 0,
        button: null,

        pageX: 0,
        pageY: 0,
        deltaX: 0,
        deltaY: 0,
        screenX: 0,
        screenY: 0,
      });
      this.modifiers.clear();
    });

    return this;
  }
}

const currentPointer = impure(new MousePointer());
let disposePointer: StateUnsubscribe | undefined;
