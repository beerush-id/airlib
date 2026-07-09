import { cookies, effect, isBrowser, untrack } from '@anchorlib/core';
import { KIT_CONFIGS } from 'src/config.ts';

export type ColorScheme = {
  mode: 'dark' | 'light' | 'system';
  color: string;
  current?: 'dark' | 'light';
  toggle: () => void;
  change: (mode: 'dark' | 'light', toggle?: boolean) => void;
};

/**
 * Retrieves the global reactive color scheme controller synced with browser cookies and system preferences.
 *
 * @returns A ColorScheme reactive state instance.
 */
export function colorScheme(): ColorScheme {
  if (currentState) return currentState;

  const toggle = () => {
    const mode = untrack(() => state.mode);
    state.mode = mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark';
  };
  const change = (mode: 'dark' | 'light' | 'system', toggleMode?: boolean) => {
    if (toggleMode && state.mode === mode) {
      state.mode = 'system';
    } else {
      state.mode = mode;
    }
  };
  const state = cookies<ColorScheme>('theme', {
    mode: 'system',
    color: KIT_CONFIGS.seedColor,
    toggle,
    change,
  });

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

let currentState: ColorScheme | undefined;
