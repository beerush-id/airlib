import type { ColorClassifier } from '@airlib/headless/components';

export const BADGE_VARIANTS: ColorClassifier = {
  default: 'air-badge',
  error: 'air-badge',
  primary: 'air-badge-primary',
  secondary: 'air-badge-secondary',
  surface: 'air-badge-surface',
  tertiary: 'air-badge-tertiary',
};

export const BADGE_CONFIGS = {
  containerClass: 'air-badge-container',
  badgeClass: 'air-badge',
  dotClass: 'air-badge-dot',
  variant: BADGE_VARIANTS,
};
