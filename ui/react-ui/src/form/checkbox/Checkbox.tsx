import { formInput } from '@airlib/form';
import { classx } from '@airlib/headless/utils';
import type { AnyType } from '@anchorlib/core';
import { type Bindable, nodeRef, setup } from '@anchorlib/react';
import type { MouseEvent, MouseEventHandler } from 'react';
import type { ElementProps } from '../../components/renderer.js';
import { CheckIcon, CheckIndeterminateIcon } from '../../icons/index.js';
import { CHECKBOX_CONFIGS } from './config.js';

export interface CheckboxProps extends Omit<ElementProps<'button'>, 'aria-checked' | 'onChange'> {
  checked?: Bindable<boolean>;
  indeterminate?: boolean;
  onChange?: (checked: boolean, e: MouseEvent<HTMLButtonElement>) => void;
}

export const Checkbox = setup<CheckboxProps>((props) => {
  (props as AnyType).type = 'checkbox';

  const restProps = props.$omit(['checked', 'className', 'onClick', 'onChange', 'disabled']);
  const input = formInput(props as AnyType);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (typeof props.onClick === 'function') {
      props.onClick(e);
      return;
    }

    input.checked = !input.checked;
    props.onChange?.(input.checked, e);
  };

  const ref = nodeRef<HTMLButtonElement>(() => ({
    role: 'checkbox',
    'aria-checked': props.indeterminate ? 'mixed' : input.checked ? 'true' : 'false',
    disabled: props.disabled,
    className: classx([CHECKBOX_CONFIGS.containerClass, props.className]),
  }));

  const boxRef = nodeRef<HTMLSpanElement>(() => ({
    className: classx([
      CHECKBOX_CONFIGS.boxClass,
      input.checked && CHECKBOX_CONFIGS.boxCheckedClass,
      props.indeterminate && CHECKBOX_CONFIGS.boxIndeterminateClass,
    ]),
  }));

  return (
    <button {...restProps} {...ref.attributes} ref={ref} type="button" onClick={handleClick}>
      <span ref={boxRef} {...boxRef.attributes}>
        <CheckIcon data-icon="checked" />
        <CheckIndeterminateIcon data-icon="mixed" />
      </span>
    </button>
  );
}, 'Checkbox');
