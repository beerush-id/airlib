import { type AnyType, formInput } from '@airlib/form';
import { derived, render, setup } from '@anchorlib/react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { CHECKBOX_OPTIONS, CHECKBOX_OPTIONS_KEYS, getInputClasses, INPUT_OPTIONS_KEYS } from '../config.js';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  errorClass?: string;
}

export const Checkbox = setup<CheckboxProps>((props) => {
  (props as AnyType).type = 'checkbox';
  const input = formInput(props as AnyType);
  const rest = props.$omit([
    'value',
    'type',
    'name',
    'checked',
    'disabled',
    'className',
    'onChange',
    ...(CHECKBOX_OPTIONS_KEYS as never[]),
    ...(INPUT_OPTIONS_KEYS as never[]),
  ]);

  const { baseClass, errorClass } = getInputClasses(CHECKBOX_OPTIONS);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    input.checked = e.currentTarget.checked;
    props.onChange?.(e);
  };

  const className = derived(() => {
    if (input.touched && input.error) {
      return [props.className ?? baseClass, props.errorClass ?? errorClass].filter(Boolean).join(' ');
    }
    return props.className ?? baseClass;
  });

  return render(
    () => (
      <input
        {...rest}
        type={input.type}
        name={input.name}
        checked={input.checked}
        disabled={input.disabled}
        className={className.value}
        onChange={handleChange}
      />
    ),
    'CheckboxView'
  );
}, 'Checkbox');
