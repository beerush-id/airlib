import { setup, render } from '@anchorlib/react';
import { formInput, type AnyType } from '@airlib/form';
import type { TextareaHTMLAttributes, InputEvent, FocusEvent } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = setup<TextareaProps>((props) => {
  const input = formInput(props as AnyType);
  const rest = props.$omit(['value', 'name', 'disabled', 'onInput', 'onBlur']);

  const handleInput = (e: InputEvent<HTMLTextAreaElement>) => {
    input.value = e.currentTarget.value;
    props.onInput?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    input.settled();
    props.onBlur?.(e);
  };

  return render(
    () => (
      <textarea
        {...rest}
        name={input.name}
        value={input.value}
        disabled={input.disabled}
        onInput={handleInput}
        onBlur={handleBlur}
      />
    ),
    'TextareaView'
  );
}, 'Textarea');
