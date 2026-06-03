import { describe, expect, it, vi } from 'vitest';
import { FORM_FIELD_SYMBOL, FORM_SYMBOL } from '../src/contant.js';
import { context } from '../src/context.js';
import { formField } from '../src/field.js';
import type { AnyType } from '../src/types.js';

describe('formField', () => {
  describe('Standalone (no form context)', () => {
    it('should initialize and manage state independently', () => {
      // Ensure there is no form context
      vi.spyOn(context, 'read').mockReturnValue(undefined);

      const field = formField('standalone_field');

      // name getter
      expect(field.name).toBe('standalone_field');

      // valid getter (always true without form)
      expect(field.valid).toBe(true);

      // disabled getter (always false without form)
      expect(field.disabled).toBe(false);

      // error getter (always undefined without form)
      expect(field.error).toBeUndefined();

      // value setter early return
      field.value = 'hello';
      expect(field.value).toBeUndefined();

      // changed getter (always false without form)
      expect(field.changed).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('With form context', () => {
    it('should interact with the form state properly', () => {
      const changeStore: Record<string, AnyType> = {};
      const touchedStore: Record<string, boolean> = {};
      const mockForm = {
        fields: { test_field: 'initial_value' } as Record<string, AnyType>,
        errors: { test_field: ['invalid format'] } as Record<string, string[]>,
        pending: false,
        changeList: changeStore,
        touched: touchedStore,
      };

      let mockField: AnyType = undefined;
      vi.spyOn(context, 'read').mockImplementation((symbol) => {
        if (symbol === FORM_SYMBOL) return mockForm;
        if (symbol === FORM_FIELD_SYMBOL) return mockField;
        return undefined;
      });

      // Context write will be called by formField, spy on it
      const writeSpy = vi.spyOn(context, 'write').mockImplementation((sym, val) => {
        if (sym === FORM_FIELD_SYMBOL) mockField = val;
      });

      const field = formField('test_field');

      // Effect will immediately sync field.value with form.fields
      expect(field.value).toBe('initial_value');

      // error getter
      expect(field.error).toEqual(['invalid format']);

      // valid getter
      expect(field.valid).toBe(false);

      // disabled getter inherits from form.pending
      mockForm.pending = true;
      expect(field.disabled).toBe(true);
      mockForm.pending = false;
      expect(field.disabled).toBe(false);

      // value setter passes to form.setter
      field.value = 'new_value';
      expect(field.value).toBe('new_value');

      // input method returns formInputState
      const inputState = field.input({ type: 'text' });
      expect(inputState).toBeDefined();
      expect(inputState.name).toBe('test_field');
      expect(inputState.type).toBe('text');

      // settled method uses form.fields
      mockForm.fields['test_field'] = 'settled_value';
      expect(field.value).toBe('settled_value');
      // changed getter
      expect(field.changed).toBe(false);
      changeStore['test_field'] = 'new_value';
      expect(field.changed).toBe(true);
      delete changeStore['test_field'];
      expect(field.changed).toBe(false);

      // touched getter
      expect(field.touched).toBe(false);
      touchedStore['test_field'] = true;
      expect(field.touched).toBe(true);

      expect(writeSpy).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });
});
