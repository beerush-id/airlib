import { type AnyType, formInput, type FormInputOptions } from '@airlib/form';
import { render, setup } from '@anchorlib/react';
import type { FocusEvent, InputEvent } from 'react';

export function createInput<P, T = AnyType>(type: string, options?: FormInputOptions<T>) {
  return setup<P>((props) => {
    (props as AnyType).type = type;
    const input = formInput(props as AnyType, options);
    const rest = props.$omit(['value', 'type', 'name', 'disabled', 'onInput', 'onBlur'] as AnyType);
    const $props = props as AnyType;

    const handleInput = (e: InputEvent<HTMLInputElement>) => {
      input.value = e.currentTarget.value;
      $props.onInput?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      input.settled();
      $props.onBlur?.(e);
    };

    return render(() => (
      <input
        {...rest}
        type={input.type}
        name={input.name}
        value={input.value}
        disabled={input.disabled}
        onInput={handleInput}
        onBlur={handleBlur}
      />
    ));
  });
}
