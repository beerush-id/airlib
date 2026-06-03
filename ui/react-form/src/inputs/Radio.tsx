import { setup, render } from '@anchorlib/react';
import { formInput, type AnyType } from '@airlib/form';
import type { InputHTMLAttributes, ChangeEvent } from 'react';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Radio = setup<RadioProps>((props) => {
  (props as AnyType).type = 'radio';
  const input = formInput(props as AnyType);
  const rest = props.$omit(['value', 'type', 'name', 'checked', 'disabled', 'onChange']);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    input.checked = e.currentTarget.checked;
    props.onChange?.(e);
  };

  return render(() => (
    <input
      {...rest}
      type={input.type}
      name={input.name}
      value={input.value}
      checked={input.checked}
      disabled={input.disabled}
      onChange={handleChange}
    />
  ));
});
