import { classx } from '@airlib/uikit/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderChild } from '../supporting.js';
import { CHIP_CONFIGS } from './config.js';

export type ChipProps = ElementProps<'button'> & {
  variant?: 'outlined' | 'elevated';
  selected?: boolean;
};

export const Chip = template<ChipProps>(({ children, className, variant, selected, type = 'button', ...rest }) => {
  let baseClass = CHIP_CONFIGS.class;
  if (variant === 'elevated') baseClass = CHIP_CONFIGS.elevatedClass;

  return (
    <button {...rest} type={type} className={classx([baseClass, className])} role="checkbox" aria-checked={selected}>
      {renderChild(children)}
    </button>
  );
}, 'Chip');
