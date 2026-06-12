import type { FC, ReactNode, SVGAttributes } from 'react';
import { UI_CONFIGS } from '../config.js';

export interface IconProps extends Omit<SVGAttributes<SVGElement>, 'width' | 'height'> {
  size?: number;
}

export function createIcon(content: (() => ReactNode) | ReactNode, name?: string, viewBox = '0 -960 960 960') {
  if (typeof content === 'function') {
    const IconFactory: FC<IconProps> = ({ className, size, fill, ...restProps }) => (
      <svg
        {...restProps}
        xmlns="http://www.w3.org/2000/svg"
        width={`${size ?? UI_CONFIGS.iconSize ?? 24}px`}
        height={`${size ?? UI_CONFIGS.iconSize ?? 24}px`}
        viewBox={viewBox}
        fill={fill ?? UI_CONFIGS.iconFill ?? 'currentColor'}
      >
        {content()}
      </svg>
    );
    IconFactory.displayName = name ? `${name}Icon` : 'Icon';
    return IconFactory;
  }

  const Icon: FC<IconProps> = ({ className, size, fill, ...restProps }) => (
    <svg
      {...restProps}
      xmlns="http://www.w3.org/2000/svg"
      width={`${size ?? UI_CONFIGS.iconSize ?? 24}px`}
      height={`${size ?? UI_CONFIGS.iconSize ?? 24}px`}
      viewBox={viewBox}
      fill={fill ?? UI_CONFIGS.iconFill ?? 'currentColor'}
      className={className ?? UI_CONFIGS.iconClass ?? ''}
    >
      {content}
    </svg>
  );
  Icon.displayName = name ? `${name}Icon` : 'Icon';
  return Icon;
}
