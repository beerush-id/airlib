import { classx } from '@anchorlib/core';
import { template } from '@anchorlib/react';
import type { ComponentProps as ReactProps } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export const DialogTitle = template<ReactProps<'h3'>>(
  ({ className, children, ...rest }) => (
    <h3 className={classx(DIALOG_CONFIGS.title.class, className)} {...rest}>
      {children}
    </h3>
  ),
  'DialogTitle'
);
