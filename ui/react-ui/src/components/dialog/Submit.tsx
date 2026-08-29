import { type DialogState, getDialog } from '@airlib/headless/components';
import { type AnyType, captureStack } from '@airlib/core';
import { classx, render, setup } from '@airlib/react';
import type { ComponentProps as ReactProps, MouseEventHandler, ReactNode } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export interface DialogSubmitProps extends Omit<ReactProps<'button'>, 'children' | 'value'> {
  value?: unknown;
  children?: ((dialog?: DialogState<AnyType, AnyType>) => ReactNode) | ReactNode;
}

export const DialogSubmit = setup<DialogSubmitProps>((props) => {
  const dialog = getDialog();
  const restProps = props.$omit(['className', 'onClick', 'value']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    dialog?.hide(props.value);
    props.onClick?.(e);
  };

  if (!dialog) {
    const error = new Error('Outside of Dialog context.');
    captureStack.violation.general(
      'Outside of Dialog context.',
      'Dialog submit button rendered outside of Dialog context.',
      error
    );
  }

  return render(() => {
    if (typeof props.children === 'function') {
      return props.children(dialog);
    }

    return (
      <button
        {...restProps}
        type="button"
        className={classx(DIALOG_CONFIGS.submit.class, props.className)}
        onClick={handleClick}
      >
        {props.children}
      </button>
    );
  }, 'DialogSubmit');
}, 'DialogSubmit');
