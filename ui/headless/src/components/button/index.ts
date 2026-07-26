import { derived } from '@anchorlib/core';
import { type ClassInput, classx } from '../../utils/index.js';
import { selectionCtx } from '../selection.js';
import type { SizeClassifier, Sizing } from '../sizing.js';
import type { ColorVariant, Variant, VariantClassifier } from '../variant.js';

export type ButtonInit<T, H> = {
  size?: Sizing;
  class?: ClassInput;
  value?: T;
  active?: boolean;
  variant?: Variant;
  color?: ColorVariant;
  className?: ClassInput;
  onClick?: H;
};

export type ButtonProps<H> = {
  active: boolean;
  onClick: H;
  className: string;
};

export type ButtonClassifier = {
  base?: string;
  size?: SizeClassifier;
  color?: Record<string, string>;
  variant?: VariantClassifier;
};

export function buttonState<T, H>(init: ButtonInit<T, H>, config?: ButtonClassifier) {
  const btnConfig = { ...config?.variant };
  const sizeConfig = { ...config?.size };
  const colorConfig = { ...config?.color };
  const selection = selectionCtx.get();

  const className = derived(() => {
    const { variant = 'default', color } = init;
    const baseClass = config?.base;
    const variantClass = btnConfig[variant];
    const colorClass = color ? colorConfig[color] : undefined;
    const sizeClass = sizeConfig[init.size!];

    return classx([baseClass, variantClass, colorClass, sizeClass, init.class, init.className]);
  });

  const active = derived(() => {
    if ('value' in init && selection) return selection.value === init.value;
    if ('active' in init) return init.active;
    return false;
  });

  const onClick = (e: MouseEvent) => {
    if ('value' in init && selection) {
      selection.select(init.value);
    } else if ('active' in init) {
      init.active = !init.active;
    }

    (init.onClick as typeof onClick)?.(e);
  };

  return {
    get active() {
      return active.value;
    },
    get className() {
      return className.value;
    },
    onClick,
  } as ButtonProps<H>;
}
