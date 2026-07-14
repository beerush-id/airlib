import { formInput } from '@airlib/form';
import { classx } from '@airlib/headless/utils';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { ComponentProps, InputEventHandler } from 'react';
import { TEXTAREA_CONFIGS } from './config.js';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'value' | 'size' | 'children'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  value?: Bindable<string | number | readonly string[]>;
}

export const Textarea = setup<TextareaProps>((props) => {
  const input = formInput(props);
  const restProps = props.$omit(['variant', 'className', 'value', 'onInput', 'placeholder', 'size']);

  const handleInput: InputEventHandler<HTMLTextAreaElement> = (e) => {
    input.value = e.currentTarget.value;
    props.onInput?.(e);
  };

  return render(
    () => (
      <textarea
        {...restProps}
        placeholder={props.placeholder || ' '}
        value={input.value}
        onInput={handleInput}
        className={classx([
          TEXTAREA_CONFIGS.class,
          props.variant === 'filled' ? TEXTAREA_CONFIGS.filledClass : undefined,
          props.size ? TEXTAREA_CONFIGS.size[props.size] : undefined,
          props.className,
        ])}
      />
    ),
    'Textarea'
  );
}, 'Textarea');
