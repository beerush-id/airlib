import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { SUBTITLE_CONFIGS } from './config.js';

export type SubtitleProps = ElementProps<'p'> & {
  strong?: boolean;
};
export const Subtitle = template<SubtitleProps>(
  ({ children, className, strong, ...rest }) => (
    <p {...rest} className={classx([strong ? SUBTITLE_CONFIGS.strongClass : SUBTITLE_CONFIGS.class, className])}>
      {renderDynamic(children)}
    </p>
  ),
  'Subtitle'
);
