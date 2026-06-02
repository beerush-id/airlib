import { effect, mutable } from '@anchorlib/core';
import { FORM_FIELD_SYMBOL, FORM_INPUT, FORM_INVALID_INPUT } from './contant.js';
import { context, getForm, getFormField } from './context.js';
import type { AnyType, FormFieldState, FormInputOptions, FormInputProps, FormInputState, InputType } from './types.js';

/**
 * Creates a reactive reference to a specific form field.
 *
 * @param name - The dot-notation path of the field.
 */
export function formField<T>(name: string): FormFieldState<T> {
  const form = getForm<AnyType>();

  const self = {
    get name(): string {
      return name;
    },
    get value(): T {
      return form?.fields[name];
    },
    set value(value: AnyType) {
      if (!form) return;
      form.fields[name] = value;
    },
    get error(): string[] | undefined {
      return form?.errors[name];
    },
    get valid(): boolean {
      return !form?.errors[name];
    },
    get disabled() {
      return form?.pending ?? false;
    },
    get changed() {
      return form?.changeList.has(name) ?? false;
    },
    input(props: FormInputProps<T>, options?: FormInputOptions<T>) {
      return formInput(props, options);
    },
  } as FormFieldState<T>;

  context.write(FORM_FIELD_SYMBOL, self);

  return self;
}

const BOOL_INPUTS = new Set<InputType>([FORM_INPUT.checkbox, FORM_INPUT.radio, FORM_INPUT.toggle]);

/**
 * Creates a reactive input controller for form elements.
 *
 * @param props - Input properties including `type`, `name`, `value`, and `checked`.
 * @param options - Optional custom `parse` and `stringify` functions.
 */
export function formInput<T>(props: FormInputProps<T>, options?: FormInputOptions<T>): FormInputState {
  const { parse = defaultParse, stringify = defaultStringify } = options ?? ({} as FormInputOptions<T>);

  const field = getFormField<T>();
  const type = props.type ?? FORM_INPUT.text;
  const name = field?.name ?? props.name ?? '';

  const buffer = mutable({ value: '', checked: false });

  const self = {
    locked: false,
    get name() {
      return name;
    },
    get type() {
      return type;
    },
    get value() {
      return buffer.value;
    },
    set value(raw: string) {
      buffer.value = raw;

      const parsed = parse(raw, type);
      if (parsed === FORM_INVALID_INPUT) return;

      self.locked = true;

      if (field) field.value = parsed as T;
      props.value = parsed as T;

      self.locked = false;
    },
    get changed() {
      return field?.changed ?? false;
    },
    get disabled() {
      return (props.disabled || field?.disabled) ?? false;
    },
    get checked() {
      return buffer.checked;
    },
    set checked(value: boolean) {
      const checked = Boolean(value);
      buffer.checked = checked;

      self.locked = true;

      props.checked = checked;
      if ((type === FORM_INPUT.radio || type === FORM_INPUT.toggle) && checked && field)
        field.value = buffer.value as T;
      if (type === FORM_INPUT.checkbox && field) field.value = checked as T;

      self.locked = false;
    },
    get error() {
      return field?.error;
    },
    get valid() {
      return field?.valid ?? true;
    },
    settled() {
      if (BOOL_INPUTS.has(type)) return;

      const value = field?.value ?? props.value;
      buffer.value = stringify(value as T, type);
    },
  } as FormInputState;

  if (type === FORM_INPUT.radio || type === FORM_INPUT.toggle) {
    effect(() => {
      const value = props.value;
      const checked = field?.value === value;
      if (self.locked) return;

      buffer.value = value as string;
      buffer.checked = checked;
    });
  } else if (type === FORM_INPUT.checkbox) {
    effect(() => {
      const checked = field?.value ?? props.checked ?? false;
      if (self.locked) return;
      buffer.checked = checked as boolean;
    });
  } else {
    effect(() => {
      const value = field?.value ?? props.value;
      if (self.locked) return;
      buffer.value = stringify(value as T, type);
    });
  }

  return self;
}

function defaultParse(raw: string, type: InputType): unknown {
  switch (type) {
    case FORM_INPUT.number:
    case FORM_INPUT.range: {
      const n = Number(raw);
      return Number.isNaN(n) ? FORM_INVALID_INPUT : n;
    }
    case FORM_INPUT.date:
    case FORM_INPUT.datetimeLocal:
    case FORM_INPUT.month:
    case FORM_INPUT.week:
    case FORM_INPUT.time: {
      if (!raw) return FORM_INVALID_INPUT;
      const d = new Date(raw);
      return Number.isNaN(d.getTime()) ? FORM_INVALID_INPUT : d;
    }
    default:
      return raw;
  }
}

function defaultStringify(value: unknown, type: InputType): string {
  if (value === undefined || value === null) return '';

  switch (type) {
    case FORM_INPUT.date: {
      const d = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(d.getTime())) return '';
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    case FORM_INPUT.datetimeLocal: {
      const d = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(d.getTime())) return '';
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    case FORM_INPUT.time: {
      const d = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(d.getTime())) return '';
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    case FORM_INPUT.month: {
      const d = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(d.getTime())) return '';
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    }
    case FORM_INPUT.week: {
      const d = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(d.getTime())) return '';
      return `${d.getFullYear()}-W${pad(getWeekNumber(d))}`;
    }
    default:
      return String(value);
  }
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function getWeekNumber(d: Date): number {
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
}
