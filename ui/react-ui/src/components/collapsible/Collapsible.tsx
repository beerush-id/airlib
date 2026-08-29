import { type AnyType, createSelectionState, type SelectionContext, selectionCtx } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { createContext, derived } from '@airlib/core';
import { type Bindable, render, setup } from '@airlib/react';
import type { MouseEventHandler, ReactNode } from 'react';
import { ArrowDown } from '../../icons/ArrowDown.js';
import type { createIcon } from '../../icons/Icon.js';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { COLLAPSIBLE_CONFIGS } from './config.js';

type CollapsibleItemContext = {
  triggerId: string;
  contentId: string;
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

export function createCollapsible<T>(
  config: CollapsibleConfig = COLLAPSIBLE_CONFIGS,
  componentName = 'Collapsible',
  Icon: ReturnType<typeof createIcon> = ArrowDown
) {
  type CollapsibleGroupProps = Omit<ElementProps<'div', SelectionContext<T>>, 'value'> & {
    value?: Bindable<T>;
  };

  type CollapsibleItemProps = Omit<ElementProps<'div', CollapsibleItemContext>, 'value'> & {
    name: T;
    label?: ReactNode;
    expanded?: Bindable<boolean>;
  };

  type CollapsibleTriggerProps = ElementProps<'button', CollapsibleItemContext>;
  type CollapsibleContentProps = ElementProps<'div', CollapsibleItemContext>;

  const Group = setup<CollapsibleGroupProps>((props) => {
    const restProps = props.$omit(['children', 'className', 'value']);

    if ('value' in props) {
      createSelectionState(props);
    }

    const selection = selectionCtx.get();

    return render(
      () => (
        <div {...restProps} className={classx([config.groupClass, props.className])}>
          {renderDynamic(props.children, selection)}
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

    const id = $props.name ? String($props.name).replace(/\s+/g, '-') : Math.random().toString(36).slice(2, 9);
    const triggerId = `${componentName}Trigger-${id}`;
    const contentId = `${componentName}Content-${id}`;

    const ctx = {
      triggerId,
      contentId,
      get expanded() {
        return expanded.value;
      },
      toggle,
    };
    itemCtx.set(ctx);

    return render(() => {
      if ($props.label !== undefined) {
        return (
          <div {...restProps} className={classx([config.itemClass, $props.className])}>
            <button
              type="button"
              id={triggerId}
              className={config.triggerClass}
              aria-expanded={expanded.value}
              aria-controls={contentId}
              onClick={toggle}
            >
              <span className="flex-1 text-left">{renderDynamic($props.label, ctx)}</span>
              <Icon style={{ transform: expanded.value ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            <div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!expanded.value}
              className={config.contentClass}
            >
              <div className={config.innerClass}>{renderDynamic($props.children, ctx)}</div>
            </div>
          </div>
        );
      }

      return (
        <div {...restProps} className={classx([config.itemClass, $props.className])}>
          {renderDynamic($props.children, ctx)}
        </div>
      );
    }, `${componentName}Item`);
  }, `${componentName}Item`);

  const Trigger = setup<CollapsibleTriggerProps>((props) => {
    const restProps = props.$omit(['children', 'className', 'onClick', 'type']);
    const item = itemCtx.get();

    const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      item?.toggle();
      props.onClick?.(e);
    };

    return render(
      () => (
        <button
          {...restProps}
          type={props.type ?? 'button'}
          id={item?.triggerId}
          aria-expanded={item?.expanded}
          aria-controls={item?.contentId}
          onClick={onClick}
          className={classx([config.triggerClass, props.className])}
        >
          {renderDynamic(props.children, item)}
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
          id={item?.contentId}
          role="region"
          aria-labelledby={item?.triggerId}
          aria-hidden={!item?.expanded}
          className={config.contentClass}
        >
          <div className={classx([config.innerClass, props.className])}>{renderDynamic(props.children, item)}</div>
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
