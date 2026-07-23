import type { Sizing } from '@airlib/headless';

export type AvatarVariant = 'surface' | 'primary' | 'secondary' | 'tertiary' | 'error';
export type AvatarSize = Sizing;
export type AvatarShape = 'circle' | 'rounded';

export const AVATAR_CONFIGS = {
  class: 'air-avatar',
  imgClass: 'air-avatar-img',
  variant: {
    surface: 'air-avatar-surface',
    primary: 'air-avatar-primary',
    secondary: 'air-avatar-secondary',
    tertiary: 'air-avatar-tertiary',
    error: 'air-avatar-error',
  } as Record<AvatarVariant, string>,
  size: {
    xs: 'air-avatar-xs',
    sm: 'air-avatar-sm',
    md: 'air-avatar-md',
    lg: 'air-avatar-lg',
    xl: 'air-avatar-xl',
    xxl: 'air-avatar-xxl',
  } as Record<AvatarSize, string>,
  shape: {
    circle: 'air-avatar-circle',
    rounded: 'air-avatar-rounded',
  } as Record<AvatarShape, string>,
};
