import type { IRPCFile, IRPCMeta } from '@irpclib/irpc';
import { FS_FILE_TYPES, FS_MIME_ALIAS, FS_MIME_TYPES } from './constant.js';
import { type FSConfig, getFSConfig } from './context.js';
import { FSError } from './error.js';
import type { FSMeta } from './index.js';
import type { AnyType } from './types.js';

export function join(...segments: unknown[]): string {
  const parts: string[] = [];
  for (const seg of segments) {
    if (typeof seg !== 'string' || !seg) continue;
    for (const p of seg.split('/')) {
      if (!p || p === '.') continue;
      if (p === '..') {
        if (parts.length) parts.pop();
        continue;
      }
      parts.push(p);
    }
  }
  return `/${parts.join('/')}`;
}

export function normalizePath(path: string, isDirectory: boolean = false): string {
  if (!path) return '/';
  const parts: string[] = [];
  for (const p of path.split('/')) {
    if (!p || p === '.') continue;
    if (p === '..') {
      if (parts.length) parts.pop();
      continue;
    }
    parts.push(p);
  }
  const result = `/${parts.join('/')}`;
  if (isDirectory && result !== '/') return `${result}/`;
  return result;
}

export function resolveRequest(
  config: FSConfig,
  meta: IRPCMeta,
  path: string,
  isDirectory: boolean
): { path: string; meta: FSMeta } {
  const p = normalizePath(path, isDirectory);
  const prefix = join(config.rootPath || '', config.pathPrefix || 'raw');
  const fm: FSMeta = { ...meta, prefix };
  if (config.thumbnailPrefix) fm.thumbnailPrefix = join(config.rootPath || '', config.thumbnailPrefix);
  return { path: p, meta: fm };
}

export function resolveWriteAccess(): FSConfig {
  const config = getFSConfig();
  if (config.readOnly) {
    throw FSError.notPermitted('write');
  }
  return config;
}

export function resolveWriteLimit(file: IRPCFile): FSConfig {
  const config = resolveWriteAccess();
  if (config.maxFileSize != null && file.meta.size > config.maxFileSize) {
    throw FSError.tooLarge('write');
  }
  if (config.allowedTypes != null && config.allowedTypes.length > 0) {
    const type = file.meta.type || '';
    if (!config.allowedTypes.includes(type)) {
      throw FSError.notPermitted('write');
    }
  }
  return config;
}

export function getFileExt(path: string): string {
  return (path.match(/\.(\w+)$/) || ['', ''])[1].toLowerCase();
}

export function withExt(path: string, ext: string): string {
  return path.replace(/\.[^.]+$/, `.${ext}`);
}

export function normalizeType<T extends { type?: string; name?: string; meta?: { type?: string; name?: string } }>(
  file: T
): T {
  const input = file.type || file.meta?.type || '';

  if (!input) {
    delete file.type;
    if (file.meta) delete (file.meta as AnyType).type;
    return file;
  }

  const lower = input.toLowerCase();
  let normalized = '';

  if (FS_FILE_TYPES.has(lower)) {
    normalized = FS_FILE_TYPES.get(lower)!;
  } else {
    const slash = lower.indexOf('/');
    const raw = slash !== -1 ? lower.substring(slash + 1) : lower;

    if (FS_MIME_TYPES.has(raw)) {
      normalized = raw;
    } else {
      for (const [ext, alias] of FS_MIME_ALIAS.entries()) {
        if (alias === raw) {
          normalized = ext;
          break;
        }
      }
    }
  }

  if (!normalized) {
    delete file.type;
    if (file.meta) delete (file.meta as AnyType).type;
    return file;
  }

  if ('type' in file) file.type = normalized;
  if (file.meta && 'type' in file.meta) file.meta.type = normalized;

  return file;
}

export function getMimeType(input: string, fallback = 'application/octet-stream'): string {
  const ext = input.includes('.') ? (input.match(/\.(\w+)$/) || ['', ''])[1] : input;
  return FS_MIME_TYPES.get(ext.toLowerCase()) ?? fallback;
}

export function errorCode(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'code' in err && typeof (err as Record<string, unknown>).code === 'string') {
    return (err as Record<string, unknown>).code as string;
  }
  return undefined;
}
