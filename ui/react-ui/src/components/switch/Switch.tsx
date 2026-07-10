import { classx } from '@airlib/headless/utils';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { MouseEventHandler } from 'react';
import { type ElementProps } from '../supporting.js';
import { SWITCH_CONFIGS } from './config.js';
import { CheckIcon } from '../../icons/index.js';

export interface SwitchProps extends Omit<ElementProps<'button'>, 'aria-checked'> {
  checked?: Bindable<boolean>;
}

export const Switch = setup<SwitchProps>((props) => {
  const restProps = props.$omit(['checked', 'className', 'onClick', 'onKeyDown']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    props.checked = !props.checked;
    props.onClick?.(e);
  };

  return render(
    () => (
      <button
        {...restProps}
        type="button"
        role="switch"
        aria-checked={props.checked}
        className={classx([SWITCH_CONFIGS.containerClass, props.className])}
        onClick={handleClick}
      >
        <span className={SWITCH_CONFIGS.thumbClass}>{props.checked ? <CheckIcon /> : null}</span>
      </button>
    ),
    'Switch'
  );
}, 'Switch');
