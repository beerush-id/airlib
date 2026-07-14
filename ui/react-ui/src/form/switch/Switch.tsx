import { formInput } from '@airlib/form';
import type { AnyType } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { MouseEventHandler } from 'react';
import type { ElementProps } from '../../components/renderer.js';
import { CheckIcon } from '../../icons/index.js';
import { SWITCH_CONFIGS } from './config.js';

export interface SwitchProps extends Omit<ElementProps<'button'>, 'aria-checked'> {
  checked?: Bindable<boolean>;
}

export const Switch = setup<SwitchProps>((props) => {
  (props as AnyType).type = 'checkbox';

  const restProps = props.$omit(['checked', 'className', 'onClick']);
  const input = formInput(props as AnyType);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    input.checked = !input.checked;
    props.onClick?.(e);
  };

  return render(
    () => (
      <button
        {...restProps}
        type="button"
        role="switch"
        aria-checked={input.checked ?? false}
        className={classx([SWITCH_CONFIGS.containerClass, props.className])}
        onClick={handleClick}
      >
        <span className={SWITCH_CONFIGS.thumbClass}>{input.checked ? <CheckIcon /> : null}</span>
      </button>
    ),
    'Switch'
  );
}, 'Switch');
