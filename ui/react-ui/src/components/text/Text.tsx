import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { TEXT_CONFIGS } from './config.js';

export type TextProps = ElementProps<'p'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const Text = template<TextProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof TEXT_CONFIGS;
  return (
    <p {...rest} className={classx([TEXT_CONFIGS[key], className])}>
      {renderDynamic(children)}
    </p>
  );
}, 'Paragraph');
