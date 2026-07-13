import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { LIST_CONFIGS, type ListItemVariant, type ListVariant } from './config.js';

export type ListProps = ElementProps<'div'> & {
  variant?: ListVariant;
  segmented?: boolean;
  segemented?: boolean;
};

export type ListItemProps = ElementProps<'div'> & {
  variant?: ListItemVariant;
};

export const ListItemContent = template<ElementProps<'div'>>(
  ({ children, className, ...rest }) => (
    <div {...rest} className={classx([LIST_CONFIGS.contentClass, className])}>
      {renderDynamic(children)}
    </div>
  ),
  'ListItemContent'
);

export const ListItemSupportingText = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([LIST_CONFIGS.supportingTextClass, className])}>
      {renderDynamic(children)}
    </span>
  ),
  'ListItemSupportingText'
);

export const ListItem = template<ListItemProps>(
  ({ children, className, variant = 'surface', ...rest }) => (
    <div
      {...rest}
      role="menuitem"
      tabIndex={rest.tabIndex ?? 0}
      className={classx([LIST_CONFIGS.itemClass, LIST_CONFIGS.itemVariant[variant], className])}
    >
      {renderDynamic(children)}
    </div>
  ),
  'ListItem'
);

export const List = template<ListProps>(
  ({ children, className, variant = 'surface', segmented, segemented, ...rest }) => {
    const isSegmented = segmented ?? segemented ?? true;
    return (
      <div
        {...rest}
        className={classx([
          LIST_CONFIGS.groupClass,
          LIST_CONFIGS.variant[variant],
          isSegmented ? LIST_CONFIGS.segmentedClass : LIST_CONFIGS.contiguousClass,
          className,
        ])}
      >
        {renderDynamic(children)}
      </div>
    );
  },
  'List'
);
