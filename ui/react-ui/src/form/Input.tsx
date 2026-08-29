import { formInput } from '@airlib/form';
import type { AnyType } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { derived } from '@airlib/core';
import { type Bindable, render, setup, type StableComponent } from '@airlib/react';
import type { ComponentProps, FocusEventHandler, InputEventHandler } from 'react';
import { TEXT_FIELD_CONFIGS } from './config.js';

export interface TextFieldProps<T = string> extends Omit<ComponentProps<'input'>, 'value' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  value?: Bindable<T>;
  variant?: 'outlined' | 'filled';
}

export function createTextFiled<T = string, P = TextFieldProps<T>>(
  type = 'text',
  displayName = 'TextField',
  config: typeof TEXT_FIELD_CONFIGS = TEXT_FIELD_CONFIGS
): StableComponent<P> {
  return setup<TextFieldProps<T>>((props) => {
    if (!('type' in props)) (props as AnyType).type = type;

    const restProps = props.$omit(['variant', 'className', 'value', 'onInput', 'placeholder', 'size']);
    const input = formInput<string>(props as AnyType);
    const fieldId = props.id || input.name.replace(/\./g, '-');
    const errorId = `${fieldId}-error`;

    const handleInput: InputEventHandler<HTMLInputElement> = (e) => {
      input.value = e.currentTarget.value;
      props.onInput?.(e);
    };

    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      input.settled();
      props.onBlur?.(e);
    };

    const hasError = derived(() => input.touched && (input.error || !input.matched));

    return render(
      () => (
        <input
          {...restProps}
          id={fieldId}
          type={input.type}
          name={input.name}
          value={input.value}
          disabled={input.disabled}
          placeholder={props.placeholder || ' '}
          aria-invalid={hasError.value ? true : undefined}
          aria-describedby={hasError.value ? errorId : undefined}
          onInput={handleInput}
          onBlur={handleBlur}
          className={classx([
            config.class,
            props.variant === 'filled' && config.filledClass,
            config.size[props.size!],
            hasError.value && config.errorClass,
            props.className,
          ])}
        />
      ),
      displayName
    );
  }, displayName);
}
