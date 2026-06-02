import { getContext, setContext } from '@anchorlib/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { type AnyType, FORM_SYMBOL, formState, getForm, getFormField, setContextBridge } from '../src/index.js';

describe('Framework-Agnostic Context Bridge', () => {
  beforeEach(() => {
    // Restore default bridge before each test via the formal API
    setContextBridge({ read: getContext, write: setContext });
    vi.restoreAllMocks();
  });

  describe('setContextBridge (Safety & Validation)', () => {
    it('should successfully override context and integrate with getForm', () => {
      const mockState = { data: 'mocked' };
      const mockRead = vi.fn().mockReturnValue(mockState);
      const mockWrite = vi.fn();

      // Override the bridge
      setContextBridge({ read: mockRead, write: mockWrite });

      // Call public API
      const retrieved = getForm();

      // Verify the custom bridge was executed
      expect(mockRead).toHaveBeenCalledTimes(1);
      expect(mockRead).toHaveBeenCalledWith(FORM_SYMBOL);
      expect(retrieved).toBe(mockState);
    });

    it('should safely reject partial, undefined, or truthy non-function payloads', () => {
      const mockRead = vi.fn().mockReturnValue('custom');

      // Step 1: Set a custom valid read bridge
      setContextBridge({ read: mockRead, write: setContext });
      expect(getForm()).toBe('custom'); // verifies it's active
      expect(getFormField()).toBe('custom');

      // Step 2: Try to break it with booleans and nulls
      setContextBridge({ read: true, write: undefined } as AnyType);

      // The bridge should have safely rejected the boolean, leaving mockRead intact
      expect(getForm()).toBe('custom');
      expect(mockRead).toHaveBeenCalled();

      // Step 3: Try to break it with objects and strings
      setContextBridge({ read: {}, write: 'hack' } as AnyType);

      // The bridge should still be intact
      expect(getForm()).toBe('custom');
    });
  });

  describe('Core Integration', () => {
    it('formState should use the configured context bridge to inject state', () => {
      const mockWrite = vi.fn();

      // Override just the write bridge
      setContextBridge({ read: getContext, write: mockWrite });

      const schema = z.object({ name: z.string() });
      const state = formState(schema, { value: { name: 'test' } });

      // Verify formState pushed itself to the custom bridge
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledWith(FORM_SYMBOL, state);
    });
  });
});
