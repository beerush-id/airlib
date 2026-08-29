import type { AnyType } from '@airlib/core';
import type { ComponentProps, JSX, JSXElementConstructor, ReactNode } from 'react';

type NodeRenderer<T = undefined> = (ctx: T) => ReactNode;
type FineNode<T> = ReactNode | Iterable<ReactNode | NodeRenderer<T>> | NodeRenderer<T>;

// biome-ignore lint/suspicious/noExplicitAny: Expect any.
export type ElementProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, C = undefined> = Omit<
  ComponentProps<T>,
  'children'
> & {
  children?: FineNode<C>;
};

export const renderDynamic = <T = undefined>(children?: FineNode<T>, ctx?: T): ReactNode => {
  if (typeof children === 'function') return children(ctx as AnyType);
  if (Array.isArray(children)) {
    return children.map((n, i) => {
      const node = renderDynamic(n, ctx);
      if (typeof node === 'object' && node !== null && !node['key' as never]) {
        return { ...node, key: i };
      }
      return node;
    }) as ReactNode;
  }
  return children as ReactNode;
};
