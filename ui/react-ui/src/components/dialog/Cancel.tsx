import { type DialogState, getDialog } from '@airlib/headless/components';
import { type AnyType, captureStack, isNullish } from '@airlib/core';
import { classx, render, setup } from '@airlib/react';
import type { ComponentProps as ReactProps, MouseEventHandler, ReactNode } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export interface DialogCancelProps extends Omit<ReactProps<'button'>, 'children' | 'value'> {
  value?: unknown;
  reason?: string;
  children?: ((dialog?: DialogState<AnyType, AnyType>) => ReactNode) | ReactNode;
}

export const DialogCancel = setup<DialogCancelProps>((props) => {
  const dialog = getDialog();
  const restProps = props.$omit(['className', 'onClick', 'reason', 'value']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (props.reason) {
      dialog?.hide(new Error(props.reason));
    } else if ('value' in props) {
      dialog?.hide(props.value);
    } else {
      dialog?.abort();
    }

    props.onClick?.(e);
  };

  if (!dialog) {
    const error = new Error('Outside of Dialog context.');
    captureStack.violation.general(
      'Outside of Dialog context.',
      'Dialog cancel button rendered outside of Dialog context.',
      error
    );
  }

  if ('value' in props && dialog && isNullish(dialog.init.abortWith)) {
    dialog.init.abortWith = props.value;
  }

  return render(() => {
    if (typeof props.children === 'function') {
      return props.children(dialog);
    }

    return (
      <button
        {...restProps}
        type="button"
        className={classx(DIALOG_CONFIGS.cancel.class, props.className)}
        onClick={handleClick}
      >
        {props.children}
      </button>
    );
  }, 'DialogCancel');
}, 'DialogCancel');
