import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { SECTION_CONFIGS } from './config.js';

export type SectionProps = ElementProps<'section'>;
export const Section = template<SectionProps>(
  ({ children, className, ...rest }) => (
    <section {...rest} className={classx([SECTION_CONFIGS.class, className])}>
      {renderDynamic(children)}
    </section>
  ),
  'Section'
);
