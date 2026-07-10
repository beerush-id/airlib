import { colorScheme } from '@airlib/headless/utils';
import { NotFoundError, page, Style } from '@anchorlib/react';
import { Footer } from '../components/Footer.js';
import { Header } from '../components/Header.js';
import { router } from '../lib/router.js';
import { configureApp } from '../lib/settings.js';
import { rootRoute } from './route.js';

configureApp();

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

export const RootLayout = page(rootRoute).render(({ children }) => {
  const theme = colorScheme();

  return (
    <>
      <Header />
      <Style>{`:root { --seed-color: ${theme.color ?? 'red'}; }`}</Style>
      <main className="w-full min-h-screen pt-16 flex flex-col">{children}</main>
      <Footer />
    </>
  );
});
export default RootLayout;
