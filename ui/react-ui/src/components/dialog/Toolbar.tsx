import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogToolbar = template<HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }) => (
    <div className={className || DIALOG_CONFIGS.toolbar.class} {...rest}>
      {children}
    </div>
  ),
  'DialogToolbar'
);
