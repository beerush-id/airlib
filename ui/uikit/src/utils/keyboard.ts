import type { StateUnsubscribe } from '@anchorlib/core';
import type { MouseModifier } from './mouse.js';
import { impure } from './state.js';

const currentKeyboard = impure(new Set<string | MouseModifier>());

let disposeKeyboard: StateUnsubscribe | undefined;

export function watchKeyboard() {
  if (disposeKeyboard) return disposeKeyboard;

  const cleanup = () => {
    currentKeyboard.clear();
  };
  const register = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (currentKeyboard.has(key)) return;
    currentKeyboard.add(key);
  };
  const unregister = (e: KeyboardEvent) => {
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

export function getKeyboard() {
  return currentKeyboard;
}
