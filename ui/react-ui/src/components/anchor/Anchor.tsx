import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';

export type AnchorProps = ElementProps<'a'>;
export const Anchor = template<AnchorProps>(
  ({ children, ...rest }) => <a {...rest}>{renderChild(children)}</a>,
  'Anchor'
);
