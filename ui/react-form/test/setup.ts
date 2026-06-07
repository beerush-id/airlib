import '@anchorlib/react/client';
import { anchor } from '@anchorlib/react';
import { beforeEach } from 'vitest';

beforeEach(() => {
  anchor.configure({ globalScopeWarning: false });
});
