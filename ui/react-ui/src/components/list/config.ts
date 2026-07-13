export type ListVariant = 'surface' | 'filled';
export type ListItemVariant = 'surface' | 'filled';

export const LIST_CONFIGS = {
  groupClass: 'air-list-view',
  variant: {
    surface: '',
    filled: 'air-list-view-filled',
  } as Record<ListVariant, string>,
  segmentedClass: 'air-list-view-segmented',
  contiguousClass: 'air-list-view-contiguous',
  itemClass: 'air-list-view-item',
  itemVariant: {
    surface: 'air-list-view-item-surface',
    filled: 'air-list-view-item-filled',
  } as Record<ListItemVariant, string>,
  contentClass: 'air-list-view-item-content',
  supportingTextClass: 'air-list-view-item-supporting-text',
};
