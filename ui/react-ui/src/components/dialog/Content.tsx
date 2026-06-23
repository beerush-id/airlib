import { template } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogContent = template<HTMLAttributes<HTMLElement>>(
  ({ className, children, ...rest }) => (
    <section className={className ?? DIALOG_CONFIGS.content.class} {...rest}>
      {children}
    </section>
  ),
  'DialogContent'
);
