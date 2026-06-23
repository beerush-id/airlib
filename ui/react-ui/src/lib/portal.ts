import { isBrowser } from '@anchorlib/core';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DIALOG_CONFIGS } from '../components/dialog/config.js';

export function teleport(content: ReactNode, target?: string) {
  if (!isBrowser()) return content;
  return createPortal(content, document.querySelector(target ?? DIALOG_CONFIGS.portal) ?? document.body);
}
