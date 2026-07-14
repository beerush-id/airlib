import { formInput } from '@airlib/form';
import { classx } from '@airlib/headless/utils';
import { derived } from '@anchorlib/core';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { ComponentProps, InputEventHandler } from 'react';
import { TEXTAREA_CONFIGS } from './config.js';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'value' | 'size' | 'children'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  value?: Bindable<string>;
}

export const Textarea = setup<TextareaProps>((props) => {
  const input = formInput<string>(props);
  const restProps = props.$omit(['variant', 'className', 'value', 'onInput', 'placeholder', 'size']);
  const fieldId = props.id || input.name.replace(/\./g, '-');
  const errorId = `${fieldId}-error`;

  const handleInput: InputEventHandler<HTMLTextAreaElement> = (e) => {
    input.value = e.currentTarget.value;
    props.onInput?.(e);
  };

  const hasError = derived(() => input.touched && (input.error || !input.matched));

  return render(
    () => (
      <textarea
        {...restProps}
        id={fieldId}
        name={input.name}
        value={input.value}
        disabled={input.disabled}
        placeholder={props.placeholder || ' '}
        aria-invalid={hasError.value ? true : undefined}
        aria-describedby={hasError.value ? errorId : undefined}
        onInput={handleInput}
        className={classx([
          TEXTAREA_CONFIGS.class,
          props.variant === 'filled' && TEXTAREA_CONFIGS.filledClass,
          TEXTAREA_CONFIGS.size[props.size!],
          hasError.value && TEXTAREA_CONFIGS.errorClass,
          props.className,
        ])}
      />
    ),
    'Textarea'
  );
}, 'Textarea');
