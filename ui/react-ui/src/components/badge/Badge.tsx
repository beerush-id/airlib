import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { BADGE_CONFIGS } from './config.js';
import type { ComponentProps } from 'react';

export const BadgeContainer = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([BADGE_CONFIGS.containerClass, className])}>
      {renderDynamic(children)}
    </div>
  ),
  'BadgeContainer'
);

export const Badge = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([BADGE_CONFIGS.badgeClass, className])}>
      {renderDynamic(children)}
    </span>
  ),
  'Badge'
);

export const BadgeDot = template<ComponentProps<'span'>>(
  ({ className, ...rest }) => <span {...rest} className={classx([BADGE_CONFIGS.dotClass, className])} />,
  'BadgeDot'
);
