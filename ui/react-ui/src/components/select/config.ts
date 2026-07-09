import { AXIS_POSITION } from '@airlib/uikit/utils';

export const SELECT_CONFIGS = {
  xPos: AXIS_POSITION.start,
  yPos: AXIS_POSITION.after,
  class: 'air-select',
  cssPrefix: '--air-select',
  attrPrefix: 'data',
  portal: 'body',
  menu: {
    class: 'air-select-menu',
  },
  item: {
    class: 'air-select-item',
  },
  text: {
    class: 'air-select-text',
  },
  badge: {
    class: 'air-select-badge',
  },
  button: {
    class: 'air-select-button',
  },
  option: {
    class: 'air-select-item',
  },
  checkbox: {
    class: 'air-select-checkbox',
    iconClass: 'air-checkbox-icon',
    checkedClass: 'air-checkbox-checked',
  },
};
