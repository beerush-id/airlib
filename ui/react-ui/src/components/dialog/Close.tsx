import { type DialogState, getDialog } from '@airlib/headless/components';
import { type AnyType, captureStack, classx, isNullish } from '@anchorlib/core';
import { render, setup } from '@anchorlib/react';
import type { MouseEventHandler, ReactNode, ComponentProps as ReactProps } from 'react';
import { CloseIcon } from '../../icons/index.js';
import { DIALOG_CONFIGS } from './config.js';

export interface DialogCloseProps extends Omit<ReactProps<'button'>, 'children' | 'value'> {
  value?: unknown;
  iconClass?: string;
  children?: ((dialog?: DialogState<AnyType, AnyType>) => ReactNode) | ReactNode;
}

export const DialogClose = setup<DialogCloseProps>((props) => {
  const dialog = getDialog();
  const restProps = props.$omit(['className', 'iconClass', 'onClick', 'value']);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if ('value' in props) {
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
      'Dialog close button rendered outside of Dialog context.',
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
        className={classx(DIALOG_CONFIGS.close.class, props.className)}
        onClick={handleClick}
      >
        {props.children ?? <CloseIcon className={props.iconClass ?? DIALOG_CONFIGS.close.icon.class} />}
      </button>
    );
  }, 'DialogClose');
}, 'DialogClose');
