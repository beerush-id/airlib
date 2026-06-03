import { setup, render } from '@anchorlib/react';
import { formInput, type AnyType } from '@airlib/form';
import type { SelectHTMLAttributes, ChangeEvent } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = setup<SelectProps>((props) => {
  const input = formInput(props as AnyType);
  const rest = props.$omit(['value', 'name', 'disabled', 'onChange']);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    input.value = e.currentTarget.value;
    props.onChange?.(e);
  };

  return render(() => (
    <select {...rest} name={input.name} value={input.value} disabled={input.disabled} onChange={handleChange}>
      {props.children}
    </select>
  ));
});
