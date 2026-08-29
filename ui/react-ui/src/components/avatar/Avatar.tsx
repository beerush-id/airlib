import { classx, effect, mutable, render, setup } from '@airlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { AVATAR_CONFIGS, type AvatarShape, type AvatarSize, type AvatarVariant } from './config.js';

export type AvatarProps = ElementProps<'div'> & {
  variant?: AvatarVariant;
  size?: AvatarSize;
  shape?: AvatarShape;
  src?: string;
  alt?: string;
};

export const Avatar = setup<AvatarProps>((props) => {
  const rest = props.$omit(['children', 'className', 'variant', 'size', 'shape', 'src', 'alt']);
  const state = mutable({ error: false });

  effect.client(() => {
    props.src;
    state.error = false;
  });

  const content = () => {
    if (props.children) return renderDynamic(props.children);
    if (props.src && !state.error) {
      return (
        <img
          src={props.src}
          alt={props.alt ?? ''}
          className={AVATAR_CONFIGS.imgClass}
          onError={() => {
            state.error = true;
          }}
        />
      );
    }
    return getAvatarAbbr(props.alt);
  };

  return render(() => {
    const { className, variant = 'surface', size = 'md', shape = 'circle' } = props;

    return (
      <div
        {...rest}
        className={classx([
          AVATAR_CONFIGS.class,
          AVATAR_CONFIGS.variant[variant],
          AVATAR_CONFIGS.size[size],
          AVATAR_CONFIGS.shape[shape],
          className,
        ])}
      >
        {content()}
      </div>
    );
  }, 'Avatar');
}, 'Avatar');

export function getAvatarAbbr(text?: string, max = 2): string {
  if (!text) return '';
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, max).toUpperCase();
  return parts
    .slice(0, max)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}
