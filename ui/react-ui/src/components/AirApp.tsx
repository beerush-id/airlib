import { enableLiveObjects } from '@airlib/uikit';
import { onMount, setup } from '@anchorlib/react';
import type { HTMLAttributes } from 'react';
import { ConfirmDialogHost } from './dialog/index.js';
import { WindowRendererHost } from './window/index.js';

export type AirAppProps = HTMLAttributes<HTMLDivElement>;

export const AirApp = setup<AirAppProps>((props) => {
  onMount(() => {
    enableLiveObjects();
  });

  return (
    <>
      {props.children}
      <WindowRendererHost />
      <ConfirmDialogHost />
    </>
  );
}, 'AirApp');
