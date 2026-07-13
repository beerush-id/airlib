export type AvatarVariant = 'surface' | 'primary' | 'secondary' | 'tertiary' | 'error';
export type AvatarSize = 'sm' | 'md' | 'lg';
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
    sm: 'air-avatar-sm',
    md: 'air-avatar-md',
    lg: 'air-avatar-lg',
  } as Record<AvatarSize, string>,
  shape: {
    circle: 'air-avatar-circle',
    rounded: 'air-avatar-rounded',
  } as Record<AvatarShape, string>,
};
