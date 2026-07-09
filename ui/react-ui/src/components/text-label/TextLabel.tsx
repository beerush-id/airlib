import { classx } from '@airlib/uikit/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { TEXT_LABEL_CONFIGS } from './config.js';

export type TextLabelProps = ElementProps<'span'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const TextLabel = template<TextLabelProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof TEXT_LABEL_CONFIGS;
  return (
    <span {...rest} className={classx([TEXT_LABEL_CONFIGS[key], className])}>
      {renderChild(children)}
    </span>
  );
}, 'Span');
