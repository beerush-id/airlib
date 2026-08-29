import { classx, template } from '@airlib/react';
import type { ComponentProps as ReactProps } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogToolbar = template<ReactProps<'div'>>(
  ({ className, children, ...rest }) => (
    <div className={classx(DIALOG_CONFIGS.toolbar.class, className)} {...rest}>
      {children}
    </div>
  ),
  'DialogToolbar'
);
