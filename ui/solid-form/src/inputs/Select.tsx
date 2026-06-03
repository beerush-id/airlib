import { setup } from '@anchorlib/solid';
import { formInput, type AnyType } from '@airlib/form';
import { createEffect, type JSX } from 'solid-js';

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = setup<SelectProps>((props) => {
  const input = formInput(props as AnyType);
  const rest = props.$omit(['value', 'name', 'disabled', 'onChange']);
  let ref: HTMLSelectElement | undefined;

  createEffect(() => {
    if (ref) ref.value = input.value;
  });

  const handleChange = (e: Event) => {
    input.value = (e.currentTarget as HTMLSelectElement).value;
    if (typeof props.onChange === 'function') {
      props.onChange(e as any);
    }
  };

  return (
    /* v8 ignore next */
    <select ref={ref} {...rest} name={input.name} disabled={input.disabled} onChange={handleChange}>
      {props.children}
    </select>
  );
});
