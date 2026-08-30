import { ThemeSwitch } from '@airlib/react-ui/components';
import { Link, template } from '@airlib/react';
import airstackLogo from '../assets/airstack.svg';
import { UIPage } from '../pages/components/index.js';
import { DesktopPage } from '../pages/desktop/index.js';
import { RootPage } from '../pages/page.js';

export const Header = template(
  () => (
    <header className="air-app-bar fixed top-0 left-0 w-screen z-sticky bg-surface-container-lowest/80 backdrop-blur-md h-16">
      <div className="air-page flex items-center justify-between w-full h-full">
        <Link
          to={RootPage}
          className="flex items-center gap-2 no-underline text-on-surface font-semibold air-title-md hover:opacity-80 transition-opacity"
        >
          <img src={airstackLogo} alt="AIR Stack" className="h-7 w-auto" />
          <span className="header-title">AIR Libraries</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to={UIPage} className="air-button-text" activeClass="text-primary bg-primary-container/20">
            Components
          </Link>
          <Link to={DesktopPage} className="air-button-text" activeClass="text-primary bg-primary-container/20">
            Desktop
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
