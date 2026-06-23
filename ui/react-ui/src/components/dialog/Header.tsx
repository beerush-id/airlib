import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogHeader = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <header className={className ?? DIALOG_CONFIGS.header.class} {...rest}>
      {children}
    </header>
  ),
  'DialogHeader'
);
