import type { ZodError } from 'zod';
import type { AnyType } from './types.js';

export function flattenData(store: Map<string, AnyType>, data: AnyType, path = '') {
  if (data === undefined || data === null || typeof data !== 'object' || data instanceof Date) {
    if (path) {
      store.set(path, data);
    }
    return;
  }

  const keys = Object.keys(data);
  if (keys.length === 0) {
    if (path) {
      store.set(path, data);
    }
    return;
  }

  if (Array.isArray(data)) {
    if (path) store.set(path, data);
    data.forEach((item, i) => flattenData(store, item, path ? `${path}.${i}` : `${i}`));
  } else {
    if (path) store.set(path, data);
    for (const [key, value] of Object.entries(data)) {
      flattenData(store, value, path ? `${path}.${key}` : key);
    }
  }
}

export function unflattenData(flatData: Map<string, AnyType>): AnyType {
  const result: AnyType = {};

  if (flatData.size === 0) {
    return result;
  }

  for (const [path, value] of flatData.entries()) {
    if (path === 'root' || !path) {
      return value;
    }

    const keys = path.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const nextKey = keys[i + 1];

      if (current[key] === undefined) {
        current[key] = /^\d+$/.test(nextKey) ? [] : {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}

export function flattenError(store: Map<string, string[]>, error: ZodError) {
  const issues = error.issues;

  for (const issue of issues) {
    const path = issue.path.join('.');
    const existing = store.get(path);

    if (existing) {
      existing.push(issue.message);
    } else {
      store.set(path, [issue.message]);
    }
  }
}
