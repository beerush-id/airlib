import { template } from '@anchorlib/react';

export const Footer = template(() => {
  return (
    <footer className="py-6 px-8 text-center air-body-sm text-on-surface-variant border-t border-outline-variant w-full">
      <p>
        Built with{' '}
        <a href="https://github.com/beerush-id/airstack" target="_blank" rel="noreferrer">
          Anchor
        </a>
        {' + '}
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          Vite
        </a>
        {' + '}
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          React
        </a>
      </p>
    </footer>
  );
}, 'Footer');
export default Footer;
