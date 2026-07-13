import type { ColorVariant, SizingLite } from '@airlib/headless/components';
import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { STATUS_CONFIGS } from './config.js';

export type StatusVariant = ColorVariant | 'success' | 'warning' | 'info';

export type StatusProps = ElementProps<'span'> & {
  variant?: StatusVariant;
  size?: SizingLite;
  dot?: boolean;
};

export const Status = template<StatusProps>(
  ({ children, className, variant = 'surface', size = 'md', dot = false, ...rest }) => (
    <span {...rest} className={classx([STATUS_CONFIGS.variant[variant], STATUS_CONFIGS.size[size], className])}>
      {dot && <span className={STATUS_CONFIGS.dotClass} />}
      {renderDynamic(children)}
    </span>
  ),
  'Status'
);
