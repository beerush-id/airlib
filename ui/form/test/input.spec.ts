import { mutable } from '@anchorlib/core';
import { describe, expect, it, vi } from 'vitest';
import { FORM_FIELD_SYMBOL } from '../src/contant.js';
import { context } from '../src/context.js';
import { formInput } from '../src/field.js';
import type { AnyType, FormFieldState } from '../src/types.js';

function mockField<T>(name: string, value: T, error?: string[]): FormFieldState<T> {
  const state = mutable({ value, disabled: false });
  return {
    get name() {
      return name;
    },
    get value() {
      return state.value;
    },
    set value(v: AnyType) {
      state.value = v;
    },
    get error() {
      return error;
    },
    get valid() {
      return !error;
    },
    get disabled() {
      return state.disabled;
    },
    set disabled(v: boolean) {
      state.disabled = v;
    }
  } as FormFieldState<T>;
}

describe('formInput', () => {
  describe('Standalone (no field context)', () => {
    it('should initialize buffer from props.value', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state = formInput({ name: 'age', type: 'number', value: 42 });

      expect(state.name).toBe('age');
      expect(state.type).toBe('number');
      expect(state.value).toBe('42');

      vi.restoreAllMocks();
    });

    it('should fallback to props.name or empty string', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state1 = formInput({ type: 'text', name: 'custom' });
      expect(state1.name).toBe('custom');

      const state2 = formInput({ type: 'text' } as any);
      expect(state2.name).toBe('');

      vi.restoreAllMocks();
    });

    it('should default type to text', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state = formInput({ name: 'username' });

      expect(state.type).toBe('text');
      expect(state.value).toBe('');

      vi.restoreAllMocks();
    });

    it('should update buffer on write', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state = formInput({ name: 'username' });
      state.value = 'hello';

      expect(state.value).toBe('hello');

      vi.restoreAllMocks();
    });

    it('should default valid to true and error to undefined without field', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state = formInput({ name: 'test' });

      expect(state.valid).toBe(true);
      expect(state.error).toBeUndefined();
      expect(state.disabled).toBe(false);

      const disabledState = formInput({ name: 'test', disabled: true });
      expect(disabledState.disabled).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe('With field context', () => {
    it('should initialize buffer from field.value', () => {
      const field = mockField('price', 99.99);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'number' });

      expect(state.name).toBe('price');
      expect(state.value).toBe('99.99');

      vi.restoreAllMocks();
    });

    it('should write parsed value to field', () => {
      const field = mockField('price', 0);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'number' });
      state.value = '25.5';

      expect(state.value).toBe('25.5');
      expect(field.value).toBe(25.5);

      vi.restoreAllMocks();
    });

    it('should pass through error and valid from field', () => {
      const field = mockField('email', '', ['invalid email']);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'email' });

      expect(state.valid).toBe(false);
      expect(state.error).toEqual(['invalid email']);

      vi.restoreAllMocks();
    });

    it('should inherit disabled state from field or use props.disabled', () => {
      const field = mockField('email', '');
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state1 = formInput({ type: 'email' });
      expect(state1.disabled).toBe(false);

      const state2 = formInput({ type: 'email', disabled: true });
      expect(state2.disabled).toBe(true);

      (field as AnyType).disabled = true; // using the mock setter we added
      expect(state1.disabled).toBe(true); // inherits from field

      vi.restoreAllMocks();
    });
  });

  describe('Parse guard', () => {
    it('should skip writing NaN to field for number type', () => {
      const field = mockField('count', 10);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'number' });
      state.value = 'abc';

      expect(state.value).toBe('abc');
      expect(field.value).toBe(10);

      vi.restoreAllMocks();
    });

    it('should skip writing NaN for range type', () => {
      const field = mockField('slider', 50);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'range' });
      state.value = 'not-a-number';

      expect(state.value).toBe('not-a-number');
      expect(field.value).toBe(50);

      vi.restoreAllMocks();
    });
  });

  describe('Checkbox type', () => {
    it('should fallback to props.checked or false', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state1 = formInput({ type: 'checkbox', checked: true });
      expect(state1.checked).toBe(true);

      const state2 = formInput({ type: 'checkbox' });
      expect(state2.checked).toBe(false);

      const field = mockField('agree', undefined);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });
      const state3 = formInput({ type: 'checkbox', checked: true });
      expect(state3.checked).toBe(true);

      vi.restoreAllMocks();
    });

    it('should parse to boolean', () => {
      const field = mockField('agree', false);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'checkbox' });
      expect(state.value).toBe('');
      expect(state.checked).toBe(false);

      state.checked = true;
      expect(field.value).toBe(true);

      state.checked = false;
      expect(field.value).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('Custom parse/stringify', () => {
    it('should use custom functions from options', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state = formInput(
        { name: 'price', value: 1999 },
        {
          parse: (raw) => Number(raw.replace(/[^0-9]/g, '')),
          stringify: (value) => `$${value}`,
        }
      );

      expect(state.value).toBe('$1999');

      state.value = '$2500';
      expect(state.value).toBe('$2500');

      vi.restoreAllMocks();
    });
  });

  describe('Text passthrough types', () => {
    it('should pass through string identity for text types', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      for (const type of ['text', 'email', 'url', 'tel', 'password', 'search', 'hidden', 'color'] as const) {
        const state = formInput({ name: 'field', type, value: 'test' });
        expect(state.value).toBe('test');

        state.value = 'updated';
        expect(state.value).toBe('updated');
      }

      vi.restoreAllMocks();
    });
  });

  describe('Date types', () => {
    it('should pass through string for date type', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const state = formInput({ name: 'dob', type: 'date', value: '2026-06-02' });
      expect(state.value).toBe('2026-06-02');

      state.value = '2026-12-25';
      expect(state.value).toBe('2026-12-25');

      vi.restoreAllMocks();
    });

    it('should stringify datetime-local correctly', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const date = new Date(2026, 5, 2, 14, 30);
      const state = formInput({ name: 'event', type: 'datetime-local', value: date as any });

      expect(state.value).toBe('2026-06-02T14:30');
      vi.restoreAllMocks();
    });

    it('should stringify time correctly', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const date = new Date(2026, 5, 2, 14, 30);
      const state = formInput({ name: 'alarm', type: 'time', value: date as any });

      expect(state.value).toBe('14:30');
      vi.restoreAllMocks();
    });

    it('should stringify month correctly', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const date = new Date(2026, 5, 2);
      const state = formInput({ name: 'expiry', type: 'month', value: date as any });

      expect(state.value).toBe('2026-06');
      vi.restoreAllMocks();
    });

    it('should stringify week correctly', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const date = new Date(2026, 0, 1); // Jan 1, 2026
      const state = formInput({ name: 'week', type: 'week', value: date as any });

      expect(state.value).toBe('2026-W01');
      vi.restoreAllMocks();
    });

    it('should return invalid input when parsing empty string for dates', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const state = formInput({ type: 'date' });
      state.value = '';
      expect(state.value).toBe('');
      vi.restoreAllMocks();
    });

    it('should handle invalid string dates in stringify gracefully', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const types = ['date', 'datetime-local', 'time', 'month', 'week'] as const;
      for (const type of types) {
        const state = formInput({ name: 'invalid', type, value: 'not-a-valid-date' });
        expect(state.value).toBe('');
      }

      vi.restoreAllMocks();
    });

    it('should handle invalid dates in stringify gracefully', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const invalidDate = new Date('invalid');

      const state = formInput({ name: 'invalid', type: 'datetime-local', value: invalidDate as any });
      expect(state.value).toBe('');

      vi.restoreAllMocks();
    });

    it('should skip writing invalid dates to field on input', () => {
      const field = mockField('date', new Date());
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'date' });
      const initialFieldVal = field.value;

      state.value = 'not-a-date';
      expect(state.value).toBe('not-a-date'); // buffer is updated
      expect(field.value).toBe(initialFieldVal); // field is not updated

      vi.restoreAllMocks();
    });
  });

  describe('Radio and Toggle types', () => {
    it('should sync checked status based on field value matching props value', () => {
      const field = mockField('theme', 'dark');
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'radio', value: 'light' });
      expect(state.checked).toBe(false);

      field.value = 'light';
      expect(state.checked).toBe(true);
      expect(state.value).toBe('light');

      vi.restoreAllMocks();
    });

    it('should write value to field when checked', () => {
      const field = mockField('theme', 'dark');
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const state = formInput({ type: 'toggle', value: 'light' });
      state.checked = true;

      expect(field.value).toBe('light');
      vi.restoreAllMocks();
    });
  });

  describe('settled', () => {
    it('should re-sync from props if field exists but value is undefined', () => {
      const field = mockField('name', undefined);
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_FIELD_SYMBOL) return field;
        return undefined;
      });

      const props = { name: 'name', type: 'text' as const, value: 'Default' };
      const state = formInput(props);
      state.settled();
      expect(state.value).toBe('Default');

      vi.restoreAllMocks();
    });

    it('should re-sync text input from props if field is absent', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const props = { name: 'name', type: 'text' as const, value: 'John' };
      const state = formInput(props);
      expect(state.value).toBe('John');

      props.value = 'Jane';
      state.settled();
      expect(state.value).toBe('Jane');

      vi.restoreAllMocks();
    });

    it('should skip boolean inputs on settled', () => {
      vi.spyOn(context, 'read').mockReturnValue(undefined);
      const props = { name: 'agree', type: 'checkbox' as const, checked: true };
      const state = formInput(props);

      expect(state.checked).toBe(true);
      expect(state.value).toBe(''); // checkbox has no text value

      props.checked = false;
      state.settled(); // should do nothing for boolean inputs

      expect(state.value).toBe('');

      vi.restoreAllMocks();
    });
  });
});
