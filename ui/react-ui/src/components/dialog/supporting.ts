import { type ComponentProps, nodeRef } from '@anchorlib/react';
import { UI_CONFIGS } from '../../config.js';
import type { DialogProps } from './types.js';

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
