import '@anchorlib/react/client'; // MUST be first import
import './styles/styles.css';
import { AirApp } from '@airlib/react-ui';
import { anchor, UIRouter } from '@anchorlib/react';
import { hydrateRoot } from 'react-dom/client';
import { router } from './lib/router.js';
import { RootLayout } from './pages/layout.js';

anchor.configure({ production: false });

router.activate(window.location.href).then(() => {
  hydrateRoot(
    document.getElementById('root')!,
    <AirApp>
      <UIRouter router={router} root={RootLayout} headless={true} resetScroll />
    </AirApp>
  );
});
