import { page } from '@airlib/react';
import { layoutRoute } from '../route.js';

export const LayoutPage = page(layoutRoute).render(() => (
  <div className="flex flex-col gap-8">
    <div className="mb-8">
      <h1 className="air-display-sm mb-4">Layout Shell</h1>
      <p className="air-body-lg text-on-surface-variant max-w-3xl">
        The layout shell provides the foundational structure for your application, including navigation components like
        navigation rails, bars, and drawers.
      </p>
    </div>

    <section className="mb-12">
      <h2 className="air-headline-sm mb-6 pb-2 border-b border-outline-variant">Navigation Rail (Tablet/Desktop)</h2>
      <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl h-[400px] flex gap-4">
        <nav className="air-navigation-rail h-full rounded-xl bg-surface">
          <div className="air-navigation-rail-header">
            <button className="air-fab-tertiary">
              <span className="air-icon">edit</span>
            </button>
          </div>
          <div className="air-navigation-rail-content">
            <button className="air-navigation-rail-item" aria-selected="true">
              <span className="air-icon air-navigation-rail-icon">inbox</span>
              <span className="air-navigation-rail-label">Inbox</span>
            </button>
            <button className="air-navigation-rail-item" aria-selected="false">
              <span className="air-icon air-navigation-rail-icon">send</span>
              <span className="air-navigation-rail-label">Sent</span>
            </button>
            <button className="air-navigation-rail-item" aria-selected="false">
              <span className="air-icon air-navigation-rail-icon">favorite</span>
              <span className="air-navigation-rail-label">Favorites</span>
            </button>
          </div>
        </nav>
        <div className="flex-1 bg-surface-container-high rounded-xl p-4">
          <h3 className="air-title-md">Main Content</h3>
          <p className="air-body-md text-on-surface-variant mt-2">Content area next to the navigation rail.</p>
        </div>
      </div>
    </section>

    <section className="mb-12">
      <h2 className="air-headline-sm mb-6 pb-2 border-b border-outline-variant">Bottom Navigation (Mobile)</h2>
      <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl flex items-end justify-center h-[300px]">
        <nav className="air-navigation-bar w-full max-w-md rounded-xl bg-surface mb-4">
          <button className="air-navigation-bar-item" aria-selected="true">
            <span className="air-icon air-navigation-bar-icon">inbox</span>
            <span className="air-navigation-bar-label">Inbox</span>
          </button>
          <button className="air-navigation-bar-item" aria-selected="false">
            <span className="air-icon air-navigation-bar-icon">send</span>
            <span className="air-navigation-bar-label">Sent</span>
          </button>
          <button className="air-navigation-bar-item" aria-selected="false">
            <span className="air-icon air-navigation-bar-icon">favorite</span>
            <span className="air-navigation-bar-label">Favorites</span>
          </button>
        </nav>
      </div>
    </section>
  </div>
));

export default LayoutPage;
