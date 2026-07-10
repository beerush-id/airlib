import { arrowRef, popover, type PopoverInstance } from '@airlib/headless';
import type { PopoverInit } from '@airlib/headless/components';
import { classx, uIndex } from '@airlib/headless/utils';
import { derived, isFunction, isObject, mutable } from '@anchorlib/core';
import { type Bindable, type ComponentProps, createContext, effect, render, setup } from '@anchorlib/react';
import type { ComponentProps as ReactProps, MouseEventHandler, ReactNode } from 'react';
import { CheckIcon, DropDown } from '../../icons/index.js';
import { teleport } from '../../lib/index.js';
import { SELECT_CONFIGS } from './config.js';

export function createSelect<T = string>(init?: PopoverInit) {
  const uName = Symbol('select-id');

  type SelectProps = ReactProps<'div'> &
    Pick<PopoverInit, 'xPos' | 'yPos'> & {
      value?: Bindable<T>;
      values?: Bindable<T[]>;
      multiple?: boolean;
      placeholder?: string;
    };

  type SelectInternalProps = ComponentProps<SelectProps> & {
    text: string;
    values: T[];
  };

  type TriggerRenderer = (state: SelectInternalProps, ref: { current: HTMLButtonElement | null }) => ReactNode;

  type ButtonProps = Omit<ReactProps<'button'>, 'children' | 'value'> & {
    children?: ReactNode | ((state: { value: T; values: T[] }) => ReactNode);
  };

  type ItemProps = Omit<ReactProps<'button'>, 'value'> & {
    value: T;
  };

  type OptionProps = Omit<ReactProps<'button'>, 'value'> & {
    value: T;
  };

  type MenuProps = ReactProps<'div'>;

  type SelectContext = {
    state: SelectInternalProps;
    popup: PopoverInstance;
    selectId: string;
  };

  const context = createContext<SelectContext>();

  const Select = setup<SelectProps>((props) => {
    const restProps = props.$omit(['value', 'children', 'placeholder', 'multiple', 'values', 'text' as never]);
    const selectId = props.id ?? `air-select-${uIndex(uName)}`;
    if (!props.values) props.values = mutable([]);

    const popup = popover({
      xPos: SELECT_CONFIGS.xPos,
      yPos: SELECT_CONFIGS.yPos,
      focus: true,
      escape: true,
      cssPrefix: SELECT_CONFIGS.cssPrefix,
      attrPrefix: SELECT_CONFIGS.attrPrefix,
      interaction: ['click'],
      ...init,
    });

    context.set({ state: props, popup, selectId } as never);

    return render(
      () => (
        <div {...restProps} className={classx([SELECT_CONFIGS.class, props.className])}>
          {props.children}
        </div>
      ),
      'Select'
    );
  }, 'Select');

  const SelectButton = setup<ButtonProps>((props) => {
    const { state, popup, selectId } = context.get() ?? {};

    if (!state || !popup) {
      return <div className="air-error">[Error: Select button rendered outside of Select component]</div>;
    }

    const restProps = props.$omit(['children', 'className', 'ref']);
    const ref = (el: HTMLButtonElement | null) => {
      if (isFunction(props.ref)) props.ref(el);
      if (isObject(props.ref)) props.ref.current = el;
      popup.anchor = el as HTMLButtonElement;
    };

    const children = (): ReactNode => {
      if (!props.children) {
        if (state.multiple) {
          return (
            <>
              <span className={SELECT_CONFIGS.text.class}>{state.placeholder || 'Select'}</span>
              {state.values.length ? <span className={SELECT_CONFIGS.badge.class}>{state.values.length}</span> : ''}
            </>
          );
        }

        return <span className={SELECT_CONFIGS.text.class}>{state.text || state.placeholder || 'Select'}</span>;
      }

      if (isFunction(props.children)) {
        return props.children(state as never);
      }

      return props.children;
    };

    return render(() => {
      const content = children();

      return (
        <button
          {...restProps}
          ref={ref}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={popup.open}
          aria-controls={selectId}
          className={classx([SELECT_CONFIGS.button.class, props.className])}
        >
          {content}
          <DropDown />
        </button>
      );
    }, 'SelectButton');
  }, 'SelectButton');

  const SelectTrigger = setup<{ children: TriggerRenderer }>((props) => {
    const { state, popup } = context.get() ?? {};

    if (!state || !popup) {
      return <div className="air-error">[Error: Select item rendered outside of Select component]</div>;
    }

    const ref = {
      get current() {
        return popup?.anchor;
      },
      set current(value) {
        popup.anchor = value;
      },
    } as { current: HTMLButtonElement | null };

    return render(() => props.children(state, ref), 'SelectTrigger');
  }, 'SelectTrigger');

  const SelectItem = setup<ItemProps>((props) => {
    const $props = props as never as ItemProps;
    const { state, popup } = context.get() ?? {};
    const ref = mutable<{ current: HTMLButtonElement | null }>({ current: null });

    if (!state || !popup) {
      return <div className="air-error">[Error: Select item rendered outside of Select component]</div>;
    }

    const restProps = props.$omit(['value', 'children', 'onClick']);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      popup.open = false;
      state.value = $props.value;
      $props.onClick?.(e);
    };

    const selected = derived(() => {
      return state?.value === $props.value;
    });

    effect(() => {
      if (ref.current && selected.value) {
        state.text = ref.current.textContent;
      }
    });

    return render(
      () => (
        <button
          {...restProps}
          ref={ref}
          role="option"
          aria-selected={selected.value}
          className={classx([SELECT_CONFIGS.item.class, $props.className])}
          onClick={handleClick}
        >
          {$props.children}
        </button>
      ),
      'SelectItem'
    );
  }, 'SelectItem');

  const SelectOption = setup<OptionProps>((props) => {
    const $props = props as never as OptionProps;
    const { state, popup } = context.get() ?? {};

    if (!state || !popup) {
      return <div className="air-error">[Error: Select option rendered outside of Select component]</div>;
    }

    const restProps = props.$omit(['value', 'children', 'onClick']);

    const handleChange: MouseEventHandler<HTMLButtonElement> = (e) => {
      const index = state.values.indexOf($props.value);

      if (index > -1) {
        state.values.splice(index, 1);
      } else {
        state.values.push($props.value);
      }

      $props.onClick?.(e);
    };

    const checked = derived(() => {
      return state.values.includes($props.value);
    });

    return render(
      () => (
        <button
          {...restProps}
          role="option"
          aria-selected={checked.value}
          className={SELECT_CONFIGS.option.class}
          onClick={handleChange}
        >
          <div
            className={classx([
              SELECT_CONFIGS.checkbox.class,
              { [SELECT_CONFIGS.checkbox.checkedClass]: checked.value },
            ])}
          >
            {checked.value ? <CheckIcon /> : null}
          </div>
          {$props.children}
        </button>
      ),
      'SelectOption'
    );
  }, 'SelectOption');

  const SelectMenu = setup<MenuProps>((props) => {
    const { state, popup, selectId } = context.get() ?? {};
    const keyboard = arrowRef<HTMLDivElement>({ direction: 'vertical', focusable: '[role="option"]' });

    if (!state || !popup) {
      return <div className="air-error">[Error: Select menu rendered outside of Select component]</div>;
    }

    const restProps = props.$omit(['children', 'className', 'ref']);

    const ref = (el: HTMLDivElement | null) => {
      if (isFunction(props.ref)) props.ref(el);
      if (isObject(props.ref)) props.ref.current = el;

      keyboard.current = el as HTMLDivElement;
      popup.element = el as HTMLDivElement;
    };

    const content = () => (
      <div
        {...restProps}
        id={selectId}
        ref={ref}
        role="listbox"
        className={classx([SELECT_CONFIGS.menu.class, props.className])}
      >
        {props.children}
      </div>
    );

    return render(() => {
      if (!popup.open) return content();
      return teleport(content(), SELECT_CONFIGS.portal);
    }, 'SelectPanel');
  }, 'SelectPanel');

  return Object.assign(Select, {
    get: () => context.get(),
    Menu: SelectMenu,
    Item: SelectItem,
    Button: SelectButton,
    Option: SelectOption,
    Trigger: SelectTrigger,
  });
}

const DefaultSelect = createSelect<string | number>();

export const Select = DefaultSelect;
export const SelectMenu = DefaultSelect.Menu;
export const SelectItem = DefaultSelect.Item;
export const SelectButton = DefaultSelect.Button;
export const SelectOption = DefaultSelect.Option;
export const SelectTrigger = DefaultSelect.Trigger;
