import { classx } from '@airlib/headless/utils';
import type { FC, ReactNode, SVGAttributes } from 'react';
import { ICON_CONFIGS } from '../components/icon/config.js';
import { stylex } from '../utils/index.js';

export interface IconProps extends Omit<SVGAttributes<SVGElement>, 'width' | 'height'> {
  size?: number;
}

export function createIcon(content: (() => ReactNode) | ReactNode, name?: string, viewBox = '0 -960 960 960') {
  if (typeof content === 'function') {
    const IconFactory: FC<IconProps> = ({ className, size, fill, style, ...restProps }) => (
      <svg
        {...restProps}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill={fill ?? ICON_CONFIGS.fill ?? 'currentColor'}
        className={classx([className, ICON_CONFIGS.class])}
        style={stylex({
          '--air-icon-size': size,
          ...style,
        })}
      >
        {content()}
      </svg>
    );
    IconFactory.displayName = name ? `${name}Icon` : 'Icon';
    return IconFactory;
  }

  const Icon: FC<IconProps> = ({ className, size, fill, style, ...restProps }) => (
    <svg
      {...restProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill={fill ?? ICON_CONFIGS.fill ?? 'currentColor'}
      className={classx([className, ICON_CONFIGS.class])}
      style={stylex({
        '--air-icon-size': size,
        ...style,
      })}
    >
      {content}
    </svg>
  );
  Icon.displayName = name ? `${name}Icon` : 'Icon';
  return Icon;
}
