import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { UI_CONFIGS } from '../../config.js';

export const DialogTitle = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <h3 className={className ?? UI_CONFIGS.dialog.titleClass} {...rest}>
      {children}
    </h3>
  ),
  'DialogTitle'
);
