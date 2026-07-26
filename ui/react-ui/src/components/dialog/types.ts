import type { DialogState } from '@airlib/headless/components';
import type { setup } from '@anchorlib/react';
import type { DialogHTMLAttributes, ReactNode, RefObject } from 'react';

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
  show(data: T): Promise<O>;
  state(): DialogState<T, O>;
};
