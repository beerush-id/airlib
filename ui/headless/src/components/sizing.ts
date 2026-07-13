export const SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
} as const;

export type Sizing = (typeof SIZES)[keyof typeof SIZES];
export type SizingLite = 'sm' | 'md' | 'lg';
export type SizeClassifier = {
  [key in Sizing]?: string;
} & {
  default?: string;
};
