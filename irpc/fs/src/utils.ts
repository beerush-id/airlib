import type { IRPCFile } from '@irpclib/irpc';
import type { FSConfig } from './context.js';
import { FSError } from './error.js';
import type { FSEntry, FSFile } from './index.js';

export function normalizePath(path: string, isDirectory: boolean = false): string {
  if (!path) return '/';
  let normalized = `/${path}`.replace(/\/+/g, '/');
  if (!isDirectory && normalized !== '/') {
    normalized = normalized.replace(/\/+$/, '');
  }
  return normalized;
}

export function resolvePath(config: FSConfig, path: string = ''): string {
  const isDir = path.endsWith('/') || path.endsWith('\\');
  const joined = `/${config.rootPath || ''}/${path}`;
  return normalizePath(joined, isDir);
}

export function stripPath(config: FSConfig, path: string): string {
  const root = normalizePath(config.rootPath || '', true);
  let p = normalizePath(path, path.endsWith('/') || path.endsWith('\\'));

  if (root !== '/' && p.startsWith(root)) {
    p = `/${p.substring(root.length)}`;
  } else if (root !== '/' && p === root.slice(0, -1)) {
    p = '/';
  }

  return p.replace(/\/+/g, '/');
}

export function mapFile<T extends FSEntry>(config: FSConfig, file: T): T {
  return {
    ...file,
    path: stripPath(config, file.path),
  };
}

export function enforceReadOnly(config: FSConfig) {
  if (config.readOnly) {
    throw FSError.notPermitted('write (read-only filesystem)');
  }
}

export function validateWrite(config: FSConfig, file: IRPCFile) {
  enforceReadOnly(config);

  if (config.maxFileSize && file.meta.size > config.maxFileSize) {
    throw FSError.tooLarge('write');
  }

  if (config.allowedTypes && config.allowedTypes.length > 0) {
    const type = file.meta.type || '';
    if (!config.allowedTypes.includes(type)) {
      throw FSError.notPermitted(`write (file type ${type} is not allowed)`);
    }
  }
}

export function getFileExt(path: string): string {
  const i = path.lastIndexOf('.');
  return i !== -1 ? path.substring(i + 1).toLowerCase() : 'file';
}

export function getMimeType(ext: string): string {
  const type = ext.toLowerCase();
  if (type.startsWith('.')) return getMimeType(type.substring(1));
  switch (type) {
    case 'txt':
      return 'text/plain';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'csv':
      return 'text/csv';
    case 'zip':
      return 'application/zip';
    case 'xml':
      return 'application/xml';
    case 'mp4':
      return 'video/mp4';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'webp':
      return 'image/webp';
    case 'webm':
      return 'video/webm';
    default:
      return 'application/octet-stream';
  }
}

export function getFileType(mime: string, fallback: string = 'file'): string {
  if (!mime || mime === 'application/octet-stream') return fallback;

  const slashIdx = mime.indexOf('/');
  if (slashIdx === -1) return fallback;

  let extIdx = mime.indexOf(';', slashIdx);
  if (extIdx === -1) extIdx = mime.length;

  const ext = mime
    .substring(slashIdx + 1, extIdx)
    .trim()
    .toLowerCase();

  switch (ext) {
    case 'plain':
      return 'txt';
    case 'jpeg':
      return 'jpg';
    case 'svg+xml':
      return 'svg';
    case 'javascript':
      return 'js';
    case 'mpeg':
      return 'mp3';
    default:
      return ext;
  }
}
