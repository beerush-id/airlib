import { classx } from '@airlib/uikit/utils';
import { type Bindable, type ComponentProps, createContext, derived, render, setup, template } from '@anchorlib/react';
import type { HTMLAttributes, InputEventHandler, MouseEventHandler } from 'react';
import { type ElementProps, renderChild } from '../supporting.js';
import { TOOLBAR_CONFIGS } from './config.js';

export type ToolbarProps = ElementProps<'div'> & {
  variant?: 'surface' | 'outlined';
};

export const Toolbar = template<ToolbarProps>(({ children, className, variant = 'surface', ...rest }) => {
  const baseClass = variant === 'outlined' ? TOOLBAR_CONFIGS.outlinedClass : TOOLBAR_CONFIGS.class;
  return (
    <div {...rest} role="toolbar" className={classx([baseClass, className])}>
      {renderChild(children)}
    </div>
  );
}, 'Toolbar');

export const ToolbarSeparator = template<HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }) => (
    <div {...rest} role="separator" className={classx([TOOLBAR_CONFIGS.separatorClass, className])} />
  ),
  'ToolbarSeparator'
);

export const ToolbarGroup = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} role="group" className={classx([TOOLBAR_CONFIGS.groupClass, className])}>
      {renderChild(children)}
    </div>
  ),
  'ToolbarGroup'
);

export const ToolbarGroupLabel = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([TOOLBAR_CONFIGS.groupLabelClass, className])}>
      {renderChild(children)}
    </span>
  ),
  'ToolbarGroupLabel'
);

export const ToolbarGroupContent = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([TOOLBAR_CONFIGS.groupContentClass, className])}>
      {renderChild(children)}
    </div>
  ),
  'ToolbarGroupContent'
);

export const ToolGroup = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} role="group" className={classx([TOOLBAR_CONFIGS.toolGroupClass, className])}>
      {renderChild(children)}
    </div>
  ),
  'ToolGroup'
);

export type ToolButtonProps<T = string | number> = ElementProps<'button'> & {
  value?: T;
  active?: Bindable<boolean>;
};

export const ToolButton = setup<ToolButtonProps>((props) => {
  const toggle = toolToggleContext.get();
  const restProps = props.$omit(['active', 'onClick', 'value', 'type', 'className', 'children']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (toggle) {
      toggle.select(props.value);
    } else if ('active' in props) {
      props.active = !props.active;
    }

    props.onClick?.(e);
  };

  const active = derived(() => (toggle ? toggle.state.value === props.value : props.active));

  return render(
    () => (
      <button
        {...restProps}
        type={props.type ?? 'button'}
        aria-pressed={active.value}
        className={classx([TOOLBAR_CONFIGS.toolButtonClass, props.className])}
        onClick={handleClick}
      >
        {renderChild(props.children)}
      </button>
    ),
    'ToolButton'
  );
}, 'ToolButton');

export type ToolIconButtonProps<T = string | number> = Omit<ElementProps<'button'>, 'value'> & {
  value?: T;
  active?: Bindable<boolean>;
};

export const ToolIconButton = setup<ToolIconButtonProps>((props) => {
  const toggle = toolToggleContext.get();
  const restProps = props.$omit(['active', 'onClick', 'value', 'type', 'className', 'children']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (toggle) {
      toggle.select(props.value);
    } else if ('active' in props) {
      props.active = !props.active;
    }

    props.onClick?.(e);
  };

  const active = derived(() => (toggle ? toggle.state.value === props.value : props.active));

  return render(
    () => (
      <button
        {...restProps}
        type={props.type ?? 'button'}
        aria-pressed={active.value}
        className={classx([TOOLBAR_CONFIGS.toolIconButtonClass, props.className])}
        onClick={handleClick}
      >
        {renderChild(props.children)}
      </button>
    ),
    'ToolIconButton'
  );
}, 'ToolIconButton');

export type ToolInputProps = Omit<ElementProps<'input'>, 'value' | 'children'> & {
  value?: Bindable<string | number>;
};

export const ToolInput = template<ToolInputProps>((props) => {
  const { className, type = 'text', onInput, ...rest } = props;

  const handleInput: InputEventHandler<HTMLInputElement> = (e) => {
    props.value = e.currentTarget.value;
    onInput?.(e);
  };

  return (
    <input
      {...rest}
      type={type}
      value={props.value}
      onInput={handleInput}
      className={classx([TOOLBAR_CONFIGS.toolInputClass, className])}
    />
  );
}, 'ToolInput');

export const ToolFieldInput = template<ToolInputProps>((props) => {
  const { type = 'text', onInput, ...rest } = props;

  const handleInput: InputEventHandler<HTMLInputElement> = (e) => {
    props.value = e.currentTarget.value;
    onInput?.(e);
  };

  return <input {...rest} type={type} value={props.value} onInput={handleInput} />;
}, 'ToolFieldInput');

export const ToolField = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([TOOLBAR_CONFIGS.toolFieldClass, className])}>
      {renderChild(children)}
    </div>
  ),
  'ToolField'
);

export const ToolIcon = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} aria-hidden="true" className={classx([TOOLBAR_CONFIGS.toolIconClass, className])}>
      {renderChild(children)}
    </span>
  ),
  'ToolIcon'
);

/* Behavioral Component Pattern (setup) for coordinated tool groups */
export type ToolToggleGroupProps<T = string | number> = Omit<ElementProps<'div'>, 'value' | 'onChange'> & {
  value?: Bindable<T>;
  onChange?: (value?: T) => void;
};

type ToolToggleContext<T = string | number> = {
  state: ComponentProps<ToolToggleGroupProps>;
  select: (val?: T) => void;
};

export const toolToggleContext = createContext<ToolToggleContext>();

export const ToolToggleGroup = setup<ToolToggleGroupProps>((props) => {
  const restProps = props.$omit(['value', 'onChange', 'className', 'children']);

  toolToggleContext.set({
    state: props,
    select: (val) => {
      props.value = val;
      props.onChange?.(val);
    },
  });

  return render(
    () => (
      <div {...restProps} role="group" className={classx([TOOLBAR_CONFIGS.toolGroupClass, props.className])}>
        {renderChild(props.children)}
      </div>
    ),
    'ToolToggleGroup'
  );
}, 'ToolToggleGroup');

export function createToogleGroup<T = string | number>() {
  return {
    Group: ToolToggleGroup as ReturnType<typeof setup<ToolToggleGroupProps<T>>>,
    Button: ToolButton as ReturnType<typeof setup<ToolButtonProps<T>>>,
    IconButton: ToolIconButton as ReturnType<typeof setup<ToolIconButtonProps<T>>>,
  };
}
