import { setup } from '@anchorlib/solid';
import { formInput, type AnyType } from '@airlib/form';
import type { JSX } from 'solid-js';

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = setup<TextareaProps>((props) => {
  const input = formInput(props as AnyType);
  const rest = props.$omit(['value', 'name', 'disabled', 'onInput', 'onBlur']);

  const handleInput = (e: Event) => {
    input.value = (e.currentTarget as HTMLTextAreaElement).value;
    if (typeof props.onInput === 'function') {
      props.onInput(e as any);
    }
  };

  const handleBlur = (e: Event) => {
    input.settled();
    if (typeof props.onBlur === 'function') {
      props.onBlur(e as any);
    }
  };

  return (
    <textarea
      {...rest}
      name={input.name}
      value={input.value}
      disabled={input.disabled}
      onInput={handleInput}
      onBlur={handleBlur}
    />
  );
});
