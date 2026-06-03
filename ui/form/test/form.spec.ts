import { createLifecycle, effect, mutable } from '@anchorlib/core';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { AnyType, FormDataMap, FormErrorMap, FormState } from '../src/index.js';
import { formField, formState } from '../src/index.js';

describe('FormState API', () => {
  const userSchema = z.object({
    name: z.string().min(3, 'Name too short'),
    age: z.number().min(18, 'Too young'),
    address: z.object({
      city: z.string(),
      zip: z.string().min(5),
    }),
    tags: z.array(z.string()).default(['new_user']),
  });

  describe('Initialization', () => {
    it('should populate with initial data and schemas default values', () => {
      const props = {
        value: {
          name: 'John',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };
      const form = formState(userSchema, props);

      // tags gets the Zod default
      expect(form.fields['tags.0']).toBe('new_user');
      expect(form.output.tags).toEqual(['new_user']);
      expect(form.changed).toBe(false);
    });

    it('should initialize empty objects and arrays cleanly', () => {
      const props: AnyType = {
        value: { meta: {}, logs: [] },
      };
      const form = formState(z.any() as AnyType, props);

      expect(form.output.meta).toEqual({});
      expect(form.output.logs).toEqual([]);
    });
  });

  describe('Change Tracking (Reactivity)', () => {
    it('should track granular proxy updates and maintain the changes delta', () => {
      const props = {
        value: {
          name: 'John',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };
      const form = formState(userSchema, props);

      expect(form.changed).toBe(false);

      // Mutate a nested field via proxy
      form.fields['address.city'] = 'LA';
      expect(form.changed).toBe(true);
      expect(form.changes).toEqual({ address: { city: 'LA' } });

      // changeList should track the raw changed paths
      expect(form.changeList).toBeTypeOf('object');
      expect(Object.hasOwn(form.changeList, 'address.city')).toBe(true);
      expect(Object.keys(form.changeList).length).toBe(1);

      // Mutate another field
      form.fields['name'] = 'Jane';
      expect(form.changes).toEqual({ name: 'Jane', address: { city: 'LA' } });
      expect(Object.hasOwn(form.changeList, 'name')).toBe(true);
      expect(Object.keys(form.changeList).length).toBe(2);

      // Reverting to original data resets the change flag for that field
      form.fields['name'] = 'John';
      form.fields['address.city'] = 'NY';
      expect(form.changed).toBe(false);
      expect(form.changes).toEqual({});
      expect(Object.keys(form.changeList).length).toBe(0);
    });

    it('should correctly rebuild the complete output hierarchy', () => {
      const props = {
        value: {
          name: 'John',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };
      const form = formState(userSchema, props);

      form.fields['tags.1'] = 'admin';

      expect(form.output).toEqual({
        name: 'John',
        age: 20,
        address: { city: 'NY', zip: '10001' },
        tags: ['new_user', 'admin'],
      });
    });

    it('should handle full data replacement via upstream props sync', () => {
      // Testing reactivity with anchor lib's mutable
      const props = mutable({ value: undefined as AnyType });
      const form = formState(userSchema, props);

      props.value = {
        name: 'Alice',
        age: 25,
        address: { city: 'SF', zip: '94105' },
      };

      expect(form.output.name).toBe('Alice');
      expect(form.output.address.city).toBe('SF');
    });

    it('should clean orphaned child properties when a parent object is replaced', () => {
      const props = {
        value: {
          name: 'John',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };
      const form = formState(userSchema, props);

      // Force an error on a child property to verify errorStore cleanup
      form.fields['address.zip'] = '123'; // zip requires min(5)
      expect(form.errors['address.zip']).toBeDefined();

      // Make a valid child property change to verify changeStore cleanup
      form.fields['address.city'] = 'Boston';
      expect(form.changes).toHaveProperty('address.city');

      // Replace the parent object
      form.fields['address'] = { city: 'SF', zip: '94105' };

      // Verify the child error was cleaned up
      expect(form.errors['address.zip']).toBeUndefined();

      // Verify the child change was cleaned up and replaced by parent change
      expect(form.changes).toEqual({ address: { city: 'SF', zip: '94105' } });

      // The parent object should now be stored correctly
      expect(form.fields['address']).toEqual({ city: 'SF', zip: '94105' });
    });

    it('should clean orphaned child properties when an array is replaced', () => {
      const props = {
        value: {
          name: 'John',
          age: 20,
          address: { city: 'NY', zip: '10001' },
          tags: ['admin', 'user'],
        },
      };
      const form = formState(userSchema, props);

      // Verify the initial array elements are present
      expect(form.fields['tags.0']).toBe('admin');
      expect(form.fields['tags.1']).toBe('user');

      // Replace the array with an empty array
      form.fields['tags'] = [];

      // Verify the old array indices are cleaned up
      expect(form.fields['tags.0']).toBeUndefined();
      expect(form.fields['tags.1']).toBeUndefined();

      // Verify the new array is stored correctly
      expect(form.fields['tags']).toEqual([]);
      expect(form.output.tags).toEqual([]);
    });

    it('should ignore non-value property updates on upstream props', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '123' } },
        otherProp: false,
      } as AnyType);
      const form = formState(userSchema, props);

      form.fields['name'] = 'Bob'; // Mark as changed
      expect(form.changed).toBe(true);

      // Mutate a non-value prop. This triggers subscribe but MUST hit the guard.
      props.otherProp = true;

      // If the guard failed, sync() would run and wipe mutatedKeys, setting changed to false.
      expect(form.changed).toBe(true);
    });

    it('should route external deep mutations through setter', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' } },
      } as AnyType);
      const form = formState(userSchema, props);

      expect(form.fields['name']).toBe('Alice');
      expect(form.changed).toBe(false);

      // External deep mutation — triggers subscription's else branch
      props.value.name = 'Bob';

      expect(form.fields['name']).toBe('Bob');
      expect(form.changed).toBe(true);
      expect(form.changes).toEqual({ name: 'Bob' });
    });

    it('should handle external array push mutation', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' }, tags: ['admin'] },
      } as AnyType);
      const form = formState(userSchema, props);

      props.value.tags.push('user');

      expect(form.fields['tags.0']).toBe('admin');
      expect(form.fields['tags.1']).toBe('user');
      expect(form.changed).toBe(true);
    });

    it('should clean orphaned entries when array shrinks via external mutation', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' }, tags: ['admin', 'user', 'editor'] },
      } as AnyType);
      const form = formState(userSchema, props);

      expect(form.fields['tags.2']).toBe('editor');

      // Splice removes 'user' and 'editor', shifts nothing
      props.value.tags.splice(1, 2);

      expect(form.fields['tags.0']).toBe('admin');
      expect(form.fields['tags.1']).toBeUndefined();
      expect(form.fields['tags.2']).toBeUndefined();
      expect(form.errors['tags.1']).toBeUndefined();
      expect(form.errors['tags.2']).toBeUndefined();
    });

    it('should handle external array pop mutation', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' }, tags: ['admin', 'user'] },
      } as AnyType);
      const form = formState(userSchema, props);

      expect(form.fields['tags.1']).toBe('user');

      props.value.tags.pop();

      expect(form.fields['tags.0']).toBe('admin');
      expect(form.fields['tags.1']).toBeUndefined();
    });

    it('should handle external array shift mutation', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' }, tags: ['admin', 'user', 'editor'] },
      } as AnyType);
      const form = formState(userSchema, props);

      // Write valid value to create a change entry, then invalid to create an error
      form.fields['tags.1'] = 'modified';
      form.fields['tags.1'] = 0 as never;

      expect(form.errors['tags.1']).toBeDefined();

      props.value.tags.shift();

      // Error from tags.1 should move to tags.0
      expect(form.fields['tags.0']).toBe('modified');
      expect(form.errors['tags.0']).toBeDefined();
      expect(form.fields['tags.1']).toBe('editor');
      expect(form.fields['tags.2']).toBeUndefined();
    });

    it('should handle external array unshift mutation', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' }, tags: ['admin'] },
      } as AnyType);
      const form = formState(userSchema, props);

      props.value.tags.unshift('root', 'super');

      expect(form.fields['tags.0']).toBe('root');
      expect(form.fields['tags.1']).toBe('super');
      expect(form.fields['tags.2']).toBe('admin');
    });

    it('should handle external array splice with insertion', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' }, tags: ['admin', 'user', 'editor'] },
      } as AnyType);
      const form = formState(userSchema, props);

      // Remove 'user', insert 'mod' and 'super'
      props.value.tags.splice(1, 1, 'mod', 'super');

      expect(form.fields['tags.0']).toBe('admin');
      expect(form.fields['tags.1']).toBe('mod');
      expect(form.fields['tags.2']).toBe('super');
      expect(form.fields['tags.3']).toBe('editor');
    });

    it('should handle external array sort and reverse mutations', () => {
      const props = mutable({
        value: { name: 'Alice', age: 25, address: { city: 'SF', zip: '94105' }, tags: ['user', 'admin', 'editor'] },
      } as AnyType);
      const form = formState(userSchema, props);

      props.value.tags.reverse();

      expect(form.fields['tags.0']).toBe('editor');
      expect(form.fields['tags.1']).toBe('admin');
      expect(form.fields['tags.2']).toBe('user');

      props.value.tags.sort();

      expect(form.fields['tags.0']).toBe('admin');
      expect(form.fields['tags.1']).toBe('editor');
      expect(form.fields['tags.2']).toBe('user');
    });

    it('should run sync callbacks and flatten errors when replacing data with invalid payload', () => {
      const props = mutable({ value: undefined as AnyType });
      const form = formState(userSchema, props);

      // Replace with partial/invalid data to trigger sync(!init) failure path
      props.value = { name: 'Al' };

      expect(form.valid).toBe(false);
      expect(form.errors['name']).toBeDefined(); // Hits line 30-31
    });
  });

  describe('Validation', () => {
    it('should perform fine-grained validation seamlessly during proxy assignment', () => {
      const props = {
        value: {
          name: 'John',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };
      const form = formState(userSchema, props);

      expect(form.valid).toBe(true);

      // Setting invalid name isolates and runs ZodString min(3)
      form.fields['name'] = 'Al';
      expect(form.valid).toBe(false);
      expect(form.errors['name']?.[0]).toMatch(/Name too short/i);

      // Fixing it clears the specific error
      form.fields['name'] = 'Alice';
      expect(form.valid).toBe(true);
      expect(form.errors['name']).toBeUndefined();
    });

    it('should ignore writes to unknown fields when strict is true (default)', () => {
      const form = formState(userSchema, {});

      // Setting a property not defined in the schema
      (form.fields as AnyType)['unknown_field'] = 'test';

      // Should not be written to output or fields
      expect((form.fields as AnyType)['unknown_field']).toBeUndefined();
      expect((form.output as AnyType).unknown_field).toBeUndefined();
    });

    it('should allow writes to unknown fields when strict is false', () => {
      const form = formState(userSchema, {}, { strict: false });

      // Setting a property not defined in the schema
      (form.fields as AnyType)['unknown_field'] = 'test';

      // Should be written to output and fields
      expect((form.fields as AnyType)['unknown_field']).toBe('test');
      expect((form.output as AnyType).unknown_field).toBe('test');
    });

    it('should protect the errors proxy from direct mutation', () => {
      const form = formState(userSchema, {});
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      (form.errors as AnyType)['name'] = ['forced error'];

      expect(consoleWarnSpy).toHaveBeenCalledWith('[AIR Form] Violation: form.errors is read-only.');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Lifecycle Callbacks', () => {
    it('should trigger onChange and onValidate during data syncs', () => {
      let changedData: FormDataMap;
      let validatedErrors: FormErrorMap;

      const props = {
        value: { name: 'John', age: 20, address: { city: 'NY', zip: '10001' } },
      };

      const form = formState(userSchema, props, {
        onChange: (data, errors) => {
          changedData = data;
          validatedErrors = errors;
        },
      });

      form.fields['name'] = 'Alice';
      expect(changedData!['name']).toBe('Alice');
      expect(Object.keys(validatedErrors!).length).toBe(0);

      form.fields['name'] = 'Al'; // Invalid length
      expect(changedData!['name']).toBe('Alice');
      expect(validatedErrors!['name']).toBeDefined();
    });
  });

  describe('State Management', () => {
    it('should ignore mutations and reset when locked', () => {
      const props = { value: { name: 'Initial' } };
      const form = formState(z.object({ name: z.string() }), props);

      form.locked = true;

      // Mutation should be ignored
      form.fields['name'] = 'Changed';
      expect(form.fields['name']).toBe('Initial');

      // Reset should be ignored
      const result = form.reset();
      expect(result).toBe(form);

      form.locked = false;
      form.fields['name'] = 'Unlocked';
      expect(form.fields['name']).toBe('Unlocked');
    });

    it('should reset strictly to the initial state', () => {
      const props = {
        value: {
          name: 'Initial',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };
      const form = formState(userSchema, props);

      form.fields['name'] = 'Changed';
      form.fields['address.city'] = 'LA';
      expect(form.changed).toBe(true);

      form.reset();
      expect(form.changed).toBe(false);
      expect(form.changes).toEqual({});
      expect(form.output.name).toBe('Initial');
      expect(form.output.address.city).toBe('NY');
    });

    it('should trigger onChange and onValidate events when reset is called', () => {
      const onChange = vi.fn();

      const props = { value: { name: 'Initial' } };
      const form = formState(z.object({ name: z.string() }), props, { onChange });

      form.fields['name'] = 'Changed';

      onChange.mockClear();

      form.reset();

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('View Layer Bindings', () => {
    it('should mutate source object deep paths when proxy is written to', () => {
      const props = {
        value: {
          name: 'Initial',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };

      const form = formState(userSchema, props);

      form.fields['address.city'] = 'LA';
      expect(props.value.address.city).toBe('LA');
    });

    it('formField should read and write effectively', () => {
      const props = {
        value: {
          name: 'Alice',
          age: 20,
          address: { city: 'NY', zip: '10001' },
        },
      };

      formState(userSchema, props);

      const field = formField('name');

      // Should read from form
      expect(field.value).toBe('Alice');

      // Setting via field should hit form.data and fieldProps
      field.value = 'Bob';

      expect(field.value).toBe('Bob');
      expect(props.value.name).toBe('Bob');
    });

    it('formField should handle writes to unknown fields gracefully', () => {
      formState(userSchema, {});

      const field = formField('unknown_field');

      // Hits form.setter with plain = true, returning the value directly
      field.value = 'test_value';

      expect(field.value).toBeUndefined();
    });

    it('should return a formField via form.field() shortcut', () => {
      const props = { value: { name: 'Alice' } };
      const form = formState(z.object({ name: z.string() }), props);

      const field = form.field('name');
      expect(field).toBeDefined();
      expect(field.name).toBe('name');
      expect(field.value).toBe('Alice');
    });
  });

  describe('Lifecycle & Cleanup', () => {
    it('should explicitly clean up subscriptions and all internal stores when component unmounts (reactive props)', () => {
      const scope = createLifecycle();
      let form: FormState<AnyType>;

      scope.run(() => {
        const props = mutable({ value: { name: 'test' } });
        form = formState(z.object({ name: z.string() }), props);
      });

      scope.destroy();
      expect(form!.fields['name']).toBeUndefined();
    });

    it('should clean up internal stores even if props are completely non-reactive', () => {
      const scope = createLifecycle();
      let form: FormState<AnyType>;

      scope.run(() => {
        // Plain JS object, not reactive (anchor.has() will be false)
        const props = { value: { name: 'static' } };
        form = formState(z.object({ name: z.string() }), props);
        expect(form.fields['name']).toBe('static');
      });

      // Manually trigger the lifecycle unmount
      scope.destroy();

      // Internal stores MUST still be cleared to prevent memory leaks
      expect(form!.fields['name']).toBeUndefined();
    });
  });

  describe('Form Submission', () => {
    it('should handle successful submission and update status/pending', async () => {
      const props = { value: { name: 'John' } };
      const form = formState(z.object({ name: z.string() }), props);

      expect(form.status).toBe('idle');
      expect(form.pending).toBe(false);
      expect(form.changed).toBe(false);
      expect(form.canSubmit).toBe(false); // False because no changes
      expect(form.error).toBeUndefined();

      // Make a change so it can be submitted
      form.fields['name'] = 'Jane';
      expect(form.changed).toBe(true);
      expect(form.canSubmit).toBe(true);

      const handler = vi.fn().mockImplementation(async (data) => {
        expect(form.status).toBe('pending');
        expect(form.pending).toBe(true);
        expect(form.canSubmit).toBe(false);
        return Promise.resolve();
      });

      await form.submit(handler);

      expect(handler).toHaveBeenCalledWith({ name: 'Jane' }, expect.objectContaining({}));
      expect(form.status).toBe('success');
      expect(form.pending).toBe(false);
      expect(form.changed).toBe(false); // Changes are cleared by default settle behavior
      expect(form.canSubmit).toBe(false);
    });

    it('should preserve changes after successful submission if settle is false', async () => {
      const props = { value: { name: 'John' } };
      const form = formState(z.object({ name: z.string() }), props);

      form.fields['name'] = 'Jane';
      expect(form.changed).toBe(true);

      const handler = vi.fn().mockResolvedValue(undefined);

      // Submit with settle = false
      await form.submit(handler, false);

      expect(form.status).toBe('success');

      // Changes should be preserved
      expect(form.changed).toBe(true);
      expect(form.changes).toEqual({ name: 'Jane' });

      // Form should remain submittable
      expect(form.canSubmit).toBe(true);
    });

    it('should respect settleOnSubmit false from form options', async () => {
      const props = { value: { name: 'John' } };
      const form = formState(z.object({ name: z.string() }), props, { settleOnSubmit: false });

      form.fields['name'] = 'Jane';
      expect(form.changed).toBe(true);

      const handler = vi.fn().mockResolvedValue(undefined);

      // Submit without explicitly passing the settle argument
      await form.submit(handler);

      expect(form.status).toBe('success');

      // Changes should be preserved because form was configured with settleOnSubmit: false
      expect(form.changed).toBe(true);
      expect(form.changes).toEqual({ name: 'Jane' });
      expect(form.canSubmit).toBe(true);
    });

    it('should handle failed submission and store the error', async () => {
      const props = { value: { name: 'John' } };
      const form = formState(z.object({ name: z.string() }), props);

      form.fields['name'] = 'Jane'; // Make it submittable

      const handlerError = new Error('Network failed');
      const handler = vi.fn().mockRejectedValue(handlerError);

      await form.submit(handler);

      expect(form.status).toBe('error');
      expect(form.error).toBe(handlerError);
    });

    it('should prevent overlapping submissions if form is already locked', async () => {
      const props = { value: { name: 'John' } };
      const form = formState(z.object({ name: z.string() }), props);

      form.fields['name'] = 'Jane'; // Make it submittable

      let resolvePromise: () => void;
      const promise = new Promise<void>((r) => {
        resolvePromise = r;
      });
      const handler = vi.fn().mockImplementation(() => promise);

      const sub1 = form.submit(handler);
      const sub2 = form.submit(handler);

      resolvePromise!();
      await Promise.all([sub1, sub2]);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Fine-Grained Reactivity', () => {
    it('should only trigger the effect watching a specific field when that field changes', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      const nameSpy = vi.fn();
      const ageSpy = vi.fn();

      effect(() => {
        nameSpy(form.fields['name']);
      });
      effect(() => {
        ageSpy(form.fields['age']);
      });

      expect(nameSpy).toHaveBeenCalledTimes(1);
      expect(ageSpy).toHaveBeenCalledTimes(1);

      form.fields['name'] = 'Bob';

      expect(nameSpy).toHaveBeenCalledTimes(2);
      expect(ageSpy).toHaveBeenCalledTimes(1); // age effect must NOT re-run
    });

    it('should only trigger the error effect for the field that failed validation', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      const nameErrorSpy = vi.fn();
      const ageErrorSpy = vi.fn();

      effect(() => {
        nameErrorSpy(form.errors['name']);
      });
      effect(() => {
        ageErrorSpy(form.errors['age']);
      });

      expect(nameErrorSpy).toHaveBeenCalledTimes(1);
      expect(ageErrorSpy).toHaveBeenCalledTimes(1);

      // Trigger a validation error on name only
      form.fields['name'] = 'Al'; // min(3) fails

      expect(nameErrorSpy).toHaveBeenCalledTimes(2);
      expect(ageErrorSpy).toHaveBeenCalledTimes(1); // age error effect must NOT re-run
    });

    it('should isolate nested field effects from sibling field mutations', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      const citySpy = vi.fn();
      const zipSpy = vi.fn();

      effect(() => {
        citySpy(form.fields['address.city']);
      });
      effect(() => {
        zipSpy(form.fields['address.zip']);
      });

      expect(citySpy).toHaveBeenCalledTimes(1);
      expect(zipSpy).toHaveBeenCalledTimes(1);

      form.fields['address.city'] = 'LA';

      expect(citySpy).toHaveBeenCalledTimes(2);
      expect(zipSpy).toHaveBeenCalledTimes(1); // zip effect must NOT re-run
    });

    it('should trigger changeSize effect only when changeSize value changes', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      const sizeSpy = vi.fn();
      const nameSpy = vi.fn();

      // Track the changed boolean (reads store.changeSize internally)
      effect(() => {
        sizeSpy(form.changed);
      });
      // Track name field independently
      effect(() => {
        nameSpy(form.fields['name']);
      });

      expect(sizeSpy).toHaveBeenCalledTimes(1);
      expect(nameSpy).toHaveBeenCalledTimes(1);

      // First change: changeSize 0 → 1
      form.fields['name'] = 'Bob';
      expect(sizeSpy).toHaveBeenCalledTimes(2);
      expect(nameSpy).toHaveBeenCalledTimes(2);

      // Second change on different field: changeSize 1 → 2
      // sizeSpy re-runs because the tracked value (changeSize) changed
      // nameSpy must NOT re-run — name didn't change
      form.fields['address.city'] = 'LA';
      expect(sizeSpy).toHaveBeenCalledTimes(3);
      expect(nameSpy).toHaveBeenCalledTimes(2); // Fine-grained: name is isolated
    });

    it('should not trigger field effects when an unrelated field is reset to its original value', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      const nameSpy = vi.fn();

      form.fields['name'] = 'Bob';
      form.fields['age'] = 30;

      effect(() => {
        nameSpy(form.fields['name']);
      });

      expect(nameSpy).toHaveBeenCalledTimes(1);

      // Revert age back to original — name effect must not fire
      form.fields['age'] = 25;

      expect(nameSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Touched Tracking', () => {
    it('should automatically mark a field as touched on first mutation', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      expect(form.touched['name']).toBeUndefined();
      expect(form.touched['age']).toBeUndefined();

      form.fields['name'] = 'Bob';

      expect(form.touched['name']).toBe(true);
      expect(form.touched['age']).toBeUndefined(); // untouched
    });

    it('should persist touched even after reverting value to original', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      form.fields['name'] = 'Bob';
      expect(form.touched['name']).toBe(true);
      expect(form.changed).toBe(true);

      // Revert to original
      form.fields['name'] = 'Alice';
      expect(form.changed).toBe(false); // no diff from initial
      expect(form.touched['name']).toBe(true); // still touched — can't un-touch
    });

    it('should clear all touched state on reset', () => {
      const props = {
        value: { name: 'Alice', age: 25, address: { city: 'NY', zip: '10001' } },
      };
      const form = formState(userSchema, props);

      form.fields['name'] = 'Bob';
      form.fields['age'] = 30;
      expect(form.touched['name']).toBe(true);
      expect(form.touched['age']).toBe(true);

      form.reset();

      expect(form.touched['name']).toBeUndefined();
      expect(form.touched['age']).toBeUndefined();
    });
  });
});
