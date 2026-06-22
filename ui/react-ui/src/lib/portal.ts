import { isBrowser } from '@anchorlib/core';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { UI_CONFIGS } from '../config.js';

export function teleport(content: ReactNode, target?: string) {
  if (!isBrowser()) return content;
  return createPortal(content, document.querySelector(target ?? UI_CONFIGS.dialog.portal) ?? document.body);
}
