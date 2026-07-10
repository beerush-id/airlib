export type CSSProperties = {
  [K in keyof CSSStyleDeclaration]?: string | number;
};
export type StyleInput = CSSProperties & Record<`--${string}`, string | number>;
export type StyleProvider = () => StyleInput;

/**
 * Normalizes CSS style objects and CSS custom properties by filtering empty values and appending
 * pixel units to numeric dimensions where applicable.
 *
 * @param value - Style input object or provider function returning styles.
 * @returns Sanitized style object ready for DOM application.
 */
export function stylex(value: StyleInput | StyleProvider) {
  const resolved = typeof value === 'function' ? value() : value;
  const result: StyleInput = {};
  for (const [k, v] of Object.entries(resolved)) {
    if (v !== undefined && v !== null) {
      (result as Record<string, string | number>)[k] = convert(k, v as string | number);
    }
  }
  return result;
}

// CSS properties that accept unitless numbers
const UNITLESS = new Set([
  'animationIterationCount',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'fillOpacity',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'fontWeight',
  'gridColumn',
  'gridRow',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'stopOpacity',
  'strokeDashoffset',
  'strokeOpacity',
  'strokeWidth',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
]);

function convert(key: string, value: string | number): string | number {
  if (typeof value === 'number' && value !== 0 && !UNITLESS.has(key)) {
    return `${value}px`;
  }
  return value;
}
