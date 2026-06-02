import { getContext, setContext } from '@anchorlib/core';
import type { ZodType } from 'zod';
import { FORM_FIELD_SYMBOL, FORM_SYMBOL } from './contant.js';
import type { ContextBridge, FormFieldState, FormState } from './types.js';

export const context: ContextBridge = {
  read: getContext,
  write: setContext,
};

export function setContextBridge(bridge: ContextBridge) {
  if (typeof bridge?.read === 'function') context.read = bridge.read;
  if (typeof bridge?.write === 'function') context.write = bridge.write;
}

export function getForm<T extends ZodType>(): FormState<T> | undefined {
  return context.read<FormState<T>>(FORM_SYMBOL);
}

export function getFormField<T>(): FormFieldState<T> | undefined {
  return context.read(FORM_FIELD_SYMBOL);
}
