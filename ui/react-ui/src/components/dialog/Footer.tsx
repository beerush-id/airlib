import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogFooter = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <footer className={className ?? DIALOG_CONFIGS.footer.class} {...rest}>
      {children}
    </footer>
  ),
  'DialogFooter'
);
