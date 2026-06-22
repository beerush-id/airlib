import { Link, page, redirect, template } from '@anchorlib/react';
import { ThemeToggle } from '../../components/ThemeToggle.js';
import { createSettings } from '../../lib/settings.js';
import { RootPage } from '../page.js';
import { authRoute } from './route.js';
import { SignInPage } from './signin/index.js';
import { SignUpPage } from './signup/index.js';

authRoute.route('/').guard(() => {
  throw redirect(SignInPage);
});

export const AuthLayout = page(authRoute).render(({ context: ctx, children }) => {
  createSettings();

  const Title = template(
    () => <span className="brand-anchor">{ctx.url?.endsWith('/signin') ? 'In' : 'Up'}</span>,
    'AuthTitle',
  );

  const CrossLink = template(
    () =>
      ctx.url?.endsWith('/signin') ? (
        <p className="air-body-md text-on-surface-variant mt-4 text-center">
          Don't have an account? <Link to={SignUpPage}>Sign Up</Link>
        </p>
      ) : (
        <p className="air-body-md text-on-surface-variant mt-4 text-center">
          Already have an account? <Link to={SignInPage}>Sign In</Link>
        </p>
      ),
    'CrossLink',
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-8 text-center relative w-full overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[--color-anchor] opacity-[0.03] rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-10">
        <Link to={RootPage} className="link-nav">
          ← Back to home
        </Link>
        <div className="flex-1"></div>
        <ThemeToggle />
      </div>

      <h1 className="hero-heading relative z-10">
        <span className="text-on-surface-variant font-light">Sign&nbsp;</span>
        <Title />
      </h1>
      <p className="hero-subtitle relative z-10">Anchor form() with Zod validation and two-way binding</p>

      <div
        className="text-left"
        style={
          {
            '--air-button-height': 'calc(var(--spacing) * 14)', // 56px (matches M3 input height)
            '--air-text-field-radius': 'var(--radius-md)', // 12px
            '--air-font-label-large-size': '16px', // Boost button text size to match larger height
          } as React.CSSProperties
        }
      >
        {children}
      </div>

      <div className="relative z-10">
        <CrossLink />
      </div>
    </div>
  );
});
export default AuthLayout;
