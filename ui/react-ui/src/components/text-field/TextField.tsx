import { classx } from '@airlib/uikit/utils';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { ComponentProps, InputEventHandler } from 'react';
import { TEXT_FIELD_CONFIGS } from './config.js';

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  value?: Bindable<string | number | readonly string[]>;
}

export const TextField = setup<TextFieldProps>((props) => {
  const restProps = props.$omit(['variant', 'className', 'value', 'onInput', 'placeholder', 'size']);

  const handleInput: InputEventHandler<HTMLInputElement> = (e) => {
    props.value = e.currentTarget.value;
    props.onInput?.(e);
  };

  return render(
    () => (
      <input
        {...restProps}
        placeholder={props.placeholder || ' '}
        value={props.value ?? ''}
        onInput={handleInput}
        className={classx([
          TEXT_FIELD_CONFIGS.class,
          props.variant !== 'outlined' ? TEXT_FIELD_CONFIGS.filledClass : undefined,
          props.size ? TEXT_FIELD_CONFIGS.size[props.size] : undefined,
          props.className,
        ])}
      />
    ),
    'TextField'
  );
}, 'TextField');
