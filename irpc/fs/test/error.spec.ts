import { describe, expect, it } from 'vitest';
import { FSError } from '../src/error.js';

describe('File System Error', () => {
  it('creates forbidden error with correct properties', () => {
    const err = FSError.forbidden('read', '/path');
    expect(err.message).toBe('Permission denied');
    expect(err.code).toBe('forbidden');
    expect(err.action).toBe('read');
    expect(err.path).toBe('/path');

    const errNoPath = FSError.forbidden('read');
    expect(errNoPath.path).toBeUndefined();
  });

  it('creates notFound error with correct properties', () => {
    const err = FSError.notFound('read', '/path');
    expect(err.message).toBe('File or directory not found');
    expect(err.code).toBe('not_found');
    expect(err.action).toBe('read');
    expect(err.path).toBe('/path');

    const errNoPath = FSError.notFound('read');
    expect(errNoPath.path).toBeUndefined();
  });

  it('creates failed error with correct properties', () => {
    const err = FSError.failed('write', '/path');
    expect(err.message).toBe('Operation failed');
    expect(err.code).toBe('failed');
    expect(err.action).toBe('write');
    expect(err.path).toBe('/path');

    const errNoPath = FSError.failed('write');
    expect(errNoPath.path).toBeUndefined();
  });

  it('creates tooLarge error with correct properties', () => {
    const err = FSError.tooLarge('write', '/path');
    expect(err.message).toBe('File is too large');
    expect(err.code).toBe('too_large');
    expect(err.action).toBe('write');
    expect(err.path).toBe('/path');

    const errNoPath = FSError.tooLarge('write');
    expect(errNoPath.path).toBeUndefined();
  });

  it('creates notEmpty error with correct properties', () => {
    const err = FSError.notEmpty('rmdir', '/path');
    expect(err.message).toBe('Directory is not empty');
    expect(err.code).toBe('not_empty');
    expect(err.action).toBe('rmdir');
    expect(err.path).toBe('/path');

    const errNoPath = FSError.notEmpty('rmdir');
    expect(errNoPath.path).toBeUndefined();
  });

  it('creates notSupported error with correct properties', () => {
    const err = FSError.notSupported('move', '/path');
    expect(err.message).toBe('Operation not supported');
    expect(err.code).toBe('not_supported');
    expect(err.action).toBe('move');
    expect(err.path).toBe('/path');

    const errNoPath = FSError.notSupported('move');
    expect(errNoPath.path).toBeUndefined();
  });

  it('creates notPermitted error with correct properties', () => {
    const err = FSError.notPermitted('write', '/path');
    expect(err.message).toBe('Operation not permitted');
    expect(err.code).toBe('not_permitted');
    expect(err.action).toBe('write');
    expect(err.path).toBe('/path');

    const errNoPath = FSError.notPermitted('write');
    expect(errNoPath.path).toBeUndefined();
  });
});
