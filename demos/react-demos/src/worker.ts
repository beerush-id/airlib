import { AirApp } from '@airlib/react-ui/components';
import { createFullWorker, createSSR } from '@airlib/react/ssr';
import { HTTPRouter } from '@irpclib/http/router';
import { transport } from './lib/module.js';
import router from './lib/router.js';
import { RootLayout } from './pages/index.js';

import './pages/constructor.js';

const rpcRouter = new HTTPRouter(transport);
const ssrRenderer = createSSR(router, RootLayout);

export default createFullWorker(rpcRouter, ssrRenderer, {}, AirApp);
