import type { ZodError } from 'zod';
import type { AnyType } from './types.js';

export function flattenData(store: Record<string, AnyType>, data: AnyType, path = '') {
  if (data === undefined || data === null || typeof data !== 'object' || data instanceof Date) {
    if (path) {
      store[path] = data;
    }
    return;
  }

  const keys = Object.keys(data);
  if (keys.length === 0) {
    if (path) {
      store[path] = data;
    }
    return;
  }

  if (Array.isArray(data)) {
    if (path) store[path] = data;
    data.forEach((item, i) => flattenData(store, item, path ? `${path}.${i}` : `${i}`));
  } else {
    if (path) store[path] = data;
    for (const [key, value] of Object.entries(data)) {
      flattenData(store, value, path ? `${path}.${key}` : key);
    }
  }
}

export function unflattenData(flatData: Record<string, AnyType>): AnyType {
  const result: AnyType = {};
  const keys = Object.keys(flatData);

  if (keys.length === 0) {
    return result;
  }

  for (const path of keys) {
    const value = flatData[path];

    if (path === 'root' || !path) {
      return value;
    }

    const segments = path.split('.');
    let current = result;

    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      const nextKey = segments[i + 1];

      if (current[key] === undefined) {
        current[key] = /^\d+$/.test(nextKey) ? [] : {};
      }
      current = current[key];
    }

    current[segments[segments.length - 1]] = value;
  }

  return result;
}

export function flattenError(store: Record<string, string[]>, error: ZodError) {
  const issues = error.issues;

  for (const issue of issues) {
    const path = issue.path.join('.');
    const existing = store[path];

    if (existing) {
      existing.push(issue.message);
    } else {
      store[path] = [issue.message];
    }
  }
}
