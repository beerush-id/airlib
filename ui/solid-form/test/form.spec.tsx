/** @jsxImportSource solid-js */

import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { Field } from '../src/Field.js';
import { Form } from '../src/Form.js';
import { TextInput } from '../src/inputs/TextInput.js';

afterEach(cleanup);

const userSchema = z.object({
  name: z.string().min(3, 'Name too short'),
  email: z.string().email('Invalid email'),
});

describe('Form', () => {
  it('should render a <form> element', () => {
    const { container } = render(() => <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }} />);
    expect(container.querySelector('form')).not.toBeNull();
  });

  it('should forward intrinsic props to the <form> element', () => {
    render(() => (
      <Form
        schema={userSchema}
        value={{ name: 'John', email: 'john@test.com' }}
        class="my-form"
        id="test-form"
        data-testid="form"
      />
    ));
    const form = screen.getByTestId('form');
    expect(form.className).toBe('my-form');
    expect(form.id).toBe('test-form');
  });

  it('should not leak schema or value to the DOM', () => {
    render(() => <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }} data-testid="form" />);
    const form = screen.getByTestId('form');
    expect(form.getAttribute('schema')).toBeNull();
    expect(form.getAttribute('value')).toBeNull();
  });

  it('should render children', () => {
    render(() => (
      <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }}>
        <button type="submit">Submit</button>
      </Form>
    ));
    expect(screen.getByText('Submit')).toBeDefined();
  });

  it('should call onSubmit with validated data on form submission', async () => {
    const handleSubmit = vi.fn();

    const { container } = render(() => (
      <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }} onSubmit={handleSubmit}>
        <Field name="name">
          <TextInput data-testid="name-input" />
        </Field>
        <button type="submit">Submit</button>
      </Form>
    ));

    fireEvent.input(screen.getByTestId('name-input'), { target: { value: 'Jane' } });

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalledTimes(1);

    const [data, changes, event] = handleSubmit.mock.calls[0];
    expect(data.name).toBe('Jane');
    expect(changes.name).toBe('Jane');
    expect(event).toBeDefined();
  });

  it('should prevent default form submission', () => {
    const { container } = render(() => (
      <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }}>
        <button type="submit">Submit</button>
      </Form>
    ));

    const form = container.querySelector('form')!;
    const event = new Event('submit', { bubbles: true, cancelable: true });
    const prevented = !form.dispatchEvent(event);
    expect(prevented).toBe(true);
  });
});
