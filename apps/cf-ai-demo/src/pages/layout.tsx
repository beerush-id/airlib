import { NotFoundError, page } from '@airlib/react';
import { createSettings } from '../lib/settings.js';
import { rootRoute } from './route.js';

rootRoute.router.catch(({ error }) => {
  if (error instanceof NotFoundError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-3">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-on-surface-variant text-sm">Page not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white gap-3">
      <h1 className="text-4xl font-bold">500</h1>
      <p className="text-on-surface-variant text-sm">Internal Server Error</p>
    </div>
  );
});

export const RootLayout = page(rootRoute).render(({ children }) => {
  createSettings();

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface selection:bg-[#F38020]/30 selection:text-white">
      {children}
    </div>
  );
});

export default RootLayout;
