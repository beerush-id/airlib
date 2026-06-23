import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogTitle = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <h3 className={className || DIALOG_CONFIGS.title.class} {...rest}>
      {children}
    </h3>
  ),
  'DialogTitle'
);
