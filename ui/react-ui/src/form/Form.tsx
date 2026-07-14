import {
  type AnyType,
  type DeepPaths,
  type FormField as FormFieldType,
  formField,
  type FormState,
  formState,
  getForm,
  type PathValue,
} from '@airlib/form';
import { decorationClass, type Sizing, type Variant } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { derived, render, setup, snippet } from '@anchorlib/react';
import type {
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  SubmitEvent,
} from 'react';
import { BUTTON_CONFIGS } from 'src/components/button/config.ts';
import { type input, z, type ZodObject, type ZodRawShape } from 'zod';
import { FieldSupportingText } from '../components/index.js';
import { FIELD_CONFIG, FORM_CONFIG, RESET_CONFIG, SUBMIT_CONFIG } from './config.js';

interface TypedFormProps<S extends ZodObject<ZodRawShape>, T>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  value?: T;
  schema?: S;
  onSubmit?: (data: T, changes: Partial<T>, e: SubmitEvent<HTMLFormElement>) => Promise<void> | void;
}

interface TypedFieldProps<T, S extends ZodObject<ZodRawShape>>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: DeepPaths<T>;
  size?: 'sm' | 'md' | 'lg';
  match?: DeepPaths<T> | ((form: FormState<S>) => boolean);
  label?: string;
  block?: 'before' | 'after' | boolean;
  inline?: 'before' | 'after';
  children?: ReactNode | ((field: FormFieldType<unknown>) => ReactNode);
  mismatchLabel?: string;
  supportText?: string;
}

interface TypedFormSubmitProps<S extends ZodObject<ZodRawShape>>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  size?: Sizing;
  variant?: Variant;
  children?: ReactNode | ((form: FormState<S>) => ReactNode);
  pendingClass?: string;
}

interface TypedFormResetProps<S extends ZodObject<ZodRawShape>>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  size?: Sizing;
  clear?: boolean;
  variant?: Variant;
  children?: ReactNode | ((form: FormState<S>) => ReactNode);
  dirtyClass?: string;
}

export type TypedForm<T extends ZodObject<ZodRawShape>> = ReturnType<typeof setup<TypedFormProps<T, input<T>>>> & {
  Field: ReturnType<typeof setup<TypedFieldProps<input<T>, T>>>;
  FieldList: <K extends DeepPaths<input<T>>>(props: {
    name: K;
    children: (items: NonNullable<PathValue<input<T>, K>> extends (infer U)[] ? U[] : never) => ReactNode;
    errorClass?: string;
  }) => ReactNode;
  Submit: ReturnType<typeof setup<TypedFormSubmitProps<T>>>;
  Reset: ReturnType<typeof setup<TypedFormResetProps<T>>>;
  get(): FormState<T> | undefined;
  field<K extends DeepPaths<input<T>>>(path: K | (() => K)): FormFieldType<PathValue<input<T>, K>>;
};

export function createForm<T extends ZodObject<ZodRawShape>>(schema: T): TypedForm<T> {
  const Form = setup<TypedFormProps<T, input<T>>>((props) => {
    const $props = props as AnyType;
    const rest = $props.$omit(['value', 'schema', 'className', 'onSubmit']);
    const form = formState($props.schema || schema, $props);

    const FormError = snippet(() => {
      if (!form.error) return null;
      return (
        <div className={FORM_CONFIG.errorClass} role="alert">
          {form.error instanceof Error ? form.error.message : String(form.error)}
        </div>
      );
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if ($props.onSubmit) {
        form.submit((data: AnyType, changes: AnyType) => $props.onSubmit(data, changes, e));
      }
    };

    return render(
      () => (
        <form {...rest} className={classx([FORM_CONFIG.class, $props.className])} onSubmit={handleSubmit}>
          <FormError />
          {$props.children}
        </form>
      ),
      'FormView'
    );
  }, 'Form');

  const FormField = setup<TypedFieldProps<input<T>, T>>((props) => {
    const $props = props as AnyType;
    const rest = $props.$omit([
      'size',
      'name',
      'match',
      'label',
      'block',
      'inline',
      'children',
      'className',
      'mismatchLabel',
      'supportText',
    ]);
    const field = formField(() => $props.name, $props.match);

    const className = derived(() =>
      classx([
        FIELD_CONFIG.class,
        $props.block && FIELD_CONFIG.blockClass,
        FIELD_CONFIG.size[$props.size as never],
        field.touched && (field.error || !field.matched) ? FIELD_CONFIG.errorClass : undefined,
        $props.className,
      ])
    );

    const supports = () => {
      const hasError = !!(field.touched && field.error);
      return (
        <>
          {hasError &&
            field.error?.map((error: string, i: number) => (
              <FieldSupportingText key={i} role="alert" className={FIELD_CONFIG.errorClass}>
                {error}
              </FieldSupportingText>
            ))}
          {field.valid && !field.matched && $props.mismatchLabel && (
            <FieldSupportingText role="alert" className={FIELD_CONFIG.errorClass}>
              {$props.mismatchLabel}
            </FieldSupportingText>
          )}
          {!hasError && $props.supportText && (
            <FieldSupportingText className={FIELD_CONFIG.supportingTextClass}>{$props.supportText}</FieldSupportingText>
          )}
        </>
      );
    };

    return render(() => {
      if (!field.name) {
        return <span className={FIELD_CONFIG.errorClass}>[FieldError]: Name property is required!</span>;
      }

      if (typeof $props.children === 'function') {
        return $props.children(field);
      }

      if ($props.inline) {
        return (
          <label {...rest} className={className.value} size={$props.size}>
            {$props.inline === 'after' && $props.children}
            <div className={FIELD_CONFIG.inlineClass}>
              {$props.label && (
                <span className={FIELD_CONFIG.labelClass}>
                  {$props.label}
                  {field.required && <span className={FIELD_CONFIG.requiredClass}>{FIELD_CONFIG.requiredLabel}</span>}
                </span>
              )}
              {supports()}
            </div>
            {$props.inline === 'before' && $props.children}
          </label>
        );
      }

      if ($props.block) {
        return (
          <div {...rest} className={className.value} size={$props.size}>
            {$props.block === 'before' && $props.children}
            {$props.label && (
              <span className={FIELD_CONFIG.labelClass}>
                {$props.label}
                {field.required && <span className={FIELD_CONFIG.requiredClass}>{FIELD_CONFIG.requiredLabel}</span>}
              </span>
            )}
            {$props.block !== 'before' && $props.children}
            {supports()}
          </div>
        );
      }

      return (
        <label {...rest} className={className.value} size={$props.size}>
          {$props.label && (
            <span className={FIELD_CONFIG.labelClass}>
              {$props.label}
              {field.required && <span className={FIELD_CONFIG.requiredClass}>{FIELD_CONFIG.requiredLabel}</span>}
            </span>
          )}
          {$props.children}
          {supports()}
        </label>
      );
    }, 'FormFieldView');
  }, 'FormField');

  const FormFieldList = setup<{ name: string; children: (items: AnyType[]) => ReactNode }>((props) => {
    const $props = props as AnyType;
    const field = formField<AnyType[]>(() => $props.name);
    if (field.name && !Array.isArray(field.value)) field.value = [];

    return render(() => {
      if (!field.name) {
        return <span className={FIELD_CONFIG.errorClass}>[FieldListError]: Name property is required!</span>;
      }
      return $props.children(field.value);
    }, 'FormFieldListView');
  }, 'FormFieldList');

  const FormSubmit = setup<TypedFormSubmitProps<T>>((props) => {
    const $props = props as AnyType;

    const form = getForm() as FormState<T>;
    const rest = $props.$omit(['children', 'className', 'pendingClass']);

    const decoration = decorationClass($props, BUTTON_CONFIGS);
    const className = derived(() => {
      return classx([
        decoration.value,
        $props.className,
        form?.pending ? ($props.pendingClass ?? SUBMIT_CONFIG.pendingClass) : undefined,
      ]);
    });

    return render(
      () => (
        <button {...rest} type="submit" className={className.value} disabled={!form?.canSubmit}>
          {typeof $props.children === 'function' ? $props.children(form) : $props.children}
        </button>
      ),
      'FormSubmit'
    );
  }, 'FormSubmit');

  const FormReset = setup<TypedFormResetProps<T>>((props) => {
    const $props = props as AnyType;

    const form = getForm() as FormState<T>;
    const rest = $props.$omit(['children', 'className', 'dirtyClass', 'clear', 'onClick']);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if ($props.clear) {
        form?.clear();
      } else {
        form?.reset();
      }
      $props.onClick?.(e);
    };

    const decoration = decorationClass($props, BUTTON_CONFIGS);
    const className = derived(() => {
      return classx([
        decoration.value,
        $props.className,
        form?.changed ? ($props.dirtyClass ?? RESET_CONFIG.dirtyClass) : undefined,
      ]);
    });

    return render(
      () => (
        <button
          {...rest}
          type={props.type ?? 'button'}
          disabled={!form?.changed}
          className={className.value}
          onClick={handleClick}
        >
          {typeof $props.children === 'function' ? $props.children(form) : $props.children}
        </button>
      ),
      'FormReset'
    );
  }, 'FormReset');

  return Object.assign(Form, {
    Field: FormField,
    FieldList: FormFieldList,
    Submit: FormSubmit,
    Reset: FormReset,
    get: () => getForm(),
    field: (path: string) => formField(path),
  }) as TypedForm<T>;
}

export const Form = createForm<ZodObject<ZodRawShape>>(z.object({}) as AnyType);
export const FormField = Form.Field;
export const FormFieldList = Form.FieldList;
export const FormSubmit = Form.Submit;
export const FormReset = Form.Reset;
