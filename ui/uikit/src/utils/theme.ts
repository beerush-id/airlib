import { cookies, effect, isBrowser, untrack } from '@anchorlib/core';

export type ColorScheme = {
  mode: 'dark' | 'light' | 'system';
  toggle: () => void;
  change: (mode: 'dark' | 'light' | 'system') => void;
  current?: 'dark' | 'light';
};

let currentState: ColorScheme | undefined;

export function colorScheme(): ColorScheme {
  if (currentState) return currentState;

  const toggle = () => {
    const mode = untrack(() => state.mode);
    state.mode = mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark';
  };
  const change = (mode: 'dark' | 'light' | 'system') => {
    state.mode = mode;
  };
  const state = cookies<ColorScheme>('theme', { mode: 'system', toggle, change });

  if (!isBrowser()) return state;

  effect(() => {
    if (state.mode === 'system') {
      untrack(() => delete state.current);
    } else {
      untrack(() => (state.current = state.mode as 'dark' | 'light'));
    }
  });

  currentState = state;
  return state;
}
