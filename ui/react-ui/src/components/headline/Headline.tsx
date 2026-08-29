import { classx, template } from '@airlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { HEADLINE_CONFIGS } from './config.js';

export type HeadlineProps = ElementProps<'h2'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const Headline = template<HeadlineProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof HEADLINE_CONFIGS;
  return (
    <h2 {...rest} className={classx([HEADLINE_CONFIGS[key], className])}>
      {renderDynamic(children)}
    </h2>
  );
}, 'Headline');
