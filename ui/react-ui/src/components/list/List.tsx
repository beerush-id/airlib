import { classx } from '@airlib/headless/utils';
import { template } from '@anchorlib/react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { LIST_CONFIGS, type ListItemVariant, type ListVariant } from './config.js';

export type ListProps = ElementProps<'div'> & {
  variant?: ListVariant;
  segmented?: boolean;
};

export type ListItemProps = ElementProps<'div'> & {
  variant?: ListItemVariant;
};

export type ListButtonProps = ElementProps<'button'> & {
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

export const ListTitle = template<ElementProps<'h4'>>(
  ({ children, className, ...rest }) => (
    <h4 {...rest} className={classx([LIST_CONFIGS.titleClass, className])}>
      {renderDynamic(children)}
    </h4>
  ),
  'ListTitle'
);

export const ListSubtitle = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([LIST_CONFIGS.subtitleClass, className])}>
      {renderDynamic(children)}
    </span>
  ),
  'ListSubtitle'
);

export const ListItem = template<ListItemProps>(
  ({ children, className, variant = 'surface', ...rest }) => (
    <div {...rest} className={classx([LIST_CONFIGS.itemClass, LIST_CONFIGS.itemVariant[variant], className])}>
      {renderDynamic(children)}
    </div>
  ),
  'ListItem'
);

export const ListButton = template<ListButtonProps>(
  ({ children, className, variant = 'surface', ...rest }) => (
    <button
      {...rest}
      role="menuitem"
      tabIndex={rest.tabIndex ?? 0}
      className={classx([
        LIST_CONFIGS.itemClass,
        LIST_CONFIGS.buttonClass,
        LIST_CONFIGS.itemVariant[variant],
        className,
      ])}
    >
      {renderDynamic(children)}
    </button>
  ),
  'ListButton'
);

export const List = template<ListProps>(
  ({ children, className, variant = 'surface', segmented, ...rest }) => (
    <div
      {...rest}
      className={classx([
        LIST_CONFIGS.groupClass,
        LIST_CONFIGS.variant[variant],
        segmented ? LIST_CONFIGS.segmentedClass : LIST_CONFIGS.contiguousClass,
        className,
      ])}
    >
      {renderDynamic(children)}
    </div>
  ),
  'List'
);
