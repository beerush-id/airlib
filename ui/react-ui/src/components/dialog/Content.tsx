import { classx, template } from '@airlib/react';
import type { ComponentProps as ReactProps } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogContent = template<ReactProps<'section'>>(
  ({ className, children, ...rest }) => (
    <section className={classx(DIALOG_CONFIGS.content.class, className)} {...rest}>
      {children}
    </section>
  ),
  'DialogContent'
);
