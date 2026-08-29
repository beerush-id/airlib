import { classx, template } from '@airlib/react';
import type { ComponentProps as ReactProps } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogHeader = template<ReactProps<'header'>>(
  ({ className, children, ...rest }) => (
    <header className={classx(DIALOG_CONFIGS.header.class, className)} {...rest}>
      {children}
    </header>
  ),
  'DialogHeader'
);
