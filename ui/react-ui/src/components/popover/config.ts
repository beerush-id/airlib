import { AXIS_POSITION } from '@airlib/headless/utils';

export const POPOVER_CONFIGS = {
  xPos: AXIS_POSITION.center,
  yPos: AXIS_POSITION.after,
  class: 'air-popover',
  cssPrefix: '--air-popover',
  attrPrefix: 'data',
  anchor: {
    class: 'air-popover-anchor',
  },
  content: {
    class: 'air-popover-content',
  },
};
