import { classx } from '@airlib/uikit/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { BUTTON_CONFIGS } from './config.js';

export type ButtonProps = ElementProps<'button'> & {
  variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';
};

export const Button = template<ButtonProps>(({ children, className, variant, type = 'button', ...rest }) => {
  let baseClass = BUTTON_CONFIGS.class;
  if (variant === 'elevated') baseClass = BUTTON_CONFIGS.elevatedClass;
  if (variant === 'tonal') baseClass = BUTTON_CONFIGS.tonalClass;
  if (variant === 'outlined') baseClass = BUTTON_CONFIGS.outlinedClass;
  if (variant === 'text') baseClass = BUTTON_CONFIGS.textClass;

  return (
    <button {...rest} type={type} className={classx([baseClass, className])}>
      {renderChild(children)}
    </button>
  );
}, 'Button');

export const ButtonGroup = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([BUTTON_CONFIGS.groupClass, className])}>
      {renderChild(children)}
    </div>
  ),
  'ButtonGroup'
);

export type IconButtonProps = ElementProps<'button'> & {
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
};

export const IconButton = template<IconButtonProps>(({ children, className, variant, type = 'button', ...rest }) => {
  let baseClass = BUTTON_CONFIGS.iconClass;
  if (variant === 'filled') baseClass = BUTTON_CONFIGS.iconFilledClass;
  if (variant === 'tonal') baseClass = BUTTON_CONFIGS.iconTonalClass;
  if (variant === 'outlined') baseClass = BUTTON_CONFIGS.iconOutlinedClass;

  return (
    <button {...rest} type={type} className={classx([baseClass, className])}>
      {renderChild(children)}
    </button>
  );
}, 'IconButton');

export type FabProps = ElementProps<'button'> & {
  variant?: 'primary' | 'surface' | 'secondary' | 'tertiary';
  extended?: boolean;
};

export const Fab = template<FabProps>(({ children, className, variant, extended, type = 'button', ...rest }) => {
  let baseClass = BUTTON_CONFIGS.fabClass;
  if (variant === 'surface') baseClass = BUTTON_CONFIGS.fabSurfaceClass;
  if (variant === 'secondary') baseClass = BUTTON_CONFIGS.fabSecondaryClass;
  if (variant === 'tertiary') baseClass = BUTTON_CONFIGS.fabTertiaryClass;

  if (extended) baseClass += ` ${BUTTON_CONFIGS.fabExtendedClass}`;

  return (
    <button {...rest} type={type} className={classx([baseClass, className])}>
      {renderChild(children)}
    </button>
  );
}, 'Fab');
