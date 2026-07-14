import { formInput } from '@airlib/form';
import type { AnyType } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { ComponentProps, FocusEventHandler, InputEventHandler } from 'react';
import { TEXT_FIELD_CONFIGS } from './config.js';

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  value?: Bindable<string | number | readonly string[]>;
}

export const TextField = setup<TextFieldProps>((props) => {
  const $props = props as AnyType;
  const restProps = props.$omit(['variant', 'className', 'value', 'onInput', 'placeholder', 'size']);
  const input = formInput(props as AnyType);
  const fieldId = $props.id || input.name.replace(/\./g, '-');
  const errorId = `${fieldId}-error`;

  const handleInput: InputEventHandler<HTMLInputElement> = (e) => {
    input.value = e.currentTarget.value;
    $props.onInput?.(e);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    input.settled();
    $props.onBlur?.(e);
  };

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
        aria-invalid={input.error ? true : undefined}
        aria-describedby={input.error ? errorId : undefined}
        onInput={handleInput}
        onBlur={handleBlur}
        className={classx([
          TEXT_FIELD_CONFIGS.class,
          props.variant === 'filled' ? TEXT_FIELD_CONFIGS.filledClass : undefined,
          props.size ? TEXT_FIELD_CONFIGS.size[props.size] : undefined,
          props.className,
        ])}
      />
    ),
    'TextField'
  );
}, 'TextField');
