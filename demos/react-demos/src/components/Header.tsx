import { Link, template } from '@anchorlib/react';
import airstackLogo from '../assets/airstack.svg';
import { FormsPage } from '../pages/forms/index.js';
import { MaterialPage } from '../pages/material/page.js';
import { RootPage } from '../pages/page.js';
import { UIPage } from '../pages/ui/page.js';
import { ThemeToggle } from './ThemeToggle.js';

export const Header = template(
  () => (
    <header className="app-bar fixed top-0 left-0 w-screen z-50 bg-surface-container-lowest/80 backdrop-blur-md h-16">
      <div className="flex items-center justify-between w-full h-full px-8">
        <Link
          to={RootPage}
          className="flex items-center gap-2 no-underline text-on-surface font-semibold text-title-medium hover:opacity-80 transition-opacity"
        >
          <img src={airstackLogo} alt="AIR Stack" className="h-7 w-auto" />
          <span className="header-title">AIR Libraries</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to={FormsPage} className="button-text" activeClass="text-primary bg-primary-container/20">
            Forms
          </Link>
          <Link to={UIPage} className="button-text" activeClass="text-primary bg-primary-container/20">
            React UI
          </Link>
          <Link to={MaterialPage} className="button-text" activeClass="text-primary bg-primary-container/20">
            Material 3 CSS
          </Link>
          <a href="https://github.com/beerush-id/airstack" target="_blank" rel="noreferrer" className="button-text">
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  ),
  'Header'
);
export default Header;
