import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { TITLE_CONFIGS } from './config.js';

export type TitleProps = ElementProps<'h3'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const Title = template<TitleProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof TITLE_CONFIGS;
  return (
    <h3 {...rest} className={classx([TITLE_CONFIGS[key], className])}>
      {renderDynamic(children)}
    </h3>
  );
}, 'Title');
