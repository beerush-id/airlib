import { isBrowser } from '@anchorlib/core';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DIALOG_CONFIGS } from '../components/dialog/config.js';

export function teleport(content: ReactNode, target?: string | Element) {
  if (!isBrowser()) return content;
  return createPortal(
    content,
    typeof target === 'string'
      ? (document.querySelector(target ?? DIALOG_CONFIGS.portal) ?? document.body)
      : (target ?? (document.body as Element))
  );
}
