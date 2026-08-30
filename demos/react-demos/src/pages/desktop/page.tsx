import { Tooltip, WindowDock, WindowLauncher } from '@airlib/react-ui';
import { CloseIcon } from '@airlib/react-ui/icons';
import { webWindow } from '@airlib/react-ui/lib';
import { Link, page, Title } from '@airlib/react';
import RootPage from '../page.js';
import DemoWindow from './DemoWindow.js';
import { desktopIndex } from './route.js';

const win = webWindow({
  name: 'asset-browser',
  title: 'Asset Browser',
  description: 'Multi window asset browser is awesome.',
  multiple: true,
  remember: 'default',
  rect: { minWidth: 960, minHeight: 680 },
  icon: '/icons/folder.svg',
}).render(DemoWindow);

export const DesktopPage = page(desktopIndex).render(() => {
  return (
    <>
      <Title>Desktop — AIR Stack</Title>
      <WindowDock>
        <WindowLauncher app={win} />
        <Link to={RootPage} className="air-icon-button">
          <CloseIcon />
          <Tooltip yPos="before">Back to Home</Tooltip>
        </Link>
      </WindowDock>
    </>
  );
});
