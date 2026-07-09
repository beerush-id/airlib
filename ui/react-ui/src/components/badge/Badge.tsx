import { classx } from '@airlib/uikit/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { BADGE_CONFIGS } from './config.js';

export const BadgeContainer = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([BADGE_CONFIGS.containerClass, className])}>
      {renderChild(children)}
    </div>
  ),
  'BadgeContainer'
);

export const Badge = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([BADGE_CONFIGS.badgeClass, className])}>
      {renderChild(children)}
    </span>
  ),
  'Badge'
);

export const BadgeDot = template<ElementProps<'span'>>(
  ({ className, ...rest }) => <span {...rest} className={classx([BADGE_CONFIGS.dotClass, className])} />,
  'BadgeDot'
);
