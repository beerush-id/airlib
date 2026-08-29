import { classx, template } from '@airlib/react';
import type { ComponentProps as ReactProps } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogFooter = template<ReactProps<'footer'>>(
  ({ className, children, ...rest }) => (
    <footer className={classx(DIALOG_CONFIGS.footer.class, className)} {...rest}>
      {children}
    </footer>
  ),
  'DialogFooter'
);
