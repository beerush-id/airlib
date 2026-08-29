import { classx } from '@airlib/headless/utils';
import { template } from '@airlib/react';
import { Display } from '../display/Display.tsx';
import { Headline } from '../headline/Headline.tsx';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { Subtitle } from '../subtitle/Subtitle.tsx';
import { TextLabel } from '../text-label/TextLabel.tsx';
import { Title } from '../title/Title.tsx';
import { TEXT_CONFIGS } from './config.js';

export type TextProps = ElementProps<'p'> & {
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
};

export const Paragraph = template<TextProps>(({ children, className, size = 'md', strong, ...rest }) => {
  const key = `${size}${strong ? 'Strong' : ''}` as keyof typeof TEXT_CONFIGS;
  return (
    <p {...rest} className={classx([TEXT_CONFIGS[key], className])}>
      {renderDynamic(children)}
    </p>
  );
}, 'Paragraph');

export const Text = Object.assign(Paragraph, {
  Label: TextLabel,
  Title: Title,
  Display: Display,
  Subtitle: Subtitle,
  Headline: Headline,
});
