import { classx } from '@airlib/uikit/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { SUBTITLE_CONFIGS } from './config.js';

export type SubtitleProps = ElementProps<'p'> & {
  strong?: boolean;
};
export const Subtitle = template<SubtitleProps>(
  ({ children, className, strong, ...rest }) => (
    <p {...rest} className={classx([strong ? SUBTITLE_CONFIGS.strongClass : SUBTITLE_CONFIGS.class, className])}>
      {renderChild(children)}
    </p>
  ),
  'Subtitle'
);
