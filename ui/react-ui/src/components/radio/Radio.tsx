import { classx } from '@airlib/uikit/utils';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { KeyboardEventHandler, MouseEventHandler } from 'react';
import { type ElementProps } from '../supporting.js';
import { RADIO_CONFIGS } from './config.js';

export interface RadioProps extends Omit<ElementProps<'button'>, 'aria-checked'> {
  checked?: Bindable<boolean>;
}

export const Radio = setup<RadioProps>((props) => {
  const restProps = props.$omit(['checked', 'className', 'onClick', 'onKeyDown']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    props.checked = true;
    props.onClick?.(e);
  };

  return render(
    () => (
      <button
        {...restProps}
        type="button"
        role="radio"
        aria-checked={props.checked}
        className={classx([RADIO_CONFIGS.containerClass, props.className])}
        onClick={handleClick}
      >
        <span className={classx([RADIO_CONFIGS.visualClass, props.checked && RADIO_CONFIGS.visualCheckedClass])}>
          <span className={classx([RADIO_CONFIGS.dotClass, props.checked && RADIO_CONFIGS.dotCheckedClass])} />
        </span>
      </button>
    ),
    'Radio'
  );
}, 'Radio');
