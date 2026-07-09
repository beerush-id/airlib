import { classx } from '@airlib/uikit/utils';
import { setup, render, type Bindable } from '@anchorlib/react';
import type { ComponentProps, InputEventHandler } from 'react';
import { TEXTAREA_CONFIGS } from './config.js';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'value' | 'size' | 'children'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  value?: Bindable<string | number | readonly string[]>;
}

export const Textarea = setup<TextareaProps>((props) => {
  const restProps = props.$omit(['variant', 'className', 'value', 'onInput', 'placeholder', 'size']);

  const handleInput: InputEventHandler<HTMLTextAreaElement> = (e) => {
    props.value = e.currentTarget.value;
    props.onInput?.(e);
  };

  return render(
    () => (
      <textarea
        {...restProps}
        placeholder={props.placeholder || ' '}
        value={props.value ?? ''}
        onInput={handleInput}
        className={classx([
          TEXTAREA_CONFIGS.class,
          props.variant !== 'outlined' ? TEXTAREA_CONFIGS.filledClass : undefined,
          props.size ? TEXTAREA_CONFIGS.size[props.size] : undefined,
          props.className,
        ])}
      />
    ),
    'Textarea'
  );
}, 'Textarea');
