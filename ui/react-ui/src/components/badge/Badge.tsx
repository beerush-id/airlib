import type { ColorVariant } from '@airlib/headless/components';
import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import type { ComponentProps } from 'react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { BADGE_CONFIGS } from './config.js';

export const BadgeContainer = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([BADGE_CONFIGS.containerClass, className])}>
      {renderDynamic(children)}
    </div>
  ),
  'BadgeContainer'
);

export type BadgeProps = ElementProps<'span'> & {
  variant?: ColorVariant;
};

export const Badge = template<BadgeProps>(
  ({ children, className, variant = 'default' as ColorVariant, ...rest }) => (
    <span {...rest} className={classx([BADGE_CONFIGS.variant[variant], className])}>
      {renderDynamic(children)}
    </span>
  ),
  'Badge'
);

export type BadgeDotProps = ComponentProps<'span'> & {
  variant?: ColorVariant;
};

export const BadgeDot = template<BadgeDotProps>(
  ({ className, variant = 'default' as ColorVariant, ...rest }) => (
    <span {...rest} className={classx([BADGE_CONFIGS.variant[variant], BADGE_CONFIGS.dotClass, className])} />
  ),
  'BadgeDot'
);
