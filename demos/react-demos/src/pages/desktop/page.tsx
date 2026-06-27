import { webWindow } from '@airlib/react-ui/lib';
import { page } from '@anchorlib/react';
import DemoWindow from './DemoWindow.js';
import { desktopIndex } from './route.js';

const demoWin = webWindow({
  name: 'asset-browser',
  title: 'Asset Browser',
  description: 'Multi window asset browser is awesome.',
  multiple: true,
  remember: 'default',
  rect: { minWidth: 960, minHeight: 680 },
}).render(DemoWindow);

export const DesktopPage = page(desktopIndex).render(() => {
  return (
    <>
      <button className="air-button" onClick={() => demoWin.open()}>
        Open Window
      </button>
    </>
  );
});
