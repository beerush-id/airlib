import { arrowRef, popover, type PopoverInit, type PopoverInstance } from '@airlib/uikit';
import { classx } from '@airlib/uikit/utils';
import { derived, effect } from '@anchorlib/core';
import { type Bindable, createContext, render, setup } from '@anchorlib/react';
import type { ComponentProps, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { teleport } from '../../lib/index.js';
import { MENU_CONFIGS } from './config.js';

const menuContext = createContext<PopoverInstance>();

export interface MenuProps extends Pick<PopoverInit, 'xPos' | 'yPos'> {
  open?: Bindable<boolean>;
  children?: ReactNode;
}

export type MenuTriggerProps = ComponentProps<'button'>;
export type MenuContentProps = ComponentProps<'div'>;

export const Menu = setup<MenuProps>((props) => {
  const init = props.$pick(['xPos', 'yPos']);
  const menu = popover({
    xPos: MENU_CONFIGS.xPos,
    yPos: MENU_CONFIGS.yPos,
    focus: true,
    escape: true,
    cssPrefix: '--air-menu',
    attrPrefix: 'data',
    interaction: ['click'],
    ...init,
  });

  effect(() => {
    menu.open = props.open!;
  });
  effect(() => {
    props.open = menu.open;
  });

  menuContext.set(menu);

  return render(() => {
    return <>{props.children}</>;
  }, 'Menu');
}, 'Menu');

export const SubMenu = setup<MenuProps>((props) => {
  const init = props.$pick(['xPos', 'yPos']);
  const menu = popover({
    xPos: MENU_CONFIGS.child.xPos,
    yPos: MENU_CONFIGS.child.yPos,
    focus: true,
    escape: true,
    cssPrefix: '--air-menu',
    attrPrefix: 'data',
    interaction: ['hover', 'focus'],
    ...init,
  });

  // menu.parent = menuContext.get();
  // menuContext.set(menu);

  return render(() => {
    return <div className={MENU_CONFIGS.child.class}>{props.children}</div>;
  }, 'SubMenu');
}, 'SubMenu');

export const MenuButton = setup<MenuTriggerProps>((props) => {
  const menu = menuContext.get();

  if (!menu) {
    return <div className="air-error">[Error: MenuButton rendered outside of Menu component]</div>;
  }

  const restProps = props.$omit(['children', 'className']);

  const assignRef = (el: HTMLButtonElement | null) => {
    menu.anchor = el as HTMLButtonElement;
  };

  return render(() => {
    return (
      <button
        {...restProps}
        ref={assignRef}
        aria-haspopup="menu"
        aria-expanded={menu?.open}
        className={classx([MENU_CONFIGS.trigger.class, props.className])}
      >
        {props.children}
      </button>
    );
  }, 'MenuButton');
}, 'MenuButton');

export const MenuContent = setup<MenuContentProps>((props) => {
  const menu = menuContext.get();

  if (!menu) {
    return <div className="air-error">[Error: MenuContent rendered outside of Menu component]</div>;
  }

  const restProps = props.$omit(['children', 'className']);
  const keyboard = arrowRef<HTMLDivElement>({ direction: 'vertical', focusable: '.air-menu-item' });

  const assignRef = (el: HTMLDivElement | null) => {
    menu.element = el as HTMLDivElement;
    keyboard.current = el as HTMLDivElement;
  };

  const content = derived(() => (
    <div
      {...restProps}
      ref={assignRef}
      role="menu"
      tabIndex={-1}
      className={classx([MENU_CONFIGS.class, props.className])}
    >
      {props.children}
    </div>
  ));

  return render(() => {
    if (!menu.open) return content.value;
    return teleport(content.value, MENU_CONFIGS.portal);
  }, 'MenuContent');
}, 'MenuContent');

export interface MenuItemProps extends HTMLAttributes<HTMLButtonElement> {}

export const MenuItem = setup<MenuItemProps>((props) => {
  const menu = menuContext.get();

  if (!menu) {
    return <div className="air-error">[Error: MenuItem rendered outside of Menu component]</div>;
  }

  const restProps = props.$omit(['children', 'onClick']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    menu.open = false;
    props.onClick?.(e);
  };

  const assignRef = (el: HTMLButtonElement | null) => {
    // menu.anchor = el as HTMLButtonElement;
  };

  return render(
    () => (
      <button
        {...restProps}
        ref={assignRef}
        role="menuitem"
        className={classx([MENU_CONFIGS.item.class, props.className])}
        onClick={handleClick}
      >
        {props.children}
      </button>
    ),
    'MenuItem'
  );
}, 'MenuItem');
