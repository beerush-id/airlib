export type ClassName = string | number | boolean | null | undefined;
export type ClassMaps = {
  [key: string]: ClassName | ClassMaps | ClassList;
};
export type ClassList = Array<ClassName | ClassMaps | ClassList>;
export type ClassInput = ClassName | ClassMaps | ClassList;
export type ClassProvider = () => ClassInput;

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
