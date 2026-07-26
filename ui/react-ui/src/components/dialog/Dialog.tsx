import { type AnyType, createDialogState, type DialogState, getDialog, setDialog } from '@airlib/headless';
import { classx, mutable, subscribe } from '@anchorlib/core';
import { For, render, setup, template } from '@anchorlib/react';
import type { ReactNode } from 'react';
import { teleport } from '../../lib/index.js';
import { DIALOG_CONFIGS } from './config.js';
import { createDialogRef } from './supporting.js';
import type { DialogComponent, DialogProps } from './types.js';

export const CONTROLLED_DIALOGS = mutable(new Map<DialogState<AnyType, AnyType>, DialogComponent<AnyType, AnyType>>());

export function createDialog<T, O>(
  children?: (data: T, dialog: DialogState<T, O>) => ReactNode,
  name?: string
): DialogComponent<T, O> {
  const Dialog = setup<DialogProps<AnyType, AnyType>>(
    (props) => {
      const content: typeof children = typeof children === 'function' ? children : () => props.children;
      const dialogRef = createDialogRef(props);

      setDialog(props.dialog);

      return render(
        () => {
          if (props.renderMode !== 'always' && !props.dialog.open) return null;

          return teleport(
            <div role="dialog" ref={dialogRef} {...dialogRef.attributes}>
              <div className={classx(DIALOG_CONFIGS.overlay.class, props.overlayClass)} />
              <div role="region" className={classx(DIALOG_CONFIGS.body.class, props.bodyClass)}>
                {content!(props.dialog.data ?? {}, props.dialog)}
              </div>
            </div>
          );
        },
        name ? `${name}Dialog` : 'Dialog'
      );
    },
    name ? `${name}Dialog` : 'Dialog'
  );

  return Object.assign(Dialog, {
    show: (data: T = {} as T) => {
      const state = createDialogState({ data });
      CONTROLLED_DIALOGS.set(state, Dialog as AnyType);

      const unsubscribe = subscribe(state.init, (_, e) => {
        if (e.type === 'init') return;
        if (!state.open) {
          unsubscribe();
          CONTROLLED_DIALOGS.delete(state);
        }
      });

      return state.show();
    },
    get() {
      return getDialog<T, O>();
    },
    set(state: DialogState<T, O>) {
      setDialog(state);
    },
  }) as DialogComponent<T, O>;
}

export const Dialog = createDialog<AnyType, AnyType>();

export const DialogHost = template(
  () => <For each={() => Array.from(CONTROLLED_DIALOGS)}>{([state, Renderer]) => <Renderer dialog={state} />}</For>,
  'DialogHost'
);
