import { setup, render } from '@anchorlib/react';
import { formInput, type AnyType } from '@airlib/form';
import type { InputHTMLAttributes, ChangeEvent } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = setup<CheckboxProps>((props) => {
  (props as AnyType).type = 'checkbox';
  const input = formInput(props as AnyType);
  const rest = props.$omit(['value', 'type', 'name', 'checked', 'disabled', 'onChange']);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    input.checked = e.currentTarget.checked;
    props.onChange?.(e);
  };

  return render(
    () => (
      <input
        {...rest}
        type={input.type}
        name={input.name}
        checked={input.checked}
        disabled={input.disabled}
        onChange={handleChange}
      />
    ),
    'CheckboxView'
  );
}, 'Checkbox');
