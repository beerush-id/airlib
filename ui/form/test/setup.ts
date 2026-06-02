import { anchor } from '@anchorlib/core';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  anchor.configure({ globalScopeWarning: false });
  vi.stubGlobal('window', {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});
