import { POPOVER_INTERACTION } from '@airlib/uikit/components';
import { AXIS_POSITION } from '@airlib/uikit/utils';

export const TOOLTIP_CONFIGS = {
  xPos: AXIS_POSITION.center,
  yPos: AXIS_POSITION.after,
  class: 'air-tooltip-plain',
  richClass: 'air-tooltip-rich',
  cssPrefix: '--air-tooltip',
  attrPrefix: 'data',
  interaction: [POPOVER_INTERACTION.hover, POPOVER_INTERACTION.focus],
  portal: 'body',
};
