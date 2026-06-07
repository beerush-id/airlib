import { setup, render, derived } from '@anchorlib/react';
import { formInput, type AnyType } from '@airlib/form';
import type { TextareaHTMLAttributes, InputEvent, FocusEvent } from 'react';
import { getInputClasses, INPUT_OPTIONS_KEYS, TEXTAREA_OPTIONS, TEXTAREA_OPTIONS_KEYS } from '../config.js';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorClass?: string;
}

export const Textarea = setup<TextareaProps>((props) => {
  const input = formInput(props as AnyType);
  const rest = props.$omit([
    'value',
    'name',
    'disabled',
    'className',
    'onInput',
    'onBlur',
    ...(TEXTAREA_OPTIONS_KEYS as never[]),
    ...(INPUT_OPTIONS_KEYS as never[]),
  ]);

  const { baseClass, errorClass } = getInputClasses(TEXTAREA_OPTIONS);

  const handleInput = (e: InputEvent<HTMLTextAreaElement>) => {
    input.value = e.currentTarget.value;
    props.onInput?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    input.settled();
    props.onBlur?.(e);
  };

  const className = derived(() => {
    if (input.touched && input.error) {
      return [props.className ?? baseClass, props.errorClass ?? errorClass].filter(Boolean).join(' ');
    }
    return props.className ?? baseClass;
  });

  return render(
    () => (
      <textarea
        {...rest}
        name={input.name}
        value={input.value}
        disabled={input.disabled}
        className={className.value}
        onInput={handleInput}
        onBlur={handleBlur}
      />
    ),
    'TextareaView'
  );
}, 'Textarea');
