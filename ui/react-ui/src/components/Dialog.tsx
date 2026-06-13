import { type AnyType, type DialogState, getDialog, setDialog } from '@airlib/uikit';
import { dragRef, MOUSE_MODIFIERS } from '@airlib/uikit/utils';
import { captureStack, isBrowser } from '@anchorlib/core';
import { type ComponentProps, nodeRef, render, setup } from '@anchorlib/react';
import type { DialogHTMLAttributes, FC, HTMLAttributes, MouseEventHandler, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { UI_CONFIGS } from '../config.js';
import { CloseIcon } from '../icons/index.js';

export type DialogBaseProps = {
  ref?: RefObject<HTMLDivElement> | ((node?: HTMLDivElement) => void);
  name?: string;
  renderMode?: 'always' | 'lazy';
  bodyClass?: string;
  overlayClass?: string;
};

export interface DialogProps<T, O> extends DialogBaseProps, Omit<DialogHTMLAttributes<HTMLDivElement>, 'children'> {
  dialog: DialogState<T, O>;
  children?: ReactNode;
}

export type DialogComponent<T, O> = ReturnType<typeof setup<DialogProps<T, O>>> & {
  get(): DialogState<T, O>;
  set(state: DialogState<T, O>): void;
};

export const DialogHero: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={className ?? UI_CONFIGS.dialog.heroClass} {...rest}>
    {children}
  </div>
);
DialogHero.displayName = 'DialogHero';

export const DialogHeader: FC<HTMLAttributes<HTMLElement>> = ({ className, children, ...rest }) => (
  <header className={className ?? UI_CONFIGS.dialog.headerClass} {...rest}>
    {children}
  </header>
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle: FC<HTMLAttributes<HTMLElement>> = ({ className, children, ...rest }) => (
  <h3 className={className ?? UI_CONFIGS.dialog.titleClass} {...rest}>
    {children}
  </h3>
);
DialogTitle.displayName = 'DialogTitle';

export const DialogContent: FC<HTMLAttributes<HTMLElement>> = ({ className, children, ...rest }) => (
  <section className={className ?? UI_CONFIGS.dialog.contentClass} {...rest}>
    {children}
  </section>
);
DialogContent.displayName = 'DialogContent';

export const DialogFooter: FC<HTMLAttributes<HTMLElement>> = ({ className, children, ...rest }) => (
  <footer className={className ?? UI_CONFIGS.dialog.footerClass} {...rest}>
    {children}
  </footer>
);
DialogFooter.displayName = 'DialogFooter';

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
        className={props.className ?? UI_CONFIGS.dialog.cancelClass}
        onClick={handleClick}
      >
        {props.children}
      </button>
    ),
    'DialogCancel'
  );
}, 'DialogCancel');

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
        className={props.className ?? UI_CONFIGS.dialog.closeClass}
        onClick={handleClick}
      >
        {props.children ?? <CloseIcon className={props.iconClass ?? UI_CONFIGS.dialog.closeIconClass} />}
      </button>
    ),
    'DialogClose'
  );
}, 'DialogClose');

export function dialogComponent<T, O>(
  children?: (dialog: DialogState<T, O>) => ReactNode,
  name?: string
): DialogComponent<T, O> {
  const Dialog = setup<DialogProps<AnyType, AnyType>>(
    (props) => {
      if (!children) children = () => props.children;

      const bodyRef = dragRef<HTMLDivElement>({
        xModifier: MOUSE_MODIFIERS.shift,
        yModifier: MOUSE_MODIFIERS.meta,
      });
      const dialogRef = createDialogRef(props);

      setDialog(props.dialog);

      const assignRef = (el: HTMLDivElement | null) => {
        bodyRef.target = el as HTMLDivElement;
        bodyRef.container = document.body;
      };

      const content = () => (
        <div role="dialog" ref={dialogRef} {...dialogRef.attributes}>
          <div className={props.overlayClass ?? UI_CONFIGS.dialog.overlayClass} />
          <div ref={assignRef} data-focus-area className={props.bodyClass ?? UI_CONFIGS.dialog.bodyClass}>
            {children!(props.dialog)}
          </div>
        </div>
      );

      return render(
        () => {
          if (props.renderMode === 'lazy' && !props.dialog.open) return null;
          return teleport(content());
        },
        name ? `${name}Dialog` : 'Dialog'
      );
    },
    name ? `${name}Dialog` : 'Dialog'
  );

  return Object.assign(Dialog, {
    get() {
      return getDialog<T, O>();
    },
    set(state: DialogState<T, O>) {
      setDialog(state);
    },
  }) as DialogComponent<T, O>;
}

export const Dialog = dialogComponent<AnyType, AnyType>();

export function createDialogRef(props: ComponentProps<DialogProps<unknown, unknown>>) {
  const restProps = omitProps(props);

  return nodeRef<HTMLDivElement>((node) => {
    if (node) {
      props.dialog.container = node;
      if (props.ref) {
        typeof props.ref === 'function' ? props.ref(node) : (props.ref.current = node);
      }
    }

    return {
      ...restProps,
      className: props.className ?? UI_CONFIGS.dialog.class,
      'aria-modal': props.dialog.open ? 'true' : undefined,
      'aria-hidden': props.dialog.open ? 'false' : 'true',
      'aria-labelledby': props.name ?? props['aria-labelledby'],
    };
  });
}

function teleport(content: ReactNode) {
  if (!isBrowser()) return content;
  return createPortal(content, document.querySelector(UI_CONFIGS.dialog.portal) ?? document.body);
}

function omitProps(props: ComponentProps<DialogProps<unknown, unknown>>) {
  return props.$omit([
    'role',
    'name',
    'dialog',
    'children',
    'className',
    'renderMode',
    'bodyClass',
    'overlayClass',

    'aria-modal',
    'aria-labelledby',
  ]);
}
