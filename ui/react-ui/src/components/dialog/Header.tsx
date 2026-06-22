import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { UI_CONFIGS } from '../../config.js';

export const DialogHeader = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <header className={className ?? UI_CONFIGS.dialog.headerClass} {...rest}>
      {children}
    </header>
  ),
  'DialogHeader'
);
