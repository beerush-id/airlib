export const VARIANTS = {
  text: 'text',
  tonal: 'tonal',
  filled: 'filled',
  elevated: 'elevated',
  outlined: 'outlined',
} as const;

export type Variant = (typeof VARIANTS)[keyof typeof VARIANTS];

export type VariantClassifier = {
  [key in Variant]?: string;
} & {
  default?: string;
};

export const COLOR_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  error: 'error',
  surface: 'surface',
} as const;

export type ColorVariant = (typeof COLOR_VARIANTS)[keyof typeof COLOR_VARIANTS];

export type ColorClassifier = {
  [key in ColorVariant]?: string;
} & {
  default?: string;
};
