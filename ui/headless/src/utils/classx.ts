export type ClassName = string | number | boolean | null | undefined;
export type ClassMaps = {
  [key: string]: ClassName | ClassMaps | ClassList;
};
export type ClassList = Array<ClassName | ClassMaps | ClassList>;
export type ClassInput = ClassName | ClassMaps | ClassList;
export type ClassProvider = () => ClassInput;

/**
 * Conditionally merges class names from strings, numbers, arrays, or objects into a single space-separated string.
 *
 * @param value - Class name inputs or a provider callback returning class inputs.
 * @returns Combined space-separated class name string.
 */
export function classx(value: ClassInput | ClassProvider) {
  return stringify(typeof value === 'function' ? value() : value);
}

function stringify(input: ClassInput): string {
  if (!input) return '';

  if (Array.isArray(input)) {
    return input.map(stringify).filter(Boolean).join(' ');
  }

  if (typeof input === 'object') {
    return Object.entries(input)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(' ');
  }

  return String(input);
}
