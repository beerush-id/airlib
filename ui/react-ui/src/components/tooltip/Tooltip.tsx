import { popover, type PopoverInit } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { isFunction, isObject } from '@anchorlib/core';
import { render, setup } from '@anchorlib/react';
import type { ComponentProps, ReactNode } from 'react';
import { TOOLTIP_CONFIGS } from './config.js';
import { renderDynamic, type ElementProps } from '../renderer.ts';

export interface TooltipProps extends Pick<PopoverInit, 'xPos' | 'yPos'>, ElementProps<'div'> {
  rich?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Tooltip = setup<TooltipProps>((props) => {
  const options = props.$pick(['xPos', 'yPos']);
  const state = popover({
    xPos: TOOLTIP_CONFIGS.xPos,
    yPos: TOOLTIP_CONFIGS.yPos,
    focus: false,
    passive: true,
    portal: TOOLTIP_CONFIGS.portal,
    cssPrefix: TOOLTIP_CONFIGS.cssPrefix,
    attrPrefix: TOOLTIP_CONFIGS.attrPrefix,
    interaction: TOOLTIP_CONFIGS.interaction,
    ...options,
  });

  const ref = (el: HTMLDivElement) => {
    if (isFunction(props.ref)) props.ref(el);
    if (isObject(props.ref)) props.ref.current = el;

    state.anchor = el?.parentElement as HTMLDivElement;
    state.element = el as HTMLDivElement;
  };

  return render(
    () => (
      <div
        ref={ref}
        role="tooltip"
        className={classx([props.rich ? TOOLTIP_CONFIGS.richClass : TOOLTIP_CONFIGS.class, props.className])}
      >
        {renderDynamic(props.children)}
      </div>
    ),
    'Tooltip'
  );
}, 'Tooltip');
