import { AXIS_POSITION } from '@airlib/headless/utils';

export const MENU_CONFIGS = {
  xPos: AXIS_POSITION.start,
  yPos: AXIS_POSITION.after,
  class: 'air-menu',
  child: {
    class: 'air-menu-child',
    xPos: AXIS_POSITION.after,
    yPos: AXIS_POSITION.start,
  },
  item: {
    class: 'air-menu-item',
    activeClass: 'air-menu-item-active',
  },
  portal: 'body',
  trigger: {
    class: 'air-menu-trigger',
  },
};
