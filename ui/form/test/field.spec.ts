import { anchor, clearContextStore, createLifecycle } from '@anchorlib/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { formField } from '../src/field.js';
import { formState } from '../src/form.js';

const schema = z.object({
  name: z.string().min(3),
  age: z.number(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

let scope: ReturnType<typeof createLifecycle>;

beforeEach(() => {
  clearContextStore();
  anchor.configure({ globalScopeWarning: false });
  scope = createLifecycle();
});

afterEach(() => {
  scope.destroy();
});

describe('FormField', () => {
  it('reads and writes through the parent form', () => {
    scope.run(() => {
      const form = formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      const field = formField('name');

      expect(field.name).toBe('name');
      expect(field.value).toBe('Alice');

      field.value = 'Bob';
      expect(field.value).toBe('Bob');
      expect(form.fields['name']).toBe('Bob');
    });
  });

  it('reflects form errors', () => {
    scope.run(() => {
      formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      const field = formField('name');

      expect(field.valid).toBe(true);
      expect(field.error).toBeUndefined();

      field.value = 'Al';
      expect(field.valid).toBe(false);
      expect(field.error).toBeDefined();
    });
  });

  it('reflects changed and touched state', () => {
    scope.run(() => {
      formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      const field = formField('name');

      expect(field.changed).toBe(false);
      expect(field.touched).toBe(false);

      field.value = 'Bob';
      expect(field.changed).toBe(true);
      expect(field.touched).toBe(true);
    });
  });

  it('reflects disabled from form pending state', async () => {
    await scope.run(async () => {
      const form = formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      const field = formField('name');
      expect(field.disabled).toBe(false);

      form.fields['name'] = 'Bob';

      let resolve: () => void;
      const promise = new Promise<void>((r) => {
        resolve = r;
      });

      const submitPromise = form.submit(() => promise);

      expect(field.disabled).toBe(true);

      resolve!();
      await submitPromise;

      expect(field.disabled).toBe(false);
    });
  });

  it('derives required from schema by default', () => {
    scope.run(() => {
      formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      const field = formField('name');
      expect(field.required).toBe(true);
    });
  });

  it('overrides required with boolean', () => {
    scope.run(() => {
      formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      const field = formField('name', undefined, false);
      expect(field.required).toBe(false);
    });
  });

  it('overrides required with function', () => {
    scope.run(() => {
      formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      let toggle = true;
      const field = formField('name', undefined, () => toggle);

      expect(field.required).toBe(true);
      toggle = false;
      expect(field.required).toBe(false);
    });
  });

  describe('Match', () => {
    it('matches by field path (string)', () => {
      scope.run(() => {
        const form = formState(schema, {
          value: { name: 'x', age: 25, password: 'secret', confirmPassword: 'secret' },
        });

        const field = formField('confirmPassword', 'password');

        expect(field.matched).toBe(true);

        form.fields['confirmPassword'] = 'differ';
        expect(field.matched).toBe(false);
      });
    });

    it('matches by custom function', () => {
      scope.run(() => {
        const rangeSchema = z.object({ min: z.number(), max: z.number() });
        const form = formState(rangeSchema, { value: { min: 0, max: 10 } });

        const field = formField('max', (f: any) => f.fields['max'] > f.fields['min']);

        expect(field.matched).toBe(true);

        form.fields['min'] = 20;
        expect(field.matched).toBe(false);

        form.fields['max'] = 30;
        expect(field.matched).toBe(true);
      });
    });

    it('defaults to matched=true when no match is specified', () => {
      scope.run(() => {
        formState(schema, {
          value: { name: 'x', age: 25, password: 'secret', confirmPassword: 'different' },
        });

        const field = formField('confirmPassword');
        expect(field.matched).toBe(true);
      });
    });
  });

  it('creates FormInput via input() method', () => {
    scope.run(() => {
      formState(schema, {
        value: { name: 'Alice', age: 25, password: 'secret', confirmPassword: 'secret' },
      });

      const field = formField('name');
      const input = field.input({ type: 'text' });

      expect(input).toBeDefined();
      expect(input.name).toBe('name');
    });
  });

  it('handles writes to unknown fields gracefully', () => {
    scope.run(() => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      formState(schema, {});

      const field = formField('unknown_field');
      field.value = 'test';

      expect(field.value).toBeUndefined();
      errSpy.mockRestore();
    });
  });

  describe('standalone (no form)', () => {
    it('value setter is a no-op without form', () => {
      scope.run(() => {
        const field = formField('name');
        field.value = 'test';
        expect(field.value).toBeUndefined();
      });
    });

    it('disabled returns false without form', () => {
      scope.run(() => {
        const field = formField('name');
        expect(field.disabled).toBe(false);
      });
    });

    it('required falls back to false without form', () => {
      scope.run(() => {
        const field = formField('name');
        expect(field.required).toBe(false);
      });
    });

    it('changed returns false without form', () => {
      scope.run(() => {
        const field = formField('name');
        expect(field.changed).toBe(false);
      });
    });

    it('touched returns false without form', () => {
      scope.run(() => {
        const field = formField('name');
        expect(field.touched).toBe(false);
      });
    });
  });
});
