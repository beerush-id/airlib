import type { StateUnsubscribe } from '@airlib/core';
import type { MouseModifier } from './mouse.js';
import { impure } from './state.js';

/**
 * Initializes global window and document keyboard tracking to record currently pressed keys.
 * Automatically clears state on window blur events.
 *
 * @returns A state subscription teardown function.
 */
export function watchKeyboard() {
  if (disposeKeyboard) return disposeKeyboard;

  const cleanup = () => {
    currentKeyboard.clear();
  };
  const register = (e: KeyboardEvent) => {
    currentKeyboard.pressed = true;

    const key = e.key.toLowerCase();
    if (currentKeyboard.has(key)) return;
    currentKeyboard.add(key);
  };
  const unregister = (e: KeyboardEvent) => {
    currentKeyboard.pressed = false;

    const key = e.key.toLowerCase();
    if (!currentKeyboard.has(key)) return;
    currentKeyboard.delete(key);
  };

  window.addEventListener('blur', cleanup);
  document.addEventListener('keydown', register);
  document.addEventListener('keyup', unregister);

  disposeKeyboard = () => {
    window.removeEventListener('blur', cleanup);
    document.removeEventListener('keydown', register);
    document.removeEventListener('keyup', unregister);

    disposeKeyboard = undefined;
  };

  return disposeKeyboard;
}

/**
 * Retrieves the global reactive keyboard tracking set container.
 *
 * @returns The LiveKeyboard state instance.
 */
export function getKeyboard() {
  return currentKeyboard;
}

export class LiveKeyboard extends Set<string | MouseModifier> {
  public pressed = false;
}

const currentKeyboard = impure(new LiveKeyboard());
let disposeKeyboard: StateUnsubscribe | undefined;
