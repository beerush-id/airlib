import { arrowRef, createTabState, getTab } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { type Bindable, effect, nodeRef, render, setup } from '@anchorlib/react';
import type { HTMLAttributes, MouseEventHandler } from 'react';
import { stylex } from '../../utils/index.js';
import { TAB_CONFIGS } from './config.js';

export type TabProps<T = string> = HTMLAttributes<HTMLDivElement> & {
  value?: Bindable<T>;
  deferred?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export type TabListProps = HTMLAttributes<HTMLDivElement>;

export type TabButtonProps<T = string> = HTMLAttributes<HTMLButtonElement> & {
  name: T;
  activeClass?: string;
};

export type TabContentProps<T = string> = HTMLAttributes<HTMLDivElement> & {
  name: T;
  activeClass?: string;
};

export type TabComponent<T> = ReturnType<typeof setup<TabProps<T>>> & {
  List: ReturnType<typeof setup<TabListProps>>;
  Button: ReturnType<typeof setup<TabButtonProps<T>>>;
  Content: ReturnType<typeof setup<TabContentProps<T>>>;
};

export function createTab<T = string>(): TabComponent<T> {
  const Tab = setup<TabProps<T>>((props) => {
    const tab = createTabState({ deferred: props.deferred, orientation: props.orientation });
    const restProps = props.$omit(['value', 'className', 'deferred', 'orientation']);

    effect(() => {
      tab.current = props.value;
    });

    effect(() => {
      props.value = tab.current as T;
    });

    return render(
      () => (
        <div {...restProps} className={props.className || TAB_CONFIGS.class}>
          {props.children}
        </div>
      ),
      'Tab'
    );
  }, 'Tab');

  const TabList = setup<TabListProps>((props) => {
    const restProps = props.$omit(['className']);

    const tab = getTab<T>();
    const ref = nodeRef<HTMLDivElement>((el) => {
      const { x: rx = 0, y: ry = 0 } = el?.getBoundingClientRect() ?? {};
      const { x = 0, y = 0, width, height } = tab?.triggerRect ?? {};

      return {
        className: props.className || TAB_CONFIGS.list.class,
        style: stylex({
          '--air-tab-item-x': x - rx,
          '--air-tab-item-y': y - ry,
          '--air-tab-item-width': width,
          '--air-tab-item-height': height,
        }),
      } as TabListProps;
    });
    const key = arrowRef({
      focusable: '[role="tab"]:not(:disabled)',
      direction: tab?.orientation,
    });

    const assignRef = (el: HTMLDivElement | null) => {
      ref.current = el!;
      key.current = el!;
    };

    return render(
      () => (
        <div
          {...restProps}
          {...ref.attributes}
          ref={assignRef}
          role="tablist"
          aria-orientation={tab?.orientation}
          className={props.className || TAB_CONFIGS.list.class}
        >
          <span className={TAB_CONFIGS.button.indicatorClass}></span>
          {props.children}
        </div>
      ),
      'TabList'
    );
  }, 'TabList');

  const TabButton = setup<TabButtonProps>((props) => {
    const tab = getTab<T>();
    const item = tab?.item(props.name as T);
    const restProps = props.$omit(['name', 'className', 'activeClass', 'onClick']);
    const ref = nodeRef<HTMLButtonElement>(
      () =>
        ({
          id: `${TAB_CONFIGS.prefix}-${props.name}`,
          tabIndex: item?.active ? 0 : -1,
          className: classx([
            props.className || TAB_CONFIGS.button.class,
            { [props.activeClass ?? TAB_CONFIGS.button.activeClass]: item?.active },
          ]),
          'aria-selected': item?.active,
          'aria-controls': `${TAB_CONFIGS.panelPrefix}-${props.name}`,
        }) as TabButtonProps
    );

    const activate: MouseEventHandler<HTMLButtonElement> = (e) => {
      item?.activate();
      props.onClick?.(e);
    };

    const assignRef = (el: HTMLButtonElement | null) => {
      if (!item || !el) return;

      ref.current = el;
      item.trigger = el;

      if (tab && item.active) {
        requestAnimationFrame(() => {
          item.activate();
        });
      }
    };

    return render(
      () => (
        <button {...restProps} {...ref.attributes} ref={assignRef} role="tab" onClick={activate}>
          {props.children}
        </button>
      ),
      'TabButton'
    );
  }, 'TabButton');

  const TabContent = setup<TabContentProps>((props) => {
    const tab = getTab<T>();
    const ref = nodeRef<HTMLDivElement>(
      () =>
        ({
          id: `${TAB_CONFIGS.panelPrefix}-${props.name}`,
          hidden: !tab?.options?.deferred && tab?.current !== props.name,
          className: classx([
            props.className || TAB_CONFIGS.content.class,
            { [props.activeClass ?? TAB_CONFIGS.content.activeClass]: tab?.current === props.name },
          ]),
          'aria-current': tab?.current === props.name,
          'aria-labelledby': `${TAB_CONFIGS.prefix}-${props.name}`,
        }) as TabContentProps
    );
    const restProps = props.$omit(['name', 'className', 'activeClass']);

    if (tab?.options?.deferred) {
      return render(() => {
        if (tab.current !== props.name) return null;
        return (
          <div {...restProps} {...ref.attributes} ref={ref} role="tabpanel">
            {props.children}
          </div>
        );
      }, 'TabContent');
    }

    return render(
      () => (
        <div {...restProps} {...ref.attributes} ref={ref} role="tabpanel">
          {props.children}
        </div>
      ),
      'TabContent'
    );
  }, 'TabContent');

  return Object.assign(Tab, { List: TabList, Button: TabButton, Content: TabContent }) as TabComponent<T>;
}

export const Tab = createTab();
export const TabList = Tab.List;
export const TabButton = Tab.Button;
export const TabContent = Tab.Content;
