import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { SECTION_CONFIGS } from './config.js';

export type SectionProps = ElementProps<'section'>;
export const Section = template<SectionProps>(
  ({ children, className, ...rest }) => (
    <section {...rest} className={classx([SECTION_CONFIGS.class, className])}>
      {renderChild(children)}
    </section>
  ),
  'Section'
);
