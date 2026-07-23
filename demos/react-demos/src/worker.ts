import { AirApp } from '@airlib/react-ui/components';
import { createFullWorker, createSSR } from '@anchorlib/react/ssr';
import { HTTPRouter } from '@irpclib/http/router';
import { IRPC_STORE } from '@irpclib/irpc';
import { transport } from './lib/module.js';
import router from './lib/router.js';
import RootLayout from './pages/layout.js';

import './pages/constructor.js';

const render = createSSR(router, RootLayout);

const irpcHttpRouter = new HTTPRouter(transport);

IRPC_STORE.subscribe(() => {
  IRPC_STORE.print();
});

export default createFullWorker(irpcHttpRouter, render, {}, AirApp);
