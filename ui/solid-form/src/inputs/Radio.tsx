import { setup } from '@anchorlib/solid';
import { formInput, type AnyType } from '@airlib/form';
import type { JSX } from 'solid-js';

export interface RadioProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

export const Radio = setup<RadioProps>((props) => {
  (props as AnyType).type = 'radio';
  const input = formInput(props as AnyType);
  const rest = props.$omit(['type', 'name', 'checked', 'disabled', 'onChange']);

  const handleChange = (e: Event) => {
    input.checked = (e.currentTarget as HTMLInputElement).checked;
    if (typeof props.onChange === 'function') {
      props.onChange(e as any);
    }
  };

  return (
    <input
      {...rest}
      type={input.type}
      name={input.name}
      value={input.value}
      checked={input.checked}
      disabled={input.disabled}
      onChange={handleChange}
    />
  );
});
