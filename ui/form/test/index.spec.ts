import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { formFactory } from '../src/index.js';

describe('formFactory', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  it('should initialize a form state when called as a function', () => {
    const factory = formFactory(schema);
    const form = factory({ value: { name: 'Alice', age: 30 } });

    expect(factory.get()).toBe(form);
    expect(form).toBeDefined();
    expect(form.fields.name).toBe('Alice');
    expect(form.output.age).toBe(30);
  });

  it('should provide a field extraction method on the factory', () => {
    const factory = formFactory(schema);
    const form = factory({ value: { name: 'Bob', age: 25 } });

    // Ensure the factory field method works and syncs with the initialized form
    const nameField = factory.field('name');
    expect(nameField).toBeDefined();
    expect(nameField.name).toBe('name');
    expect(nameField.value).toBe('Bob');

    // Mutating via the extracted field should update the form state
    nameField.value = 'Charlie';
    expect(nameField.value).toBe('Charlie');
    expect(form.fields.name).toBe('Charlie');
  });
});
