import { classx, template } from '@airlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { CARD_CONFIGS } from './config.js';

export type CardProps = ElementProps<'div'> & {
  variant?: 'elevated' | 'filled' | 'outlined';
};

export const Card = template<CardProps>(({ children, className, variant, ...rest }) => {
  let baseClass = CARD_CONFIGS.class;
  if (variant === 'filled') baseClass = CARD_CONFIGS.filledClass;
  if (variant === 'outlined') baseClass = CARD_CONFIGS.outlinedClass;

  return (
    <div {...rest} className={classx([baseClass, className])}>
      {renderDynamic(children)}
    </div>
  );
}, 'Card');

export const CardGroup = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([CARD_CONFIGS.groupClass, className])}>
      {renderDynamic(children)}
    </div>
  ),
  'CardGroup'
);

export const CardHeader = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([CARD_CONFIGS.headerClass, className])}>
      {renderDynamic(children)}
    </div>
  ),
  'CardHeader'
);

export const CardTitle = template<ElementProps<'h3'>>(
  ({ children, className, ...rest }) => (
    <h3 {...rest} className={classx([CARD_CONFIGS.titleClass, className])}>
      {renderDynamic(children)}
    </h3>
  ),
  'CardTitle'
);

export const CardSubtitle = template<ElementProps<'p'>>(
  ({ children, className, ...rest }) => (
    <p {...rest} className={classx([CARD_CONFIGS.subtitleClass, className])}>
      {renderDynamic(children)}
    </p>
  ),
  'CardTitle'
);

export const CardBody = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([CARD_CONFIGS.bodyClass, className])}>
      {renderDynamic(children)}
    </div>
  ),
  'CardBody'
);
