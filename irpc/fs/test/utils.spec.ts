import { withIsolation } from '@airlib/core';
import { IRPCFile } from '@irpclib/irpc';
import { describe, expect, it } from 'vitest';
import { type FSConfig, setFSConfig } from '../src/context.js';
import type { AnyType } from '../src/types.js';
import {
  errorCode,
  getFileExt,
  getMimeType,
  join,
  normalizePath,
  normalizeType,
  resolveRequest,
  resolveWriteAccess,
  resolveWriteLimit,
  withExt,
} from '../src/utils.js';

describe('utils', () => {
  describe('join', () => {
    it('joins segments properly', () => {
      expect(join('a', 'b')).toBe('/a/b');
      expect(join('/a/', '/b/')).toBe('/a/b');
      expect(join('a', '..', 'b')).toBe('/b');
      expect(join('a', '.', 'b')).toBe('/a/b');
      expect(join(undefined, 'b')).toBe('/b');
    });
  });

  describe('normalizePath', () => {
    it('normalizes paths properly', () => {
      expect(normalizePath('a/b')).toBe('/a/b');
      expect(normalizePath('a/../b')).toBe('/b');
      expect(normalizePath('', true)).toBe('/');
      expect(normalizePath('a', true)).toBe('/a/');
      expect(normalizePath('/a/b/', false)).toBe('/a/b');
    });
  });

  describe('resolveRequest', () => {
    it('resolves request path and meta', () => {
      const config = { rootPath: '/root', pathPrefix: 'prefix', thumbnailPrefix: 'thumb' };
      const meta = { type: 'txt' } as AnyType;
      const res = resolveRequest(config, meta, 'file.txt', false);

      expect(res.path).toBe('/file.txt');
      expect(res.meta.prefix).toBe('/root/prefix');
      expect(res.meta.thumbnailPrefix).toBe('/root/thumb');
    });

    it('handles config with missing rootPath or pathPrefix gracefully', () => {
      const config = { thumbnailPrefix: 'thumb' };
      const meta = { type: 'txt' } as AnyType;
      const res = resolveRequest(config, meta, 'file.txt', false);

      expect(res.meta.prefix).toBe('/raw');
      expect(res.meta.thumbnailPrefix).toBe('/thumb');
    });
  });

  describe('resolveWriteAccess & resolveWriteLimit', () => {
    const runWithConfig = <T>(config: Partial<FSConfig>, fn: () => T) => {
      return withIsolation(() => {
        setFSConfig(config);
        return fn();
      });
    };

    it('resolveWriteAccess allows write if not readOnly', () => {
      runWithConfig({ readOnly: false }, () => {
        expect(() => resolveWriteAccess()).not.toThrow();
      });
    });

    it('resolveWriteAccess throws if readOnly', () => {
      runWithConfig({ readOnly: true }, () => {
        expect(() => resolveWriteAccess()).toThrowError(/not permitted/i);
      });
    });

    it('resolveWriteLimit checks file size', () => {
      runWithConfig({ maxFileSize: 100 }, () => {
        const file = new IRPCFile({ size: 200, type: 'txt' } as AnyType);
        expect(() => resolveWriteLimit(file)).toThrowError(/too large/i);
      });
    });

    it('resolveWriteLimit checks allowed types', () => {
      runWithConfig({ allowedTypes: ['jpg', 'png'] }, () => {
        const file = new IRPCFile({ size: 10, type: 'txt' } as AnyType);
        expect(() => resolveWriteLimit(file)).toThrowError(/not permitted/i);

        const goodFile = new IRPCFile({ size: 10, type: 'jpg' } as AnyType);
        expect(() => resolveWriteLimit(goodFile)).not.toThrowError();
      });
    });

    it('resolveWriteLimit rejects files completely missing meta.type if allowedTypes is strict', () => {
      runWithConfig({ allowedTypes: ['jpg', 'png'] }, () => {
        const file = new IRPCFile({ size: 10 } as AnyType); // Intentionally missing type
        expect(() => resolveWriteLimit(file)).toThrowError(/not permitted/i);
      });
    });
  });

  describe('getFileExt & withExt', () => {
    it('getFileExt extracts extensions properly', () => {
      expect(getFileExt('file.txt')).toBe('txt');
      expect(getFileExt('noext')).toBe('');
      expect(getFileExt('/path/to/file.TXT')).toBe('txt');
    });

    it('withExt replaces extensions properly', () => {
      expect(withExt('file.txt', 'md')).toBe('file.md');
      expect(withExt('/path/file.txt', 'jpg')).toBe('/path/file.jpg');
    });
  });

  describe('normalizeType', () => {
    it('normalizes standard MIME types into short extensions for consistent handling', () => {
      const file = { type: 'text/plain' };
      normalizeType(file);
      expect(file.type).toBe('txt');
    });

    it('accepts short extensions directly when provided by the client', () => {
      const file = { type: 'txt' };
      normalizeType(file);
      expect(file.type).toBe('txt');
    });

    it('resolves common aliases to their primary extension', () => {
      const file = { type: 'plain' };
      normalizeType(file);
      expect(file.type).toBe('txt');
    });

    it('rejects untrusted or unknown file types to prevent spoofing', () => {
      const file = { type: 'image/unknown' };
      normalizeType(file);
      expect(file.type).toBeUndefined();
    });

    it('refuses to guess types from filenames when the type is empty to ensure zero-trust security', () => {
      const file = { type: '', name: 'test.svg' };
      normalizeType(file);
      expect(file.type).toBeUndefined();
    });

    it('refuses to guess types when completely omitted to ensure safe binary defaults', () => {
      const file = { type: undefined as string | undefined, name: 'test.svg' };
      normalizeType(file);
      expect(file.type).toBeUndefined();
    });

    it('deletes nested IRPCFile metadata type if untrusted', () => {
      const file = { meta: { type: 'image/unknown' } };
      normalizeType(file);
      expect((file.meta as AnyType).type).toBeUndefined();
    });

    it('deletes nested IRPCFile metadata type if missing entirely', () => {
      const file = { meta: { name: 'test.svg' } };
      normalizeType(file);
      expect((file.meta as AnyType).type).toBeUndefined();
    });

    it('handles nested IRPCFile metadata seamlessly', () => {
      const file = { meta: { type: 'application/json' } };
      normalizeType(file);
      expect(file.meta.type).toBe('json');
    });
  });

  describe('getMimeType', () => {
    it('maps standard extensions and full filenames to mime types', () => {
      expect(getMimeType('txt')).toBe('text/plain');
      expect(getMimeType('file.json')).toBe('application/json');
      expect(getMimeType('.png')).toBe('image/png');
      expect(getMimeType('jpg')).toBe('image/jpeg');
      expect(getMimeType('unknown')).toBe('application/octet-stream');
    });

    it('falls back securely for trailing dots without extensions', () => {
      expect(getMimeType('file.')).toBe('application/octet-stream');
    });
  });

  describe('errorCode', () => {
    it('extracts error code safely', () => {
      expect(errorCode({ code: 'ENOENT' })).toBe('ENOENT');
      expect(errorCode({ message: 'ENOENT' })).toBeUndefined();
      expect(errorCode(null)).toBeUndefined();
      expect(errorCode('ENOENT')).toBeUndefined();
    });
  });
});
