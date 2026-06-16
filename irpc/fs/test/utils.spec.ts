import { IRPCFile } from '@irpclib/irpc';
import { describe, expect, it, test } from 'vitest';
import { getFileExt, getFileType, getMimeType, stripPath, validateWrite } from '../src/utils.js';

describe('utils', () => {
  describe('getFileExt', () => {
    test('gets extension', () => {
      expect(getFileExt('file.txt')).toBe('txt');
      expect(getFileExt('noext')).toBe('file');
      expect(getFileExt('/path/to/file.txt')).toBe('txt');
    });
  });

  describe('stripPath', () => {
    it('strips rootPath correctly', () => {
      const config = { rootPath: '/uploads' };
      expect(stripPath(config, '/uploads/file.txt')).toBe('/file.txt');
    });

    it('strips rootPath exactly when path is exactly root without trailing slash', () => {
      const config = { rootPath: '/uploads/' };
      expect(stripPath(config, '/uploads')).toBe('/'); // Hits line 28
    });

    it('returns root when path is exactly root with trailing slash', () => {
      const config = { rootPath: '/uploads' };
      expect(stripPath(config, '/uploads/')).toBe('/');
    });
  });

  describe('validateWrite', () => {
    it('allows write when file has no type and allowedTypes is not set', () => {
      const file = new IRPCFile({ name: 'file.txt', size: 0 } as any, new Blob());
      expect(() => validateWrite({}, file)).not.toThrow();
    });

    it('rejects write when file has no type but allowedTypes is set', () => {
      const file = new IRPCFile({ name: 'file.txt', size: 0 } as any, new Blob());
      expect(() => validateWrite({ allowedTypes: ['txt'] }, file)).toThrowError(/file type {2}is not allowed/);
    });
  });

  describe('getMimeType', () => {
    test('maps standard extensions to mime types', () => {
      expect(getMimeType('txt')).toBe('text/plain');
      expect(getMimeType('.json')).toBe('application/json');
      expect(getMimeType('png')).toBe('image/png');
      expect(getMimeType('jpg')).toBe('image/jpeg');
      expect(getMimeType('jpeg')).toBe('image/jpeg');
      expect(getMimeType('gif')).toBe('image/gif');
      expect(getMimeType('svg')).toBe('image/svg+xml');
      expect(getMimeType('pdf')).toBe('application/pdf');
      expect(getMimeType('html')).toBe('text/html');
      expect(getMimeType('css')).toBe('text/css');
      expect(getMimeType('js')).toBe('application/javascript');
      expect(getMimeType('csv')).toBe('text/csv');
      expect(getMimeType('zip')).toBe('application/zip');
      expect(getMimeType('xml')).toBe('application/xml');
      expect(getMimeType('mp4')).toBe('video/mp4');
      expect(getMimeType('mp3')).toBe('audio/mpeg');
      expect(getMimeType('wav')).toBe('audio/wav');
      expect(getMimeType('webp')).toBe('image/webp');
      expect(getMimeType('webm')).toBe('video/webm');
      expect(getMimeType('unknown')).toBe('application/octet-stream');
    });
  });

  describe('getFileType', () => {
    test('maps mime types to standard extensions', () => {
      expect(getFileType('text/plain')).toBe('txt');
      expect(getFileType('image/jpeg')).toBe('jpg');
      expect(getFileType('image/svg+xml')).toBe('svg');
      expect(getFileType('application/javascript')).toBe('js');
      expect(getFileType('audio/mpeg')).toBe('mp3');
      expect(getFileType('application/json')).toBe('json');
      expect(getFileType('application/octet-stream')).toBe('file');
      expect(getFileType('application/octet-stream', 'bin')).toBe('bin');
      expect(getFileType('')).toBe('file');
      expect(getFileType('invalid')).toBe('file');
      expect(getFileType('text/html; charset=utf-8')).toBe('html');
    });
  });
});
