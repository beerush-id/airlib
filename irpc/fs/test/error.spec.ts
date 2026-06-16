import { describe, expect, test } from 'vitest';
import { FSError } from '../src/error.js';

describe('File System Error', () => {
  test('forbidden', () => {
    expect(() => {
      throw FSError.forbidden('test', 'path');
    }).toThrowError(/Forbidden/);
    expect(() => {
      throw FSError.forbidden('test');
    }).toThrowError(/Forbidden/);
  });
  test('notFound', () => {
    expect(() => {
      throw FSError.notFound('test', 'path');
    }).toThrowError(/NotFound/);
    expect(() => {
      throw FSError.notFound('test');
    }).toThrowError(/NotFound/);
  });
  test('failed', () => {
    expect(() => {
      throw FSError.failed('test', 'path');
    }).toThrowError(/Failed/);
    expect(() => {
      throw FSError.failed('test');
    }).toThrowError(/Failed/);
  });
  test('tooLarge', () => {
    expect(() => {
      throw FSError.tooLarge('test', 'path');
    }).toThrowError(/TooLarge/);
    expect(() => {
      throw FSError.tooLarge('test');
    }).toThrowError(/TooLarge/);
  });
  test('notEmpty', () => {
    expect(() => {
      throw FSError.notEmpty('test', 'path');
    }).toThrowError(/NotEmpty/);
    expect(() => {
      throw FSError.notEmpty('test');
    }).toThrowError(/NotEmpty/);
  });
  test('notSupported', () => {
    expect(() => {
      throw FSError.notSupported('test', 'path');
    }).toThrowError(/NotSupported/);
    expect(() => {
      throw FSError.notSupported('test');
    }).toThrowError(/NotSupported/);
  });
  test('notPermitted', () => {
    expect(() => {
      throw FSError.notPermitted('test', 'path');
    }).toThrowError(/NotPermitted/);
    expect(() => {
      throw FSError.notPermitted('test');
    }).toThrowError(/NotPermitted/);
  });
});
