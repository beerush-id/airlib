import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { UI_CONFIGS } from '../../config.js';

export const DialogContent = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <section className={className ?? UI_CONFIGS.dialog.contentClass} {...rest}>
      {children}
    </section>
  ),
  'DialogContent'
);
