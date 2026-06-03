import {
  anchor,
  ARRAY_MUTATIONS,
  effect,
  type LinkableSchema,
  mutable,
  onCleanup,
  type StateChange,
  subscribe,
  untrack,
} from '@anchorlib/core';
import { type input, type ZodType } from 'zod';
import { FORM_STATUS, FORM_SYMBOL } from './contant.js';
import { context } from './context.js';
import { formField } from './field.js';
import { flattenData, flattenError, unflattenData } from './flatten.js';
import { getSchemaByPath } from './schema.js';
import type { AnyType, FormState, FormStateOptions } from './types.js';
import { writePath } from './utils.js';
import type { FormStatus } from './types.ts';

const ArrayMutations = new Set(ARRAY_MUTATIONS);

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
  const inputStore: Record<string, AnyType> = {};
  const flatSchema = new Map<string, ZodType>();
  const state = mutable<{
    status: FormStatus;
    error?: Error;
  }>({
    status: FORM_STATUS.IDLE,
  });

  const store = mutable({
    fields: {} as Record<string, AnyType>,
    errors: {} as Record<string, string[]>,
    changes: {} as Record<string, AnyType>,
    touched: {} as Record<string, boolean>,
    changeSize: 0,
  });

  const cleanup = () => {
    for (const key of Object.keys(inputStore)) delete inputStore[key];
    flatSchema.clear();

    store.fields = {};
    store.errors = {};
    store.changes = {};
    store.touched = {};
    store.changeSize = 0;
  };

  const initialize = (data: AnyType) => {
    const validation = schema.safeParse(data);
    const inputData = validation.success ? validation.data : data;

    flattenData(store.fields, inputData);
    for (const key of Object.keys(store.fields)) {
      inputStore[key] = store.fields[key];
    }

    if (!validation.success && validateOnInit) {
      flattenError(store.errors, validation.error);
    }
  };

  const cleanOrphans = (path: string, value: unknown) => {
    if (value === null || typeof value !== 'object') return;

    const startPath = `${path}.`;

    for (const key of Object.keys(store.fields)) {
      if (key.startsWith(startPath)) delete store.fields[key];
    }
    for (const key of Object.keys(store.errors)) {
      if (key.startsWith(startPath)) delete store.errors[key];
    }
    for (const key of Object.keys(store.changes)) {
      if (key.startsWith(startPath)) {
        delete store.changes[key];
        store.changeSize--;
      }
    }
  };

  const moveEntry = (from: string, to: string) => {
    store.fields[to] = store.fields[from];
    if (Object.hasOwn(store.errors, from)) {
      store.errors[to] = store.errors[from];
    } else {
      delete store.errors[to];
    }
    if (Object.hasOwn(store.changes, from)) {
      store.changes[to] = store.changes[from];
    } else if (Object.hasOwn(store.changes, to)) {
      delete store.changes[to];
      store.changeSize--;
    }
  };

  const deleteEntry = (path: string) => {
    delete store.fields[path];
    delete store.errors[path];
    if (Object.hasOwn(store.changes, path)) {
      delete store.changes[path];
      store.changeSize--;
    }
  };

  const write = (prop: string, value: AnyType) => {
    cleanOrphans(prop, value);
    store.fields[prop] = value;

    if (value === inputStore[prop]) {
      if (Object.hasOwn(store.changes, prop)) {
        delete store.changes[prop];
        store.changeSize--;
      }
    } else {
      if (!Object.hasOwn(store.changes, prop)) {
        store.changeSize++;
      }
      store.changes[prop] = value;
    }

    if (props.value) {
      self.locked = true;
      writePath(props.value, prop, value);
      self.locked = false;
    }

    onChange?.(store.fields, store.errors);
  };

  const setter = (prop: string, value: AnyType) => {
    store.touched[prop] = true;
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
      delete store.errors[prop];
    } else {
      store.errors[prop] = validation.error.issues.map((i) => i.message);
    }

    return true;
  };

  const dataProxy = new Proxy(
    {},
    {
      get(_, prop: string) {
        const value = store.fields[prop];
        if (typeof value === 'object' && value !== null) {
          return prop.split('.').reduce((acc, key) => (acc as AnyType)[key], props.value);
        }
        return value;
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
        return store.errors[prop];
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
      return store.changeSize > 0;
    },
    get changeList() {
      return store.changes;
    },
    get valid() {
      return Object.keys(store.errors).length === 0;
    },
    get output() {
      return unflattenData(anchor.get(store.fields));
    },
    get changes() {
      return unflattenData(anchor.get(store.changes));
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
    get touched() {
      return store.touched;
    },
    field(fieldPath: string) {
      return formField(fieldPath);
    },
    reset() {
      if (self.locked) return self;
      self.locked = true;

      delete state.error;
      state.status = FORM_STATUS.IDLE;

      store.fields = {};
      flatSchema.clear();
      store.errors = {};
      store.changes = {};
      store.touched = {};
      store.changeSize = 0;

      for (const path of Object.keys(inputStore)) {
        store.fields[path] = inputStore[path];
        if (props.value) writePath(props.value, path, inputStore[path]);
      }

      onChange?.(store.fields, store.errors);

      self.locked = false;
      return self;
    },
    async submit(handler, settle = settleOnSubmit) {
      if (self.locked) return;
      self.locked = true;

      delete state.error;
      state.status = FORM_STATUS.PENDING;

      try {
        await handler(unflattenData(anchor.get(store.fields)), unflattenData(anchor.get(store.changes)));
        state.status = FORM_STATUS.SUCCESS;

        if (settle) {
          for (const key of Object.keys(inputStore)) delete inputStore[key];
          for (const path of Object.keys(store.fields)) {
            inputStore[path] = store.fields[path];
          }
          store.changes = {};
          store.changeSize = 0;
        }
      } catch (error) {
        state.error = error as Error;
        state.status = FORM_STATUS.ERROR;
      } finally {
        self.locked = false;
      }
    },
  } as FormState<T>;

  if (!anchor.has(props)) {
    props = mutable(props);
  }

  if (!anchor.has(props.value as AnyType)) {
    props.value = mutable((props.value as AnyType) ?? {});
  }

  // Sync external leaf changes.
  const synchronize = (_: input<T>, event: StateChange) => {
    if (event.type === 'init' || self.locked) return;

    const prop = event.keys.join('.');

    if (ArrayMutations.has(event.type as AnyType)) {
      const type = event.type as AnyType;
      const current = store.fields[prop] as unknown[];
      const args = event.value as unknown[];

      if (type === 'push') {
        const start = current.length;
        args.forEach((arg, i) => {
          setter(`${prop}.${start + i}`, arg);
        });
      } else if (type === 'pop') {
        deleteEntry(`${prop}.${current.length - 1}`);
      } else if (type === 'shift') {
        for (let i = 0; i < current.length - 1; i++) {
          moveEntry(`${prop}.${i + 1}`, `${prop}.${i}`);
        }
        deleteEntry(`${prop}.${current.length - 1}`);
      } else if (type === 'unshift') {
        for (let i = current.length - 1; i >= 0; i--) {
          moveEntry(`${prop}.${i}`, `${prop}.${i + args.length}`);
        }
        args.forEach((arg, i) => {
          setter(`${prop}.${i}`, arg);
        });
      } else if (type === 'splice') {
        const [start, deleteCount = 0, ...items] = args as [number, number, ...unknown[]];

        const remaining = current.slice(start + deleteCount);
        remaining.forEach((_, i) => {
          moveEntry(`${prop}.${start + deleteCount + i}`, `${prop}.${start + items.length + i}`);
        });

        items.forEach((item, i) => {
          setter(`${prop}.${start + i}`, item);
        });

        const newLength = current.length - deleteCount + items.length;
        for (let i = newLength; i < current.length; i++) {
          deleteEntry(`${prop}.${i}`);
        }
      } else {
        // sort, reverse, fill, copyWithin — re-sync from actual array
        for (const key of Object.keys(store.fields)) {
          if (key.startsWith(`${prop}.`)) deleteEntry(key);
        }

        let actual: unknown = props.value;
        for (const segment of prop.split('.')) {
          actual = (actual as AnyType)[segment];
        }

        (actual as unknown[]).forEach((item, i) => {
          setter(`${prop}.${i}`, item);
        });
      }
    } else {
      setter(prop, event.value);
    }
  };

  // Sync value changes.
  effect(() => {
    const value = props.value!;
    untrack(() => initialize(value));
    return untrack(() => subscribe(value, synchronize));
  });

  onCleanup(cleanup);

  context.write(FORM_SYMBOL, self);

  return self;
}
