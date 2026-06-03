import type { ZodType } from 'zod';
import { FORM_SYMBOL } from './constant.js';
import { context } from './context.js';
import { formField } from './field.js';
import { formState } from './form.js';
import type { AnyType, FormFactory } from './types.js';

export { FORM_FIELD_SYMBOL, FORM_INPUT, FORM_INVALID_INPUT, FORM_STATUS, FORM_SYMBOL } from './constant.js';
export { getForm, getFormField, setContextBridge } from './context.js';
export * from './field.js';
export * from './form.js';
export * from './types.js';

/**
 * Creates a form factory based on a Zod schema.
 *
 * @param schema - The Zod schema that defines the form's data structure.
 */
export function formFactory<T extends ZodType>(schema: T): FormFactory<T> {
  const factory = ((props) => {
    return formState(schema as AnyType, props);
  }) as FormFactory<T>;

  factory.get = () => context.read(FORM_SYMBOL);
  factory.field = (field) => {
    return formField(field);
  };

  return factory;
}
