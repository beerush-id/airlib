import type { FC, ReactNode, SVGAttributes } from 'react';
import { stylex } from '../utils/index.js';
import { ICON_CONFIGS } from './config.js';

export interface IconProps extends Omit<SVGAttributes<SVGElement>, 'width' | 'height'> {
  size?: number;
}

export function createIcon(content: (() => ReactNode) | ReactNode, name?: string, viewBox = '0 -960 960 960') {
  if (typeof content === 'function') {
    const IconFactory: FC<IconProps> = ({ className, size = ICON_CONFIGS.size, fill, style, ...restProps }) => (
      <svg
        {...restProps}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill={fill ?? ICON_CONFIGS.fill ?? 'currentColor'}
        className={className || ICON_CONFIGS.class}
        style={stylex({
          '--icon-size': size,
          ...style,
        })}
      >
        {content()}
      </svg>
    );
    IconFactory.displayName = name ? `${name}Icon` : 'Icon';
    return IconFactory;
  }

  const Icon: FC<IconProps> = ({ className, size = ICON_CONFIGS.size, fill, style, ...restProps }) => (
    <svg
      {...restProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill={fill ?? ICON_CONFIGS.fill ?? 'currentColor'}
      className={className || ICON_CONFIGS.class}
      style={stylex({
        '--icon-size': size,
        ...style,
      })}
    >
      {content}
    </svg>
  );
  Icon.displayName = name ? `${name}Icon` : 'Icon';
  return Icon;
}
