import type { ComponentProps, JSX, JSXElementConstructor, ReactNode } from 'react';

export type NodeRenderer = () => ReactNode;
export type FineNode = ReactNode | Iterable<ReactNode | NodeRenderer> | NodeRenderer;

// biome-ignore lint/suspicious/noExplicitAny: Expect any.
export type ElementProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = Omit<
  ComponentProps<T>,
  'children'
> & {
  children?: FineNode;
};

export const renderChild = (children?: FineNode): ReactNode => {
  if (typeof children === 'function') return children();
  if (Array.isArray(children)) {
    return children.map(renderChild) as ReactNode;
  }
  return children as ReactNode;
};
