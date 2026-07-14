import { classx } from '@airlib/headless/utils';
import { derived, isFunction, untrack } from '@anchorlib/core';
import {
  $use,
  type Bindable,
  type ComponentProps,
  createContext,
  effect,
  For,
  nodeRef,
  render,
  setup,
  template,
} from '@anchorlib/react';
import type { ComponentProps as ReactProps, ReactNode } from 'react';
import { Checkbox } from '../../form/index.js';
import { DropDown } from '../../icons/index.js';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { Tooltip } from '../tooltip/index.js';
import { TABLE_CONFIGS } from './config.js';

export const TableHead = template<ElementProps<'thead'>>(
  ({ children, className, ...rest }) => (
    <thead {...rest} className={className}>
      {renderDynamic(children)}
    </thead>
  ),
  'TableHead'
);

export const TableHeader = template<ElementProps<'th'>>(
  ({ children, className, ...rest }) => (
    <th {...rest} className={classx([TABLE_CONFIGS.headerCellClass, className])}>
      {renderDynamic(children)}
    </th>
  ),
  'TableHeader'
);

export const TableCell = template<ElementProps<'td'>>(
  ({ children, className, ...rest }) => (
    <td {...rest} className={classx([TABLE_CONFIGS.cellClass, className])}>
      {renderDynamic(children)}
    </td>
  ),
  'TableCell'
);

export function createTable<T extends object = Record<string, unknown>>() {
  type OrderValue = keyof T | ((rows: T[], desc: boolean) => void);

  type TableProps = ReactProps<'table'> & {
    rows?: T[];
    order?: Bindable<'asc' | 'desc'>;
    orderBy?: Bindable<OrderValue>;
    selection?: T[];
  };

  type SortButtonProps = Omit<ReactProps<'button'>, 'value'> & {
    value: OrderValue;
    label?: string;
  };

  type TableBodyProps = Omit<ReactProps<'tbody'>, 'children'> & {
    children?: ReactNode | ((item: T, index: number) => ReactNode);
  };

  type TableRowProps = ReactProps<'tr'> & {
    item?: T;
    variant?: 'filled';
  };

  type TableInternalProps = ComponentProps<TableProps>;

  const context = createContext<TableInternalProps>();

  const Table = setup<TableProps>((props) => {
    const $props = props as never as TableInternalProps;
    const restProps = props.$omit(['rows', 'selection', 'orderBy', 'order', 'children', 'className']);

    effect(() => {
      const { rows, orderBy, order } = $props;

      if (!Array.isArray(rows)) return;
      if (typeof orderBy === 'function') return untrack(() => orderBy(rows, order === 'desc'));

      if (orderBy) {
        const isDesc = order === 'desc';

        untrack(() =>
          rows.sort((a, b) => {
            const valA = a[orderBy] as string | number;
            const valB = b[orderBy] as string | number;
            if (valA < valB) return isDesc ? 1 : -1;
            if (valA > valB) return isDesc ? -1 : 1;
            return 0;
          })
        );
      }
    });

    context.set($props);

    return render(
      () => (
        <table {...restProps} className={classx([TABLE_CONFIGS.viewClass, $props.className])}>
          {$props.children}
        </table>
      ),
      'Table'
    );
  }, 'Table');

  const TableHeaderRow = setup<ReactProps<'tr'>>((props) => {
    const $props = props as never as ReactProps<'tr'>;
    const table = context.get();

    if (!table) {
      return (
        <tr className="air-error">
          <td>[Error: TableHeaderRow rendered outside of Table component]</td>
        </tr>
      );
    }

    const restProps = props.$omit(['children', 'className', 'ref']);

    const handleSelectAll = () => {
      if (!table.rows || !table.selection) return;

      if (table.selection.length === table.rows.length) {
        table.selection.splice(0, table.selection.length); // Deselect all
      } else {
        table.selection.splice(0, table.selection.length, ...table.rows); // Select all
      }
    };

    const checked = derived(() => {
      if (!table.rows || !table.selection) return false;
      if (table.selection.length === table.rows.length && table.rows.length > 0) return true;
    });
    const indeterminate = derived(() => {
      return table?.selection && !checked.value && table.selection.length > 0;
    });

    return render(() => {
      return (
        <tr {...restProps} className={classx([TABLE_CONFIGS.rowClass, $props.className])}>
          {Array.isArray(table.selection) && (
            <th className={TABLE_CONFIGS.headerCellClass}>
              <Checkbox checked={checked.value} indeterminate={indeterminate.value} onClick={handleSelectAll} />
            </th>
          )}
          {$props.children}
        </tr>
      );
    }, 'TableHeaderRow');
  }, 'TableHeaderRow');

  const SortButton = setup<SortButtonProps>((props) => {
    const $props = props as never as SortButtonProps;
    const table = context.get();

    if (!table) {
      return (
        <button type="button" className="air-error">
          [Error: SortButton rendered outside of Table component]
        </button>
      );
    }

    const restProps = props.$omit(['value', 'children', 'className', 'ref']);

    const handleClick = () => {
      if (table.orderBy === $props.value) {
        table.order = table.order === 'asc' ? 'desc' : 'asc';
      } else {
        table.order = 'asc';
        table.orderBy = $props.value;
      }
    };

    return render(() => {
      const valueText = String($props.value);

      return (
        <button
          {...restProps}
          type="button"
          onClick={handleClick}
          data-active={table.orderBy === $props.value}
          data-order={table.order}
          className={classx(['air-table-sort', $props.className])}
        >
          {$props.children ?? $props.label ?? valueText}
          <DropDown />
          <Tooltip>Order by {$props.label ?? valueText}</Tooltip>
        </button>
      );
    }, 'SortButton');
  }, 'SortButton');

  const TableBody = setup<TableBodyProps>((props) => {
    const $props = props as never as TableBodyProps;
    const table = context.get();

    if (!table) {
      return (
        <tbody className="air-error">
          <tr>
            <td>[Error: TableBody rendered outside of Table component]</td>
          </tr>
        </tbody>
      );
    }

    const restProps = props.$omit(['children', 'className', 'ref']);

    return render(() => {
      const children = $props.children;

      if (isFunction(children)) {
        return (
          <tbody {...restProps} className={$props.className}>
            <For each={() => table.rows ?? []} children={children} />
          </tbody>
        );
      }

      return (
        <tbody {...restProps} className={$props.className}>
          {children}
        </tbody>
      );
    }, 'TableBody');
  }, 'TableBody');

  const TableRow = setup<TableRowProps>((props) => {
    const $props = props as never as TableRowProps;
    const table = context.get();

    if (!table) {
      return (
        <tr className="air-error">
          <td>[Error: TableRow rendered outside of Table component]</td>
        </tr>
      );
    }

    const restProps = props.$omit(['item', 'variant', 'children', 'className', 'ref']);

    const toggleSelection = () => {
      const myIndex = table.selection!.indexOf($props.item!);

      if (myIndex > -1) {
        table.selection!.splice(myIndex, 1);
      } else {
        table.selection!.push($props.item!);
      }
    };

    const isSelected = derived(() => {
      if (!table.selection) return false;
      return table.selection.includes($props.item as T);
    });
    const rowRef = nodeRef<HTMLTableRowElement>(() => {
      const baseClass = $props.variant === 'filled' ? TABLE_CONFIGS.rowFilledClass : TABLE_CONFIGS.rowClass;
      return {
        'aria-selected': isSelected.value ? 'true' : 'false',
        className: classx([baseClass, $props.className]),
      };
    });

    return (
      <tr {...restProps} {...rowRef.attributes} ref={rowRef}>
        {Array.isArray(table.selection) && $props.item && (
          <td className={TABLE_CONFIGS.cellClass}>
            <Checkbox checked={$use(() => isSelected.value)} onClick={toggleSelection} />
          </td>
        )}
        {$props.children}
      </tr>
    );
  }, 'TableRow');

  return Object.assign(Table, {
    Row: TableRow,
    Body: TableBody,
    Cell: TableCell,
    Head: TableHead,
    Header: TableHeader,
    HeaderRow: TableHeaderRow,
    Sort: SortButton,
  });
}

const DefaultTable = createTable<Record<string, unknown>>();

export const Table = DefaultTable;
export const TableRow = DefaultTable.Row;
export const TableSort = DefaultTable.Sort;
export const TableBody = DefaultTable.Body;
export const TableHeaderRow = DefaultTable.HeaderRow;
