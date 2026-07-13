import { createContext, derived } from '@anchorlib/core';
import { createSelectionState, selectionCtx, type AnyType } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { type Bindable, render, setup } from '@anchorlib/react';
import type { ComponentProps as ReactProps, ReactNode } from 'react';
import { Icon } from '../icon/index.js';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { COLLAPSIBLE_CONFIGS } from './config.js';

type CollapsibleItemContext = {
  expanded: boolean;
  toggle: () => void;
};

const itemCtx = createContext<CollapsibleItemContext>();

const OMITTED_KEYS = ['className', 'name', 'label', 'expanded', 'children'];

export type CollapsibleConfig = {
  groupClass: string;
  itemClass: string;
  triggerClass: string;
  contentClass: string;
  innerClass: string;
};

export function createCollapsible<T>(config: CollapsibleConfig = COLLAPSIBLE_CONFIGS, componentName = 'Collapsible') {
  type CollapsibleGroupProps = ReactProps<'div'> & {
    value?: Bindable<T>;
  };

  type CollapsibleItemProps = Omit<ElementProps<'div'>, 'value'> & {
    name: T;
    label?: ReactNode;
    expanded?: Bindable<boolean>;
  };

  type CollapsibleTriggerProps = ElementProps<'button'>;
  type CollapsibleContentProps = ElementProps<'div'>;

  const Group = setup<CollapsibleGroupProps>((props) => {
    const restProps = props.$omit(['children', 'className', 'value']);

    if ('value' in props) {
      createSelectionState(props);
    }

    return render(
      () => (
        <div {...restProps} className={classx([config.groupClass, props.className])}>
          {props.children}
        </div>
      ),
      `${componentName}Group`
    );
  }, `${componentName}Group`);

  const Item = setup<CollapsibleItemProps>((props) => {
    const $props = props as AnyType;
    const restProps = props.$omit(OMITTED_KEYS as never);
    const selection = selectionCtx.get();

    const expanded = derived(() => {
      if (selection && 'select' in selection) {
        return selection.value === $props.name;
      }
      return $props.expanded ?? false;
    });

    const toggle = () => {
      if (selection && 'select' in selection) {
        selection.select(selection.value === $props.name ? (undefined as never) : $props.name);
      } else {
        $props.expanded = !expanded.value;
      }
    };

    itemCtx.set({
      get expanded() {
        return expanded.value;
      },
      toggle,
    });

    return render(() => {
      if ($props.label !== undefined) {
        return (
          <div {...restProps} className={classx([config.itemClass, $props.className])}>
            <button type="button" className={config.triggerClass} aria-expanded={expanded.value} onClick={toggle}>
              <span className="flex-1 text-left">{renderDynamic($props.label)}</span>
              <Icon
                name="expand_more"
                className="transition-transform duration-200 text-on-surface-variant"
                style={{ transform: expanded.value ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            <div className={config.contentClass} data-state={expanded.value ? 'open' : 'closed'}>
              <div className={config.innerClass}>{renderDynamic($props.children)}</div>
            </div>
          </div>
        );
      }

      return (
        <div {...restProps} className={classx([config.itemClass, $props.className])}>
          {renderDynamic($props.children)}
        </div>
      );
    }, `${componentName}Item`);
  }, `${componentName}Item`);

  const Trigger = setup<CollapsibleTriggerProps>((props) => {
    const restProps = props.$omit(['children', 'className', 'onClick', 'type']);
    const item = itemCtx.get();

    const onClick = (e: any) => {
      item?.toggle();
      props.onClick?.(e);
    };

    return render(
      () => (
        <button
          {...restProps}
          type={props.type ?? 'button'}
          aria-expanded={item?.expanded}
          onClick={onClick}
          className={classx([config.triggerClass, props.className])}
        >
          {renderDynamic(props.children)}
        </button>
      ),
      `${componentName}Trigger`
    );
  }, `${componentName}Trigger`);

  const Content = setup<CollapsibleContentProps>((props) => {
    const restProps = props.$omit(['children', 'className']);
    const item = itemCtx.get();

    return render(
      () => (
        <div
          {...restProps}
          data-state={item?.expanded ? 'open' : 'closed'}
          className={classx([config.contentClass, props.className])}
        >
          <div className={config.innerClass}>{renderDynamic(props.children)}</div>
        </div>
      ),
      `${componentName}Content`
    );
  }, `${componentName}Content`);

  return Object.assign(Group, { Item, Trigger, Content });
}

export const CollapsibleGroup = createCollapsible<string | number | boolean | undefined>(
  COLLAPSIBLE_CONFIGS,
  'Collapsible'
);
export const Collapsible = CollapsibleGroup.Item;
export const CollapsibleTrigger = CollapsibleGroup.Trigger;
export const CollapsibleContent = CollapsibleGroup.Content;
