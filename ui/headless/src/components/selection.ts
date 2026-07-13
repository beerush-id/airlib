import { createContext, mutable } from '@anchorlib/core';
import type { AnyType } from '../types.js';

export type SelectionContext<T> = {
  value?: T;
  select: (value: T) => void;
};

export type SelectionInput<T> = {
  value?: T;
};

export const selectionCtx = createContext<SelectionContext<AnyType>>();

export function createSelectionState<T = string>(input?: SelectionInput<T>): SelectionContext<T> {
  const state = mutable({
    value: input?.value,
    select: (value?: T) => {
      state.value = value;
      if (input) input.value = value;
    },
  });

  selectionCtx.set(state);
  return state as SelectionContext<T>;
}
