import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { UI_CONFIGS } from '../../config.js';

export const DialogToolbar = template<HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }) => (
    <div className={className ?? UI_CONFIGS.dialog.toolbarClass} {...rest}>
      {children}
    </div>
  ),
  'DialogToolbar'
);
