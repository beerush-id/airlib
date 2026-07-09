import { classx } from '@airlib/uikit/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { TEXT_CONFIGS } from './config.js';

export type TextProps = ElementProps<'p'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const Text = template<TextProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof TEXT_CONFIGS;
  return (
    <p {...rest} className={classx([TEXT_CONFIGS[key], className])}>
      {renderChild(children)}
    </p>
  );
}, 'Paragraph');
