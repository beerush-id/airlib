import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';

export type AnchorProps = ElementProps<'a'>;
export const Anchor = template<AnchorProps>(
  ({ children, ...rest }) => <a {...rest}>{renderDynamic(children)}</a>,
  'Anchor'
);
