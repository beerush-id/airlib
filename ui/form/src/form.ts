import { anchor, type LinkableSchema, mutable, onCleanup, subscribe } from '@anchorlib/core';
import type { input, ZodType } from 'zod';
import { FORM_STATUS, FORM_SYMBOL } from './contant.js';
import { context } from './context.js';
import { formField } from './field.js';
import { flattenData, flattenError, unflattenData } from './flatten.js';
import { getSchemaByPath } from './schema.js';
import type { AnyType, FormState, FormStateOptions } from './types.js';
import { writePath } from './utils.js';
import type { FormStatus } from './types.ts';

/**
 * Creates a reactive form state based on a Zod schema.
 *
 * @param schema - The Zod schema to validate the form against.
 * @param props - An object containing the initial `value` for the form.
 * @param options - Configuration options for the form state.
 */
export function formState<T extends LinkableSchema>(
  schema: T,
  props: { value?: input<T> },
  options?: FormStateOptions
): FormState<T> {
  const { strict = true, validateOnInit = true, settleOnSubmit = true, onChange } = options || ({} as FormStateOptions);
  const inputStore = new Map<string, AnyType>();
  const flatSchema = new Map<string, ZodType>();
  const state = mutable<{
    status: FormStatus;
    error?: Error;
  }>({
    status: FORM_STATUS.IDLE,
  });

  const dataStore = mutable(new Map<string, AnyType>());
  const errorStore = mutable(new Map<string, string[]>());
  const changeStore = mutable(new Map<string, AnyType>());

  const cleanup = () => {
    inputStore.clear();
    flatSchema.clear();

    dataStore.clear();
    errorStore.clear();
    changeStore.clear();
  };

  const initialize = (data: AnyType) => {
    const validation = schema.safeParse(data || {});
    const inputData = validation.success ? validation.data : data || {};

    flattenData(dataStore, inputData);
    for (const [path, value] of dataStore.entries()) {
      inputStore.set(path, value);
    }

    if (!validation.success && validateOnInit) {
      flattenError(errorStore, validation.error);
    }
  };

  const cleanOrphans = (path: string, value: unknown) => {
    if (value === null || typeof value !== 'object') return;

    const startPath = `${path}.`;

    for (const key of dataStore.keys()) {
      if (key.startsWith(startPath)) dataStore.delete(key);
    }
    for (const key of errorStore.keys()) {
      if (key.startsWith(startPath)) errorStore.delete(key);
    }
    for (const key of changeStore.keys()) {
      if (key.startsWith(startPath)) changeStore.delete(key);
    }
  };

  const write = (prop: string, value: AnyType) => {
    cleanOrphans(prop, value);
    dataStore.set(prop, value);

    if (value === inputStore.get(prop)) {
      changeStore.delete(prop);
    } else {
      changeStore.set(prop, value);
    }

    if (props.value) {
      self.locked = true;
      writePath(props.value, prop, value);
      self.locked = false;
    }
    onChange?.(dataStore, errorStore);
  };

  const setter = (prop: string, value: AnyType) => {
    const schemaPath = prop.replace(/\.\d+/g, '.$');
    if (!flatSchema.has(schemaPath)) {
      const flatLeaf = getSchemaByPath(schema, schemaPath);
      if (flatLeaf) flatSchema.set(schemaPath, flatLeaf);
    }

    const leafSchema = flatSchema.get(schemaPath);
    if (!leafSchema) {
      if (!strict) {
        write(prop, value);
      }

      return true;
    }

    const validation = leafSchema.safeParse(value);

    if (validation.success) {
      value = validation.data;
      write(prop, value);
      errorStore.delete(prop);
    } else {
      errorStore.set(
        prop,
        validation.error.issues.map((i) => i.message)
      );
    }

    return true;
  };

  const dataProxy = new Proxy(
    {},
    {
      get(_, prop: string) {
        return dataStore.get(prop);
      },
      set(_, prop: string, value: AnyType) {
        if (self.locked) return true;
        return setter(prop, value);
      },
    }
  );

  const errorProxy = new Proxy(
    {},
    {
      get(_, prop: string) {
        return errorStore.get(prop);
      },
      set() {
        console.warn('[AIR Form] Violation: form.errors is read-only.');
        return true;
      },
    }
  );

  const self = {
    locked: false,

    get fields() {
      return dataProxy as input<T>;
    },
    get errors() {
      return errorProxy;
    },
    get changed() {
      return changeStore.size > 0;
    },
    get valid() {
      return errorStore.size === 0;
    },
    get output() {
      return unflattenData(dataStore);
    },
    get changes() {
      return unflattenData(changeStore);
    },
    get error() {
      return state.error;
    },
    get status() {
      return state.status;
    },
    get pending() {
      return state.status === FORM_STATUS.PENDING;
    },
    get canSubmit() {
      return self.valid && self.changed && !self.pending;
    },
    field(fieldPath: string) {
      return formField(fieldPath);
    },
    reset() {
      if (self.locked) return self;
      self.locked = true;

      delete state.error;
      state.status = FORM_STATUS.IDLE;

      dataStore.clear();
      flatSchema.clear();
      errorStore.clear();
      changeStore.clear();

      for (const [path, value] of inputStore.entries()) {
        dataStore.set(path, value);
        if (props.value) writePath(props.value, path, value);
      }

      onChange?.(dataStore, errorStore);

      self.locked = false;
      return self;
    },
    async submit(handler, settle = settleOnSubmit) {
      if (self.locked) return;
      self.locked = true;

      delete state.error;
      state.status = FORM_STATUS.PENDING;

      try {
        await handler(unflattenData(anchor.get(dataStore)));
        state.status = FORM_STATUS.SUCCESS;

        if (settle) {
          inputStore.clear();
          for (const [path, value] of dataStore.entries()) {
            inputStore.set(path, value);
          }
          changeStore.clear();
        }
      } catch (error) {
        state.error = error as Error;
        state.status = FORM_STATUS.ERROR;
      } finally {
        self.locked = false;
      }
    },
  } as FormState<T>;

  if (anchor.has(props)) {
    const unsubscribe = subscribe(
      props,
      (_, event) => {
        if (event.type === 'init') {
          initialize(props.value);
          return;
        }
        if (self.locked || event.keys[0] !== 'value') return;

        cleanup();
        initialize(props.value);
        onChange?.(dataStore, errorStore);
      },
      false
    );

    onCleanup(unsubscribe);
  } else {
    initialize(props.value);
  }

  onCleanup(cleanup);

  context.write(FORM_SYMBOL, self);

  return self;
}
