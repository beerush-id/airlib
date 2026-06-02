import type { ZodType } from 'zod';

export function getSchemaByPath(schema: ZodType, path: string): ZodType | undefined {
  if (!path || path === 'root') return schema;

  const keys = path.split('.');
  let current: any = schema;

  const unwrap = (node: any) => {
    let unwrapped = false;
    while (node && !unwrapped) {
      if (node.shape || node.element) {
        unwrapped = true;
      } else if (typeof node.unwrap === 'function') {
        node = node.unwrap();
      } else if (typeof node.removeDefault === 'function') {
        node = node.removeDefault();
      } else if (typeof node.innerType === 'function') {
        node = node.innerType();
      } else if (node.in) {
        node = node.in; // Zod 4 Pipe input schema
      } else {
        unwrapped = true;
      }
    }
    return node;
  };

  for (const key of keys) {
    current = unwrap(current);
    if (!current) return undefined;

    if (current.shape) {
      const shape = typeof current.shape === 'function' ? current.shape() : current.shape;
      current = shape ? shape[key] : undefined;
      continue;
    }

    if (current.element) {
      if (key === '$' || /^\d+$/.test(key)) {
        current = current.element;
        continue;
      }
    }

    return undefined;
  }

  return unwrap(current);
}
