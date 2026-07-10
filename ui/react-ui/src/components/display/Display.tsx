import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { DISPLAY_CONFIGS } from './config.js';

export type DisplayProps = ElementProps<'h1'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const Display = template<DisplayProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof DISPLAY_CONFIGS;
  return (
    <h1 {...rest} className={classx([DISPLAY_CONFIGS[key], className])}>
      {renderChild(children)}
    </h1>
  );
}, 'Display');
