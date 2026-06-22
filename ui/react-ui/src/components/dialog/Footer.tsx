import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { UI_CONFIGS } from '../../config.js';

export const DialogFooter = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <footer className={className ?? UI_CONFIGS.dialog.footerClass} {...rest}>
      {children}
    </footer>
  ),
  'DialogFooter'
);
