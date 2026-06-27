import { ThemeSwitch } from '@airlib/react-ui/components';
import { Link, template } from '@anchorlib/react';
import airstackLogo from '../assets/airstack.svg';
import { DesktopPage } from '../pages/desktop/index.js';
import { FormsPage } from '../pages/forms/index.js';
import { MaterialPage } from '../pages/material/page.js';
import { RootPage } from '../pages/page.js';
import { UIPage } from '../pages/ui/page.js';

export const Header = template(
  () => (
    <header className="air-app-bar fixed top-0 left-0 w-screen z-50 bg-surface-container-lowest/80 backdrop-blur-md h-16">
      <div className="flex items-center justify-between w-full h-full">
        <Link
          to={RootPage}
          className="flex items-center gap-2 no-underline text-on-surface font-semibold air-title-md hover:opacity-80 transition-opacity"
        >
          <img src={airstackLogo} alt="AIR Stack" className="h-7 w-auto" />
          <span className="header-title">AIR Libraries</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to={DesktopPage} className="air-button-text" activeClass="text-primary bg-primary-container/20">
            Desktop
          </Link>
          <Link to={FormsPage} className="air-button-text" activeClass="text-primary bg-primary-container/20">
            Forms
          </Link>
          <Link to={UIPage} className="air-button-text" activeClass="text-primary bg-primary-container/20">
            React UI
          </Link>
          <Link to={MaterialPage} className="air-button-text" activeClass="text-primary bg-primary-container/20">
            Material 3 CSS
          </Link>
          <a href="https://github.com/beerush-id/airstack" target="_blank" rel="noreferrer" className="air-button-text">
            GitHub
          </a>
          <ThemeSwitch />
        </nav>
      </div>
    </header>
  ),
  'Header'
);
export default Header;
