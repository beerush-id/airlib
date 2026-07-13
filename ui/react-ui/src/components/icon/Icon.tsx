import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import type { ComponentProps } from 'react';
import { stylex } from '../../utils/index.js';
import { ICON_CONFIGS } from './config.js';

export type IconProps = Omit<ComponentProps<'span'>, 'children'> & {
  name: string;
  size?: number;
};

export const Icon = template<IconProps>(
  ({ name, className, size, style, ...restProps }) => (
    <span
      {...restProps}
      aria-hidden="true"
      className={classx([ICON_CONFIGS.class, className])}
      style={stylex({
        '--air-icon-size': size,
        ...style,
      })}
    >
      {name}
    </span>
  ),
  'Icon'
);

export type SVGIconProps = ComponentProps<'svg'> & {
  size?: number;
};

export const SVGIcon = template<SVGIconProps>(
  ({ children, className, viewBox = '0 -960 960 960', fill, size, style, ...restProps }) => (
    <svg
      {...restProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill={fill ?? ICON_CONFIGS.fill ?? 'currentColor'}
      className={classx([ICON_CONFIGS.class, ICON_CONFIGS.class])}
      style={stylex({
        '--air-icon-size': size,
        ...style,
      })}
    >
      {children}
    </svg>
  ),
  'SVGIcon'
);
