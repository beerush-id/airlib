import { type AnyType, formInput, type FormInputOptions } from '@airlib/form';
import { render, setup } from '@anchorlib/react';
import type { FocusEvent, InputEvent } from 'react';

export function createInput<P, T = AnyType>(type: string, options?: FormInputOptions<T>) {
  return setup<P>((props) => {
    (props as AnyType).type = type;
    const input = formInput(props as AnyType, options);
    const rest = props.$omit(['value', 'type', 'name', 'id', 'disabled', 'onInput', 'onBlur'] as AnyType);
    const $props = props as AnyType;
    const fieldId = $props.id || input.name.replace(/\./g, '-');
    const errorId = `${fieldId}-error`;

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
        id={fieldId}
        type={input.type}
        name={input.name}
        value={input.value}
        disabled={input.disabled}
        aria-invalid={input.error ? true : undefined}
        aria-describedby={input.error ? errorId : undefined}
        onInput={handleInput}
        onBlur={handleBlur}
      />
    ));
  });
}
