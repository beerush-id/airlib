import type { AnyType } from '@airlib/uikit';
import { WebWin, type WebWindow } from '@airlib/uikit';
import { For, template } from '@anchorlib/react';
import type { ReactNode } from 'react';
import { WindowRenderer } from './Renderer.js';

export const WindowRendererHost = template(
  () => <For each={() => Array.from(WebWin.windows.values())}>{(host) => <WindowRendererSlot host={host} />}</For>,
  'WindowRendererHost'
);

export const WindowRendererSlot = template<{ host: WebWindow<AnyType, ReactNode> }>(
  ({ host }) => <For each={() => Array.from(host.instances)}>{(win) => <WindowRenderer instance={win} />}</For>,
  'WindowRendererSlot'
);
