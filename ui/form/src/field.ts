import { effect, mutable } from '@anchorlib/core';
import { FORM_FIELD_SYMBOL } from './constant.js';
import { context, getForm } from './context.js';
import type { FormInputOptions, FormInputProps } from './input.js';
import { FormInput } from './input.js';
import type { AnyType } from './types.js';

export class FormField<T> {
  get name(): string {
    return this.#name;
  }

  get value(): T {
    return this.#form?.fields[this.#name];
  }

  set value(value: T) {
    if (!this.#form) return;
    this.#form.fields[this.#name] = value;
  }

  get error(): string[] | undefined {
    return this.#form?.errors[this.#name];
  }

  get valid(): boolean {
    return !this.#form?.errors[this.#name];
  }

  get matched(): boolean {
    return this.#matched.value;
  }

  get disabled() {
    return this.#form?.pending ?? false;
  }

  get required() {
    const req = this.#required;
    if (typeof req === 'function') return req();
    if (typeof req === 'boolean') return req;
    return this.#form?.isRequired(this.#name) ?? false;
  }

  get changed() {
    return this.#form ? Object.hasOwn(this.#form.changeList, this.#name) : false;
  }

  get touched() {
    return this.#form?.touched[this.#name] ?? false;
  }

  #name: string;
  #form: AnyType;
  #matched: { value: boolean };
  #required?: boolean | (() => boolean);

  constructor(name: string, match?: string | ((form: AnyType) => boolean), required?: boolean | (() => boolean)) {
    this.#name = name;
    this.#form = getForm<AnyType>();
    this.#matched = match ? mutable({ value: true }) : { value: true };
    this.#required = required;

    if (match && this.#form) {
      const form = this.#form;
      effect(() => {
        this.#matched.value = typeof match === 'function' ? match(form) : form.fields[name] === form.fields[match];
      });
    }

    context.write(FORM_FIELD_SYMBOL, this);
  }

  input(props: FormInputProps<T>, options?: FormInputOptions<T>) {
    return new FormInput(props, options);
  }

  clear() {
    this.#form?.clearField(this.#name);
  }

  reset() {
    this.#form?.resetField(this.#name);
  }
}

/** @deprecated Use `FormField` instead. */
export type FormFieldState<T> = FormField<T>;

/**
 * Creates a reactive reference to a specific form field.
 */
export function formField<T>(
  name: string,
  match?: string | ((form: AnyType) => boolean),
  required?: boolean | (() => boolean)
): FormField<T> {
  return new FormField(name, match, required);
}
