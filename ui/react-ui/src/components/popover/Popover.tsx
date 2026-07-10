import { popover as createPopover, type PopoverInit, type PopoverInstance } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { isFunction, isObject } from '@anchorlib/core';
import { render, setup } from '@anchorlib/react';
import type { ComponentProps } from 'react';
import { POPOVER_CONFIGS } from './config.js';

export type PopoverAnchorProps = ComponentProps<'button'> & {
  state: PopoverInstance;
};
export type PopoverProps = ComponentProps<'div'> & {
  state: PopoverInstance;
};

export function popover(init?: PopoverInit) {
  const state = createPopover({
    xPos: POPOVER_CONFIGS.xPos,
    yPos: POPOVER_CONFIGS.yPos,
    cssPrefix: POPOVER_CONFIGS.cssPrefix,
    attrPrefix: POPOVER_CONFIGS.attrPrefix,
    interaction: ['click'],
    ...init,
  });

  const Anchor = setup<PopoverAnchorProps>((props) => {
    const restProps = props.$omit(['children', 'className', 'ref']);
    const ref = (el: HTMLButtonElement | null) => {
      if (isFunction(props.ref)) props.ref(el);
      if (isObject(props.ref)) props.ref.current = el;
      state.anchor = el!;
    };

    return render(
      () => (
        <button {...restProps} ref={ref} className={classx([POPOVER_CONFIGS.anchor.class, props.className])}>
          {props.children}
        </button>
      ),
      'PopoverAnchor'
    );
  }, 'PopoverAnchor');

  const Popover = setup<PopoverProps>((props) => {
    const restProps = props.$omit(['children', 'className', 'ref']);
    const ref = (el: HTMLDivElement | null) => {
      if (isFunction(props.ref)) props.ref(el);
      if (isObject(props.ref)) props.ref.current = el;
      state.element = el!;
    };

    return render(
      () => (
        <div {...restProps} ref={ref} role="tooltip" className={classx([POPOVER_CONFIGS.class, props.className])}>
          {props.children}
        </div>
      ),
      'Popover'
    );
  }, 'Popover');

  return { state, Anchor, Popover };
}
