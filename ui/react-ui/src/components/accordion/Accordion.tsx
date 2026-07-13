import { createCollapsible, type CollapsibleConfig } from '../collapsible/Collapsible.js';
import { ACCORDION_CONFIGS } from './config.js';

export function createAccordion<T>(
  config: CollapsibleConfig = {
    groupClass: ACCORDION_CONFIGS.groupClass,
    itemClass: ACCORDION_CONFIGS.itemClass,
    triggerClass: ACCORDION_CONFIGS.headerClass,
    contentClass: ACCORDION_CONFIGS.contentClass,
    innerClass: ACCORDION_CONFIGS.innerClass,
  },
  componentName = 'Accordion'
) {
  return createCollapsible<T>(config, componentName);
}

export const AccordionGroup = createAccordion<string | number | boolean | undefined>();
export const Accordion = AccordionGroup.Item;
export const AccordionHeader = AccordionGroup.Trigger;
export const AccordionContent = AccordionGroup.Content;
