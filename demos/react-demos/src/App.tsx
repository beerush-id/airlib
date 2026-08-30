import './styles/styles.css';

import { AirApp } from '@airlib/react-ui';
import { acceptInteractions } from '@airlib/core/browser';
import { anchor, UIRouter } from '@airlib/react';
import { hydrateRoot } from 'react-dom/client';
import { router } from './lib/router.js';
import { RootLayout } from './pages/index.js';

anchor.configure({ production: false });

router
  .activate(window.location.href)
  .then(() => {
    hydrateRoot(
      document.getElementById('root')!,
      <AirApp>
        <UIRouter router={router} root={RootLayout} headless={true} resetScroll />
      </AirApp>
    );
  })
  .then(() => {
    return acceptInteractions();
  });
