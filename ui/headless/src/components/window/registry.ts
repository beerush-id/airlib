import { safeRun } from '@anchorlib/core';
import { impure } from '../../utils/index.js';
import { WindowLauncher } from './launcher.js';
import { WindowStacks } from './stack.js';
import type { WindowRegistry } from './types.js';

/**
 * Global desktop window management registry containing active z-index stacking order,
 * registered window instances map, and system launcher state.
 */
export const WebWin = safeRun(() => {
  return impure(
    {
      stack: new WindowStacks(),
      windows: impure(new Map(), { recursive: false }),
      launcher: impure(new WindowLauncher()),
    },
    { recursive: false }
  ) as WindowRegistry;
});

export const WINDOW_STATUS = {
  IDLE: 'idle',
  OPEN: 'open',
  ERROR: 'error',
  CLOSED: 'closed',
  PENDING: 'pending',
} as const;
