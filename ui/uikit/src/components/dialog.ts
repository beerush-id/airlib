import { anchor, effect, getContext, mutable, onCleanup, setContext, untrack } from '@anchorlib/core';
import { createFocusTrap } from '../utils/index.js';

const DIALOG_CONTEXT_KEY = 'air-dialog';

export interface DialogInit<T> {
  data?: T | (() => T);
  open?: boolean;
  container?: HTMLElement;
}

export class DialogState<T, O> {
  private resolved = false;

  get open() {
    return this.init.open ?? false;
  }
  get data(): T {
    if (typeof this.init.data === 'function') {
      return (this.init.data as () => T)();
    }

    return this.init.data as T;
  }

  get container() {
    return this.init.container;
  }
  set container(value) {
    this.init.container = value;
  }

  private accept?: (result?: O) => void;
  private reject?: (reason?: Error) => void;
  private promise?: Promise<O | undefined>;

  constructor(private init: DialogInit<T> = mutable({ open: false })) {
    if (!anchor.has(init)) {
      this.init = mutable(init);
    }

    onCleanup(() => {
      this.hide();
    });
  }

  public show(data?: T): Promise<O | void>;
  public show(...args: [T]) {
    if (this.promise) return this.promise;

    untrack(() => {
      if (args.length > 0) {
        this.init.data = args[0];
      }

      this.init.open = true;
    });

    this.promise = new Promise((accept, reject) => {
      this.accept = accept;
      this.reject = reject;
    });

    this.resolved = false;
    return this.promise;
  }

  public hide(result?: O | Error) {
    if (this.resolved) return;

    untrack(() => (this.init.open = false));

    if (result instanceof Error) {
      this.reject?.(result);
    } else {
      this.accept?.(result);
    }

    this.promise = undefined;
    this.resolved = true;
    return this;
  }
}

export function createDialog<T, O>(init: DialogInit<T> = mutable({ open: false })) {
  const dialog = new DialogState<T, O>(init);

  effect.client(() => {
    if (dialog.open && dialog.container) {
      const self = dialog.container;

      const release = createFocusTrap(self, {
        onRelease: () => dialog.hide(),
      });

      return () => {
        release();
      };
    }
  });

  return dialog;
}

export function setDialog<T, O>(dialog: DialogState<T, O>) {
  setContext(DIALOG_CONTEXT_KEY, dialog);
}

export function getDialog<T, O>(): DialogState<T, O> | undefined {
  return getContext<DialogState<T, O>>(DIALOG_CONTEXT_KEY);
}
