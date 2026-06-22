import { getDialog } from '@airlib/uikit/components';
import { captureStack } from '@anchorlib/core';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes, MouseEventHandler } from 'react';
import { UI_CONFIGS } from '../../config.js';

export interface DialogSubmitProps extends HTMLAttributes<HTMLButtonElement> {
  value?: unknown;
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

  return render(
    () => (
      <button
        {...restProps}
        type="button"
        className={props.className ?? UI_CONFIGS.dialog.submitClass}
        onClick={handleClick}
      >
        {props.children}
      </button>
    ),
    'DialogSubmit'
  );
}, 'DialogSubmit');
