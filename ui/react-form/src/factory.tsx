import {
  type AnyType,
  type DeepPaths,
  formField,
  type FormFieldState,
  type FormState,
  formState,
  getForm,
  type PathValue,
} from '@airlib/form';
import { render, setup } from '@anchorlib/react';
import type { FormHTMLAttributes, HTMLAttributes, ReactNode, SubmitEvent } from 'react';
import type { input, ZodType } from 'zod';

interface TypedFormProps<T> extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  value?: T;
  onSubmit?: (data: T, changes: Partial<T>, e: SubmitEvent<HTMLFormElement>) => Promise<void> | void;
}

interface TypedFieldProps<T, S extends ZodType> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: DeepPaths<T>;
  match?: DeepPaths<T> | ((form: FormState<S>) => boolean);
  label?: string;
  labelClass?: string;
  errorClass?: string;
  children?: ReactNode | ((field: FormFieldState<unknown>) => ReactNode);
}

type TypedForm<T extends ZodType> = ReturnType<typeof setup<TypedFormProps<input<T>>>> & {
  Field: ReturnType<typeof setup<TypedFieldProps<input<T>, T>>>;
  FieldList: <K extends DeepPaths<input<T>>>(props: {
    name: K;
    children: (items: NonNullable<PathValue<input<T>, K>> extends (infer U)[] ? U[] : never) => ReactNode;
  }) => ReactNode;
  get(): FormState<T> | undefined;
  field<K extends DeepPaths<input<T>>>(path: K): FormFieldState<PathValue<input<T>, K>>;
};

export function createForm<T extends ZodType>(schema: T): TypedForm<T> {
  const Form = setup<TypedFormProps<input<T>>>((props) => {
    const $props = props as AnyType;
    const form = formState(schema as AnyType, $props);
    const rest = props.$omit(['value', 'onSubmit']);

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if ($props.onSubmit) {
        form.submit((data: AnyType, changes: AnyType) => $props.onSubmit(data, changes, e));
      }
    };

    return render(
      () => (
        <form {...rest} onSubmit={handleSubmit}>
          {$props.children}
        </form>
      ),
      'FormView'
    );
  }, 'Form');

  const Field = setup<TypedFieldProps<input<T>, T>>((props) => {
    const $props = props as AnyType;
    const field = formField($props.name, $props.match);
    const rest = props.$omit(['name', 'match', 'label', 'labelClass', 'errorClass', 'children']);
    const fieldId = $props.name.replace(/\./g, '-');
    const errorId = `${fieldId}-error`;

    return render(() => {
      if (typeof $props.children === 'function') {
        return $props.children(field);
      }

      return (
        <div {...rest}>
          {$props.label && (
            <label htmlFor={fieldId} className={$props.labelClass}>
              {$props.label}
            </label>
          )}
          {$props.children}
          {field.error && (
            <span id={errorId} className={$props.errorClass} role="alert">
              {field.error.join(', ')}
            </span>
          )}
        </div>
      );
    }, 'FieldView');
  }, 'Field');

  const FieldList = setup<{ name: string; children: (items: AnyType[]) => ReactNode }>((props) => {
    const $props = props as AnyType;
    const field = formField<AnyType[]>($props.name);
    if (!Array.isArray(field.value)) field.value = [];

    return render(() => $props.children(field.value), 'FieldListView');
  }, 'FieldList');

  return Object.assign(Form, {
    Field,
    FieldList,
    get: () => getForm(),
    field: (path: string) => formField(path),
  }) as TypedForm<T>;
}
