import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { HEADLINE_CONFIGS } from './config.js';

export type HeadlineProps = ElementProps<'h2'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const Headline = template<HeadlineProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof HEADLINE_CONFIGS;
  return (
    <h2 {...rest} className={classx([HEADLINE_CONFIGS[key], className])}>
      {renderChild(children)}
    </h2>
  );
}, 'Headline');
