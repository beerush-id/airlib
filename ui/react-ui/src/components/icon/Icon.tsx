import { classx, template } from '@airlib/react';
import { stylex } from '../../utils/index.js';
import { type ElementProps, renderDynamic } from '../renderer.ts';
import { ICON_CONFIGS } from './config.js';

export type IconProps = ElementProps<'span'> & {
  name?: string | (() => string);
  size?: number;
};

export const Icon = template<IconProps>(({ name, className, children, size, style, ...restProps }) => {
  return (
    <span
      {...restProps}
      aria-hidden="true"
      className={classx([ICON_CONFIGS.class, className])}
      style={stylex({
        '--air-icon-size': size,
        ...style,
      })}
    >
      {children ? renderDynamic(children) : typeof name === 'function' ? name() : name}
    </span>
  );
}, 'Icon');

export type SVGIconProps = ElementProps<'svg'> & {
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
      {renderDynamic(children)}
    </svg>
  ),
  'SVGIcon'
);
