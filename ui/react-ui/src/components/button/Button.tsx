import {
  buttonState,
  type ColorVariant,
  createSelectionState,
  type Sizing,
  type SizingLite,
  type Variant,
} from '@airlib/headless';
import { type Bindable, classx, render, setup, template } from '@airlib/react';
import type { ComponentProps, MouseEventHandler } from 'react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { BUTTON_CONFIGS, FAB_SIZES, FAB_VARIANTS } from './config.js';

const OMITTED_KEYS = ['type', 'aria-pressed', 'active', 'className', 'onClick', 'value'];

export function createButton<T>() {
  type ButtonGroupProps = ComponentProps<'div'> & {
    value?: Bindable<T>;
  };

  type ButtonProps = Omit<ElementProps<'button'>, 'value'> & {
    size?: Sizing;
    value?: Bindable<T>;
    active?: Bindable<boolean>;
    variant?: Variant;
    color?: ColorVariant;
  };

  type IconButtonProps = Omit<ButtonProps, 'variant'> & {
    variant?: 'tonal' | 'outlined' | 'filled';
  };

  const Group = setup<ButtonGroupProps>((props) => {
    const restProps = props.$omit(['children', 'className', 'value']);

    if ('value' in props) {
      createSelectionState(props);
    }

    return render(
      () => (
        <div {...restProps} className={classx([BUTTON_CONFIGS.groupClass, props.className])}>
          {props.children}
        </div>
      ),
      'ButtonGroup'
    );
  }, 'ButtonGroup');

  const Button = setup<ButtonProps>((props) => {
    const button = buttonState<string | number, MouseEventHandler<HTMLButtonElement>>(props as never, BUTTON_CONFIGS);
    const restProps = props.$omit(OMITTED_KEYS as never);

    return render(
      () => (
        <button
          {...restProps}
          type={props.type ?? 'button'}
          aria-pressed={button.active || undefined}
          className={button.className}
          onClick={button.onClick}
        >
          {renderDynamic(props.children)}
        </button>
      ),
      'Button'
    );
  }, 'Button');

  const IconButton = setup<IconButtonProps>((props) => {
    const button = buttonState<string | number, MouseEventHandler<HTMLButtonElement>>(
      props as never,
      BUTTON_CONFIGS.icon
    );
    const restProps = props.$omit(OMITTED_KEYS as never);

    return render(
      () => (
        <button
          {...restProps}
          type={props.type ?? 'button'}
          aria-pressed={button.active || undefined}
          className={button.className}
          onClick={button.onClick}
        >
          {renderDynamic(props.children)}
        </button>
      ),
      'IconButton'
    );
  }, 'IconButton');

  return Object.assign(Group, { Button, IconButton });
}

export const ButtonGroup = createButton<string | number | boolean | undefined>();
export const Button = ButtonGroup.Button;
export const IconButton = ButtonGroup.IconButton;

export type FabProps = ElementProps<'button'> & {
  size?: SizingLite;
  variant?: 'primary' | 'surface' | 'secondary' | 'tertiary';
  extended?: boolean;
};

export const Fab = template<FabProps>(({ children, size, className, variant, extended, type = 'button', ...rest }) => {
  const baseClass = FAB_VARIANTS[variant ?? 'primary'];
  const sizeClass = FAB_SIZES[size!];
  const fabClasses = classx([baseClass, extended ? FAB_VARIANTS.extended : '', sizeClass, className]);

  return (
    <button {...rest} type={type} className={fabClasses}>
      {renderDynamic(children)}
    </button>
  );
}, 'Fab');
