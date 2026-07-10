import { getDialog } from '@airlib/headless/components';
import { captureStack } from '@anchorlib/core';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes, MouseEventHandler } from 'react';
import { DIALOG_CONFIGS } from './config.js';

export interface DialogCancelProps extends HTMLAttributes<HTMLButtonElement> {
  value?: unknown;
  reason?: string;
}

export const DialogCancel = setup<DialogCancelProps>((props) => {
  const dialog = getDialog();
  const restProps = props.$omit(['className', 'onClick', 'value', 'reason']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (props.reason) {
      dialog?.hide(new Error(props.reason));
    } else {
      dialog?.hide(props.value);
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

  return render(
    () => (
      <button
        {...restProps}
        type="button"
        className={props.className || DIALOG_CONFIGS.cancel.class}
        onClick={handleClick}
      >
        {props.children}
      </button>
    ),
    'DialogCancel'
  );
}, 'DialogCancel');
