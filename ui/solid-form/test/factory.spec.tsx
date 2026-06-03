/** @jsxImportSource solid-js */

import { mutable } from '@anchorlib/solid';
import { cleanup, fireEvent, render as renderComponent, screen } from '@solidjs/testing-library';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { For } from 'solid-js';
import { z } from 'zod';
import { createForm } from '../src/factory.js';
import { TextInput } from '../src/inputs/TextInput.js';

afterEach(cleanup);

const userSchema = z.object({
  name: z.string().min(3, 'Name too short'),
  email: z.string().email('Invalid email'),
  tags: z.array(z.string()).default([]),
});

describe('createForm', () => {
  it('should return a Form component with a Field subcomponent', () => {
    const UserForm = createForm(userSchema);
    expect(UserForm).toBeDefined();
    expect(UserForm.Field).toBeDefined();
  });

  it('should expose get() and field() static methods', () => {
    const UserForm = createForm(userSchema);
    expect(typeof UserForm.get).toBe('function');
    expect(typeof UserForm.field).toBe('function');
  });

  it('should render a working form with typed field', () => {
    const UserForm = createForm(userSchema);

    renderComponent(() => (
      <UserForm value={{ name: 'John', email: 'john@test.com' }}>
        <UserForm.Field name="name" label="Name" data-testid="field">
          <TextInput data-testid="input" />
        </UserForm.Field>
      </UserForm>
    ));

    const field = screen.getByTestId('field');
    expect(field).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();

    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('John');
  });

  it('should handle onSubmit with validated data', async () => {
    const UserForm = createForm(userSchema);
    const handleSubmit = vi.fn();

    const { container } = renderComponent(() => (
      <UserForm value={{ name: 'John', email: 'john@test.com' }} onSubmit={handleSubmit}>
        <UserForm.Field name="name">
          <TextInput data-testid="input" />
        </UserForm.Field>
        <button type="submit">Submit</button>
      </UserForm>
    ));

    fireEvent.input(screen.getByTestId('input'), { target: { value: 'Jane' } });
    fireEvent.submit(container.querySelector('form')!);

    expect(handleSubmit).toHaveBeenCalledTimes(1);

    const [data, changes] = handleSubmit.mock.calls[0];
    expect(data.name).toBe('Jane');
    expect(changes.name).toBe('Jane');
  });

  it('should support headless Field with render function', () => {
    const UserForm = createForm(userSchema);

    renderComponent(() => (
      <UserForm value={{ name: 'John', email: 'john@test.com' }}>
        <UserForm.Field name="name">
          {(field) => (
            <div data-testid="custom">
              <span data-testid="field-value">{String(field.value)}</span>
            </div>
          )}
        </UserForm.Field>
      </UserForm>
    ));

    expect(screen.getByTestId('field-value').textContent).toBe('John');
  });

  it('should display validation errors in structured Field', () => {
    const UserForm = createForm(userSchema);

    renderComponent(() => (
      <UserForm value={{ name: 'Al', email: 'john@test.com' }}>
        <UserForm.Field name="name" label="Name" errorClass="error-text" data-testid="field">
          <TextInput />
        </UserForm.Field>
      </UserForm>
    ));

    const error = screen.getByTestId('field').querySelector('.error-text');
    expect(error).not.toBeNull();
    expect(error?.textContent).toContain('Name too short');
  });

  it('should access form state via get()', () => {
    const UserForm = createForm(userSchema);

    function StateReader() {
      const form = UserForm.get();
      return <span data-testid="form-valid">{String(form?.valid)}</span>;
    }

    renderComponent(() => (
      <UserForm value={{ name: 'John', email: 'john@test.com' }}>
        <StateReader />
      </UserForm>
    ));

    expect(screen.getByTestId('form-valid').textContent).toBe('true');
  });

  it('should access typed field via field()', () => {
    const UserForm = createForm(userSchema);

    function FieldReader() {
      const field = UserForm.field('name');
      return <span data-testid="field-val">{String(field.value)}</span>;
    }

    renderComponent(() => (
      <UserForm value={{ name: 'Alice', email: 'alice@test.com' }}>
        <FieldReader />
      </UserForm>
    ));

    expect(screen.getByTestId('field-val').textContent).toBe('Alice');
  });

  it('should render FieldList with array items as inputs', () => {
    const UserForm = createForm(userSchema);

    renderComponent(() => (
      <UserForm value={{ name: 'John', email: 'j@t.com', tags: ['react', 'vue'] }}>
        <UserForm.FieldList name="tags">
          {(items: any[]) => (
            <>
              <For each={items}>
                {(_, i) => (
                  <UserForm.Field name={`tags.${i()}`}>
                    <TextInput data-testid={`tag-${i()}`} />
                  </UserForm.Field>
                )}
              </For>
            </>
          )}
        </UserForm.FieldList>
      </UserForm>
    ));

    expect((screen.getByTestId('tag-0') as HTMLInputElement).value).toBe('react');
    expect((screen.getByTestId('tag-1') as HTMLInputElement).value).toBe('vue');
  });

  it('should initialize empty array in FieldList when value is not an array', () => {
    const Schema = z.object({ items: z.any() });
    const TestForm = createForm(Schema);

    renderComponent(() => (
      <TestForm value={{ items: 'not-an-array' }}>
        <TestForm.FieldList name="items">
          {(items: any[]) => <span data-testid="count">{items.length}</span>}
        </TestForm.FieldList>
      </TestForm>
    ));

    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('should support array mutations like push() in FieldList', async () => {
    const UserForm = createForm(userSchema);
    const data = mutable({ name: 'John', email: 'j@t.com', tags: ['react'] });

    renderComponent(() => (
      <UserForm value={data}>
        <UserForm.FieldList name="tags">
          {(items: any[]) => (
            <>
              <For each={items}>
                {(_, i) => (
                  <UserForm.Field name={`tags.${i()}`}>
                    <TextInput data-testid={`tag-${i()}`} />
                  </UserForm.Field>
                )}
              </For>
              <button
                data-testid="add-tag"
                type="button"
                onClick={() => {
                  items.push('vue');
                }}
              >
                Add Tag
              </button>
            </>
          )}
        </UserForm.FieldList>
      </UserForm>
    ));

    expect((screen.getByTestId('tag-0') as HTMLInputElement).value).toBe('react');
    expect(screen.queryByTestId('tag-1')).toBeNull();

    fireEvent.click(screen.getByTestId('add-tag'));

    expect((screen.getByTestId('tag-1') as HTMLInputElement).value).toBe('vue');
  });
});
