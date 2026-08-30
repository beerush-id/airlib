import { colorScheme } from '@airlib/headless/utils';
import { page, Style } from '@airlib/react';
import { configureApp } from '../../lib/settings.js';
import { desktopRoute } from './route.js';

configureApp();

export const DesktopLayout = page(desktopRoute).render((props) => {
  const theme = colorScheme();
  return (
    <>
      <Style>{`:root { --seed-color: ${theme.color ?? 'red'}; }`}</Style>
      <main className="air-desktop">{props.children}</main>
    </>
  );
});
