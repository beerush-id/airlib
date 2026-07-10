import { getDialog } from '@airlib/headless/components';
import { captureStack } from '@anchorlib/core';
import { render, setup } from '@anchorlib/react';
import type { HTMLAttributes, MouseEventHandler } from 'react';
import { DIALOG_CONFIGS } from './config.js';
import { CloseIcon } from '../../icons/index.js';

export interface DialogCloseProps extends HTMLAttributes<HTMLButtonElement> {
  iconClass?: string;
}

export const DialogClose = setup<DialogCloseProps>((props) => {
  const dialog = getDialog();
  const restProps = props.$omit(['className', 'iconClass', 'onClick']);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    dialog?.hide();
    props.onClick?.(e);
  };

  if (!dialog) {
    const error = new Error('Outside of Dialog context.');
    captureStack.violation.general(
      'Outside of Dialog context.',
      'Dialog close button rendered outside of Dialog context.',
      error
    );
  }

  return render(
    () => (
      <button
        {...restProps}
        type="button"
        className={props.className || DIALOG_CONFIGS.close.class}
        onClick={handleClick}
      >
        {props.children ?? <CloseIcon className={props.iconClass ?? DIALOG_CONFIGS.close.icon.class} />}
      </button>
    ),
    'DialogClose'
  );
}, 'DialogClose');
