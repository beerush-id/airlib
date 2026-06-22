import { type AnyType, type DialogState, getDialog, setDialog } from '@airlib/uikit';
import { dragRef, MOUSE_MODIFIERS } from '@airlib/uikit/utils';
import { render, setup } from '@anchorlib/react';
import type { ReactNode } from 'react';
import { UI_CONFIGS } from '../../config.js';
import { teleport } from '../../lib/index.js';
import { createDialogRef } from './supporting.js';
import type { DialogComponent, DialogProps } from './types.js';

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
