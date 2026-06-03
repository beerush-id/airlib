import '@anchorlib/react/client';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { Field } from '../src/Field.js';
import { Form } from '../src/Form.js';
import { TextInput } from '../src/inputs/TextInput.js';

afterEach(cleanup);

const userSchema = z.object({
  name: z.string().min(3, 'Name too short'),
  email: z.string().email('Invalid email'),
});

describe('Field', () => {
  describe('Structured mode', () => {
    it('should render a <div> with a label and children', () => {
      render(
        <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }}>
          <Field name="name" label="Full Name" data-testid="field">
            <TextInput data-testid="input" />
          </Field>
        </Form>
      );

      const field = screen.getByTestId('field');
      expect(field.tagName).toBe('DIV');
      expect(screen.getByText('Full Name')).toBeDefined();
      expect(screen.getByTestId('input')).toBeDefined();
    });

    it('should forward intrinsic props to the wrapping <div>', () => {
      render(
        <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }}>
          <Field name="name" className="field-group" id="name-field" data-testid="field">
            <TextInput />
          </Field>
        </Form>
      );

      const field = screen.getByTestId('field');
      expect(field.className).toBe('field-group');
      expect(field.id).toBe('name-field');
    });

    it('should apply labelClass to the label element', () => {
      render(
        <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }}>
          <Field name="name" label="Name" labelClass="label-style">
            <TextInput />
          </Field>
        </Form>
      );

      const label = screen.getByText('Name');
      expect(label.className).toBe('label-style');
    });

    it('should display validation errors with errorClass', () => {
      render(
        <Form schema={userSchema} value={{ name: 'Al', email: 'john@test.com' }}>
          <Field name="name" label="Name" errorClass="error-text" data-testid="field">
            <TextInput />
          </Field>
        </Form>
      );

      // The engine validates on init — 'Al' is < 3 chars
      const field = screen.getByTestId('field');
      const error = field.querySelector('.error-text');
      expect(error).toBeDefined();
      expect(error?.textContent).toContain('Name too short');
    });

    it('should not leak name, label, labelClass, errorClass to the DOM', () => {
      render(
        <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }}>
          <Field name="name" label="Name" labelClass="lbl" errorClass="err" data-testid="field">
            <TextInput />
          </Field>
        </Form>
      );

      const field = screen.getByTestId('field');
      expect(field.getAttribute('name')).toBeNull();
      expect(field.getAttribute('label')).toBeNull();
      expect(field.getAttribute('labelClass')).toBeNull();
      expect(field.getAttribute('errorClass')).toBeNull();
    });
  });

  describe('Headless mode', () => {
    it('should call render function with field state', () => {
      render(
        <Form schema={userSchema} value={{ name: 'John', email: 'john@test.com' }}>
          <Field name="name">
            {(field) => (
              <div data-testid="custom-field">
                <span data-testid="field-value">{String(field.value)}</span>
                <span data-testid="field-name">{field.name}</span>
              </div>
            )}
          </Field>
        </Form>
      );

      expect(screen.getByTestId('field-value').textContent).toBe('John');
      expect(screen.getByTestId('field-name').textContent).toBe('name');
    });
  });
});
