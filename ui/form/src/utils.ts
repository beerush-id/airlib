export function writePath(obj: any, path: string, value: any) {
  if (!obj) return;
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = isNaN(Number(parts[i + 1])) ? {} : [];
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}
