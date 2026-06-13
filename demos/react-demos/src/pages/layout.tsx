import { DialogConfirmHost } from '@airlib/react-ui/components';
import { MouseIcon } from '@airlib/react-ui/icons';
import { enableLiveObjects } from '@airlib/uikit';
import { getPointer } from '@airlib/uikit/utils';
import { NotFoundError, page, render, setup } from '@anchorlib/react';
import { Footer } from '../components/Footer.js';
import { Header } from '../components/Header.js';
import { router } from '../lib/router.js';
import { createSettings } from '../lib/settings.js';
import { rootRoute } from './route.js';

router.catch(({ error }) => {
  if (error instanceof NotFoundError) {
    return (
      <div className="error-page">
        <h1 className="error-title">404</h1>
        <p className="error-desc">Page not found</p>
      </div>
    );
  }

  return (
    <div className="error-page">
      <h1 className="error-title">500</h1>
      <p className="error-desc">Internal Server Error</p>
    </div>
  );
});

const PointerDebug = setup(() => {
  const pointer = getPointer();

  return render(
    () => (
      <div className="fixed chip chip-sm bottom-0 right-0 m-2 flex gap-1 pointer-events-none">
        <span>
          X: {pointer.x}, Y: {pointer.y}
        </span>
        <MouseIcon size={16} />
      </div>
    ),
    'PointerDebug'
  );
}, 'PointerDebug');

export const RootLayout = page(rootRoute).render(({ children }) => {
  createSettings();
  enableLiveObjects();

  return (
    <>
      <Header />
      <main className="layout-main">{children}</main>
      <Footer />
      <DialogConfirmHost />
      <PointerDebug />
    </>
  );
});
export default RootLayout;
