import './styles/styles.css';

import { UIRouter } from '@airlib/react';
import { hydrateRoot } from 'react-dom/client';
import { router } from './lib/router.js';
import { RootLayout } from './pages/layout.js';

// Ensure route & IRPC constructors are bundled in the browser client
import './pages/constructor.js';
import './pages/page.js';

router.activate(window.location.href).then(() => {
  hydrateRoot(
    document.getElementById('root')!,
    <UIRouter router={router} root={RootLayout} headless={true} resetScroll />
  );
});
