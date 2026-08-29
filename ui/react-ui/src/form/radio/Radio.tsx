import { formInput, getFormField } from '@airlib/form';
import { createSelectionState, selectionCtx } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import type { AnyType } from '@airlib/core';
import { type Bindable, render, setup } from '@airlib/react';
import type { ComponentProps, MouseEventHandler } from 'react';
import { RADIO_CONFIGS } from './config.js';

export interface RadioProps extends Omit<ComponentProps<'button'>, 'aria-checked'> {
  checked?: Bindable<boolean>;
}

export interface RadioGroupProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value?: Bindable<string | number | boolean>;
  onChange?: (value: string | number | boolean) => void;
}

export const Radio = setup<RadioProps>((props) => {
  (props as AnyType).type = 'radio';

  const restProps = props.$omit(['checked', 'className', 'onClick', 'onKeyDown']);

  const input = formInput(props as AnyType);
  const selection = selectionCtx.get();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (selection) {
      selection.select(props.value);
    } else {
      input.checked = true;
    }

    props.onClick?.(e);
  };

  return render(
    () => (
      <button
        {...restProps}
        type="button"
        role="radio"
        aria-checked={selection?.value === props.value || input.checked ? 'true' : 'false'}
        className={classx([RADIO_CONFIGS.containerClass, props.className])}
        onClick={handleClick}
      >
        <span
          className={classx([
            RADIO_CONFIGS.visualClass,
            (selection?.value === props.value || input.checked) && RADIO_CONFIGS.visualCheckedClass,
          ])}
        >
          <span
            className={classx([
              RADIO_CONFIGS.dotClass,
              (selection?.value === props.value || input.checked) && RADIO_CONFIGS.dotCheckedClass,
            ])}
          />
        </span>
      </button>
    ),
    'Radio'
  );
}, 'Radio');

export const RadioGroup = setup<RadioGroupProps>((props) => {
  const field = getFormField();
  const restProps = props.$omit(['className', 'children', 'value', 'onChange']);

  if ('value' in props) {
    createSelectionState(field ?? props);
  }

  return render(
    () => (
      <div {...restProps} className={classx([RADIO_CONFIGS.groupClass, props.className])}>
        {props.children}
      </div>
    ),
    'RadioGroup'
  );
}, 'RadioGroup');
