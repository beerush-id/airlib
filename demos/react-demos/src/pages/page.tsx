import { Meta, page, Title } from '@anchorlib/react';
import airstackLogo from '../assets/airstack.svg';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import { Counter } from '../components/Counter.js';
import { indexRoute } from './route.js';

export const RootPage = page(indexRoute).render(() => (
  <>
    <Title>AIR Stack</Title>
    <Meta
      name="description"
      content="Build high-performance, scalable, and highly maintainable React applications powered by Anchor — fine-grained reactivity, zero hooks, SSR-ready."
    />

    <div className="logo-row">
      <a href="https://airlib.dev" className="logo-link logo-anchor" target="_blank" rel="noreferrer">
        <img src={airstackLogo} alt="AIR Stack logo" />
      </a>
      <span className="logo-separator">+</span>
      <a href="https://vite.dev" className="logo-link logo-vite" target="_blank" rel="noreferrer">
        <img src={viteLogo} alt="Vite logo" />
      </a>
      <span className="logo-separator">+</span>
      <a href="https://react.dev" className="logo-link logo-react" target="_blank" rel="noreferrer">
        <img src={reactLogo} alt="React logo" />
      </a>
    </div>

    <h1 className="hero-heading">
      <span className="brand-anchor">AIR Stack</span>
    </h1>

    <p className="hero-subtitle">Zero Boilerplate, AI Native Stack</p>

    <div className="card card-outlined p-8 mb-8 min-w-[20rem] flex justify-center">
      <Counter />
    </div>

    <div className="features">
      <div className="card card-outlined p-6 text-left">
        <div className="feature-icon">⚡</div>
        <h3 className="text-title-medium font-semibold text-on-surface mb-2">Write Logic, Not Glue</h3>
        <p className="text-body-medium text-on-surface-variant leading-relaxed">
          Define your data, mutate it directly, and the UI updates itself. No hooks, no dependency arrays, no re-render
          optimization.
        </p>
      </div>
      <div className="card card-outlined p-6 text-left">
        <div className="feature-icon">🎯</div>
        <h3 className="text-title-medium font-semibold text-on-surface mb-2">Surgical Updates</h3>
        <p className="text-body-medium text-on-surface-variant leading-relaxed">
          Only the exact DOM fragment reading changed state re-renders. Everything else stays still. No full-tree
          reconciliation.
        </p>
      </div>
      <div className="card card-outlined p-6 text-left">
        <div className="feature-icon">🤖</div>
        <h3 className="text-title-medium font-semibold text-on-surface mb-2">AI Native</h3>
        <p className="text-body-medium text-on-surface-variant leading-relaxed">
          Logic-first architecture means AI agents reason about your app the same way you do — data in, state out. Fewer
          tokens, fewer hallucinations.
        </p>
      </div>
    </div>

    <p className="docs-hint">
      <a href="https://docs.airlib.dev" target="_blank" rel="noreferrer">
        Read the docs
      </a>
      {' · '}
      <a href="https://github.com/beerush-id/airstack" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </p>
  </>
));
export default RootPage;
