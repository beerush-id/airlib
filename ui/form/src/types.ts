import type { input, output, ZodType } from 'zod';
import { FORM_INPUT, FORM_STATUS } from './constant.js';

type Primitive = null | undefined | string | number | boolean | symbol | bigint | Date;
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5];

export type DeepPaths<T, D extends number = 4> = [D] extends [never]
  ? never
  : T extends Primitive
    ? never
    : T extends ReadonlyArray<infer V>
      ? IsTuple<T> extends true
        ? {
            [K in TupleKeys<T>]-?: K extends string | number ? `${K}` | Join<K, DeepPaths<T[K], Prev[D]>> : never;
          }[TupleKeys<T>]
        : `${number}` | Join<`${number}`, DeepPaths<V, Prev[D]>>
      : T extends object
        ? { [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, DeepPaths<T[K], Prev[D]>> : never }[keyof T]
        : never;

export type PathValue<T, P> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : T extends ReadonlyArray<infer V>
      ? K extends `${number}`
        ? PathValue<V, Rest>
        : never
      : never
  : P extends keyof T
    ? T[P]
    : T extends ReadonlyArray<infer V>
      ? P extends `${number}`
        ? V
        : never
      : never;

export type FormFields<T> = {
  [K in DeepPaths<T> | keyof T]: PathValue<T, K>;
};

export type FormErrors<T> = {
  [K in DeepPaths<T> | keyof T]?: string[];
};

// biome-ignore lint/suspicious/noExplicitAny: Expect any.
export type AnyType = any;
export type FormDataMap = Record<string, AnyType>;
export type FormErrorMap = Record<string, string[]>;

export type FormStateProps<T> = {
  value?: T;
};

/**
 * Configuration options for initializing a reactive form state.
 */
export type FormStateOptions = {
  strict?: boolean;
  validateOnInit?: boolean;
  settleOnSubmit?: boolean;
  onChange?: (data: FormDataMap, errors: FormErrorMap) => void;
};

/**
 * A strictly-typed factory for creating and managing form states.
 *
 * @template T - The Zod schema defining the form's data structure.
 */
export type FormFactory<T extends ZodType> = ((props: FormStateProps<input<T>>) => FormState<T>) & {
  /**
   * Retrieves the currently active `FormState`.
   */
  get(): FormState<T> | undefined;

  /**
   * Creates a reactive reference to a specific form field.
   *
   * @param field - The dot-notation path of the field.
   */
  field<K extends DeepPaths<input<T>>>(field: K): FormFieldState<PathValue<input<T>, K>>;
};

export type ContextReader = <T>(key: symbol) => T | undefined;
export type ContextWriter = (key: symbol, value: AnyType) => void;

export type ContextBridge = {
  read: ContextReader;
  write: ContextWriter;
};

export type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS];

/**
 * Represents the core reactive form state.
 * Manages data tracking, errors, schema validation, and synchronization.
 */
export type FormState<T extends ZodType> = {
  get fields(): FormFields<input<T>>;
  get errors(): FormErrors<input<T>>;
  get changed(): boolean;
  get touched(): Record<string, boolean>;
  get valid(): boolean;
  get output(): output<T>;
  get changes(): Partial<output<T>>;
  get changeList(): Record<string, AnyType>;

  get error(): Error | undefined;
  get status(): FormStatus;
  get pending(): boolean;
  get canSubmit(): boolean;

  locked: boolean;
  field<K extends DeepPaths<input<T>>>(field: K): FormFieldState<PathValue<input<T>, K>>;
  reset(): FormState<T>;
  submit(
    handler: (data: output<T>, changes: Partial<output<T>>) => Promise<void> | void,
    settle?: boolean
  ): Promise<void>;
};

/**
 * Reactive state scoped to a specific field within a form.
 * Provides targeted access to the field's value, validation status, and errors.
 */
export type FormFieldState<T> = {
  get name(): string;
  get value(): T;
  set value(value: T);
  get error(): string[] | undefined;
  get valid(): boolean;
  get matched(): boolean;
  get changed(): boolean;
  get touched(): boolean;
  get disabled(): boolean;
  input(props: FormInputProps<T>, options?: FormInputOptions<T>): FormInputState;
};

export type InputType = (typeof FORM_INPUT)[keyof typeof FORM_INPUT];

/**
 * Properties required to bind a UI input element to a form field.
 */
export type FormInputProps<T = unknown> = {
  type?: InputType;
  name?: string;
  value?: T;
  checked?: boolean;
  disabled?: boolean;
};

/**
 * Optional parsing and formatting hooks for form inputs.
 * Use these to transform values between the UI representation (string) and data model.
 */
export type FormInputOptions<T = unknown> = {
  parse?: (raw: string, type: InputType) => T;
  stringify?: (value: T, type: InputType) => string;
};

/**
 * Reactive state and controls for a bound input element.
 * Manages two-way data binding, buffering, stringification, and parsing.
 */
export type FormInputState = {
  get name(): string;
  get type(): InputType;
  get value(): string;
  set value(value: string);
  get error(): string[] | undefined;
  get valid(): boolean;
  get checked(): boolean;
  set checked(checked: boolean);
  get changed(): boolean;
  get touched(): boolean;
  get disabled(): boolean;
  locked: boolean;
  settled(): void;
};
