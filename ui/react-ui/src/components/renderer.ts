import type { ComponentProps, JSX, JSXElementConstructor, ReactNode } from 'react';

type NodeRenderer = () => ReactNode;
type FineNode = ReactNode | Iterable<ReactNode | NodeRenderer> | NodeRenderer;

// biome-ignore lint/suspicious/noExplicitAny: Expect any.
export type ElementProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = Omit<
  ComponentProps<T>,
  'children'
> & {
  children?: FineNode;
};

export const renderDynamic = (children?: FineNode): ReactNode => {
  if (typeof children === 'function') return children();
  if (Array.isArray(children)) {
    return children.map((n, i) => {
      const node = renderDynamic(n);
      if (typeof node === 'object' && node !== null && !node['key' as never]) {
        return { ...node, key: i };
      }
      return node;
    }) as ReactNode;
  }
  return children as ReactNode;
};
