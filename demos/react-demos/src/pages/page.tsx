import {
  Checkbox,
  createForm,
  EmailInput,
  FormReset,
  FormSubmit,
  Slider,
  Textarea,
  TextInput,
} from '@airlib/react-form';
import { Field, FieldLabel, TextField } from '@airlib/react-ui';
import { $bind, Link, Meta, mutable, page, setup, snippet, Title } from '@anchorlib/react';
import airstackLogo from '../assets/airstack.svg';
import { FormsPage } from './forms/index.js';
import { contactSchema, submitContact, watchPrice } from './home/function.js';
import { MaterialPage } from './material/page.js';
import { indexRoute } from './route.js';

// ── AIR Form: Contact form schema ────────────────────────────────────────────

const ContactForm = createForm(contactSchema as never);

// ── IRPC Section: Live price tile with manual call/stop ──────────────────────

const PriceTile = setup(() => {
  const symbol = mutable({ value: 'USD' });
  const stream = watchPrice.with(() => [symbol.value], 500);

  const symbols = ['USD', 'EUR', 'GBP'];

  const StatusBar = snippet(() => {
    const isPending = stream.status === 'pending';
    return (
      <div className={`air-progress-linear${isPending ? '' : ' opacity-0'}`} style={{ height: '2px' }}>
        <div className="air-progress-linear-bar air-progress-linear-primary air-progress-linear-indeterminate" />
      </div>
    );
  }, 'StatusBar');

  const PriceDisplay = snippet(() => {
    const { symbol: sym, price } = stream.data;
    return (
      <div className="flex items-end gap-3">
        <span className="air-display-sm font-bold text-on-surface">{price.toFixed(2)}</span>
        <span className="air-title-md text-on-surface-variant mb-1">{sym || symbol.value}</span>
        <div className={`air-badge-dot ml-2 mb-2 ${stream.status === 'pending' ? 'bg-tertiary' : 'bg-primary'}`} />
      </div>
    );
  }, 'PriceDisplay');

  const SymbolSelector = snippet(
    () => (
      <div className="air-segmented-group justify-center">
        {symbols.map((s) => (
          <button
            role="option"
            key={s}
            className="air-segmented-button"
            aria-selected={symbol.value === s || undefined}
            onClick={() => (symbol.value = s)}
          >
            {s}
          </button>
        ))}
      </div>
    ),
    'SymbolSelector'
  );

  return (
    <div className="air-card w-full max-w-96">
      <StatusBar />
      <div className="air-card-header text-center">
        <span className="air-card-title">Live Exchange Rate</span>
      </div>
      <div className="air-card-body flex flex-col gap-4 items-center">
        <PriceDisplay />
        <SymbolSelector />
      </div>
    </div>
  );
}, 'PriceTile');

// ── Anchor Section: Editable profile card with per-field snippets ─────────────

const ProfileDemo = setup(() => {
  const profile = mutable({
    name: 'Jane Doe',
    role: 'Senior Engineer',
    bio: 'Building fast, maintainable apps without the ceremony.',
  });

  const NameDisplay = snippet(
    () => <span className="air-title-lg font-semibold text-on-surface">{profile.name}</span>,
    'NameDisplay'
  );

  const RoleDisplay = snippet(() => <div className="air-chip mt-1">{profile.role}</div>, 'RoleDisplay');

  const BioDisplay = snippet(
    () => <p className="air-body-md text-on-surface-variant leading-relaxed mt-3">{profile.bio}</p>,
    'BioDisplay'
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      {/* Live preview card — static container, only snippets re-render */}
      <div className="air-card p-6 flex flex-col gap-2">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-2xl">person</span>
          </div>
          <div className="flex flex-col">
            <NameDisplay />
            <RoleDisplay />
          </div>
        </div>
        <BioDisplay />
        <span className="flex-1"></span>
        <p className="air-label-sm text-on-surface-variant mt-4 border-t border-outline-variant pt-3">
          This card is static. Only the fields that changed re-render.
        </p>
      </div>

      {/* Inputs — each TextInput/Textarea is a setup component, handles its own reactive read */}
      <div className="flex flex-col gap-4">
        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <TextField value={$bind(profile, 'name')} placeholder="E.g. Jane Doe" />
        </Field>
        <Field>
          <FieldLabel>Role</FieldLabel>
          <TextField value={$bind(profile, 'role')} placeholder="E.g. Engineer" />
        </Field>
        <Field>
          <FieldLabel>Bio</FieldLabel>
          <Textarea value={$bind(profile, 'bio')} placeholder="Tell us about yourself" />
        </Field>
        <p className="air-body-sm text-on-surface-variant">
          Mutate directly —{' '}
          <code className="font-mono bg-surface-variant px-1 rounded text-xs">profile.name = ...</code>. No hooks, no
          dispatch.
        </p>
      </div>
    </div>
  );
}, 'ProfileDemo');

// ── M3 CSS Section: Interactive component sampler ─────────────────────────────

type M3Tab = 'buttons' | 'controls' | 'cards';

const M3Sampler = setup(() => {
  const ui = mutable<{ tab: M3Tab; switchOn: boolean; sliderVal: number; chipSelected: boolean }>({
    tab: 'buttons',
    switchOn: true,
    sliderVal: 60,
    chipSelected: false,
  });

  const TabBar = snippet(
    () => (
      <div className="air-segmented-group mb-6">
        {(['buttons', 'controls', 'cards'] as M3Tab[]).map((t) => (
          <button
            role={'option'}
            key={t}
            className="air-segmented-button capitalize"
            aria-selected={ui.tab === t || undefined}
            onClick={() => (ui.tab = t)}
          >
            {t}
          </button>
        ))}
      </div>
    ),
    'TabBar'
  );

  const ButtonsTab = () => (
    <div className="flex flex-wrap gap-3 items-center">
      <button className="air-button">Filled</button>
      <button className="air-button-elevated">Elevated</button>
      <button className="air-button-tonal">Tonal</button>
      <button className="air-button-outlined">Outlined</button>
      <button className="air-button-text">Text</button>
    </div>
  );

  const VolumesTab = snippet(
    () => (
      <div className="flex items-center gap-4 max-w-sm">
        <span className="material-symbols-outlined text-on-surface-variant">volume_down</span>
        <Slider min={0} max={100} value={$bind(() => ui, 'sliderVal')} />
        <span className="material-symbols-outlined text-on-surface-variant">volume_up</span>
        <span className="air-label-md text-on-surface-variant w-8">{ui.sliderVal}</span>
      </div>
    ),
    'Volumes'
  );

  const ControlsTab = snippet(
    () => (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            role="switch"
            className="air-switch"
            aria-checked={ui.switchOn}
            onClick={() => (ui.switchOn = !ui.switchOn)}
          >
            <span className="air-switch-thumb">
              <svg className={`air-switch-icon ${ui.switchOn ? 'air-switch-icon-checked' : ''}`} viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            </span>
          </button>
          <span className="air-body-md text-on-surface-variant">{ui.switchOn ? 'Enabled' : 'Disabled'}</span>
        </div>
        <VolumesTab />
        <div className="flex gap-3 flex-wrap items-center">
          <button
            className="air-chip cursor-pointer"
            role="checkbox"
            aria-checked={ui.chipSelected}
            onClick={() => (ui.chipSelected = !ui.chipSelected)}
          >
            <span className="material-symbols-outlined text-[16px]!">{ui.chipSelected ? 'check' : 'add'}</span>
            React
          </button>
          <div className="air-chip-elevated">Elevated</div>
          <div className="air-chip">Filter</div>
        </div>
      </div>
    ),
    'ControlsTab'
  );

  const CardsTab = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="air-card">
        <div className="air-card-header">
          <h4 className="air-card-title">Elevated</h4>
        </div>
        <div className="air-card-body air-body-sm text-on-surface-variant">surface-container-low + shadow</div>
      </div>
      <div className="air-card-filled">
        <div className="air-card-header">
          <h4 className="air-card-title">Filled</h4>
        </div>
        <div className="air-card-body air-body-sm text-on-surface-variant">surface-container-highest</div>
      </div>
      <div className="air-card-outlined">
        <div className="air-card-header">
          <h4 className="air-card-title">Outlined</h4>
        </div>
        <div className="air-card-body air-body-sm text-on-surface-variant">surface + outline-variant</div>
      </div>
    </div>
  );

  const Content = snippet(() => {
    switch (ui.tab) {
      case 'buttons':
        return <ButtonsTab />;
      case 'controls':
        return <ControlsTab />;
      case 'cards':
        return <CardsTab />;
    }
  }, 'Content');

  return (
    <div className="border border-primary rounded-xl p-6 w-full">
      <TabBar />
      <Content />
    </div>
  );
}, 'M3Sampler');

// ── Root Page ─────────────────────────────────────────────────────────────────

export const RootPage = page(indexRoute).render(() => (
  <div className="container-main">
    <Title>AIR Libraries — Zero Boilerplate, AI Native</Title>
    <Meta
      name="description"
      content="AIR Libraries — a catalog of production-ready libraries for building React apps. Fine-grained reactivity, isomorphic RPC, schema-driven forms, and Material 3 CSS."
    />

    {/* ── Hero ── */}
    <section className="flex flex-col items-center w-full py-12">
      <div className="flex items-center gap-3 mb-6">
        <img src={airstackLogo} alt="AIR Stack" className="h-12 w-auto" />
        <h1 className="air-display-sm font-bold text-on-surface tracking-tight">AIR Libraries</h1>
      </div>

      <p className="air-title-md text-on-surface-variant max-w-xl text-center leading-relaxed mb-8">
        Fine-grained reactivity, isomorphic RPC, and schema-driven forms.
        <br />
        No boilerplate. No ceremony. Ships fast.
      </p>

      <div className="flex gap-3 flex-wrap justify-center mb-8">
        <a href="https://github.com/beerush-id/airstack" target="_blank" rel="noreferrer" className="air-button">
          <span className="material-symbols-outlined text-[18px]!">code</span>
          GitHub
        </a>
        <a href="https://airlib.dev/getting-started" target="_blank" rel="noreferrer" className="air-button-tonal">
          <span className="material-symbols-outlined text-[18px]!">menu_book</span>
          Docs
        </a>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {['Anchor', 'IRPC', 'Router', 'Material 3', 'AIR Form'].map((lib) => (
          <div key={lib} className="air-chip">
            {lib}
          </div>
        ))}
      </div>
    </section>

    {/* ── Anchor: Fine-Grained Reactivity ── */}
    <section className="flex flex-col w-full py-12 gap-6 text-left">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
          <h2 className="air-headline-sm font-semibold text-on-surface">Anchor</h2>
        </div>
        <p className="air-body-lg text-on-surface-variant">
          Fine-grained reactivity. Mutate an object property — only the exact DOM fragment reading that property
          updates. No hooks, no re-render budgeting.
        </p>
        <a
          href="https://airlib.dev/state-management"
          target="_blank"
          rel="noreferrer"
          className="air-button-text self-start -ml-4"
        >
          Learn more
          <span className="material-symbols-outlined text-[18px]!">arrow_forward</span>
        </a>
      </div>
      <ProfileDemo />
    </section>

    {/* ── IRPC: Typed RPC & Streaming ── */}
    <section className="flex flex-col w-full py-12 gap-6 text-left">
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">swap_horiz</span>
            <h2 className="air-headline-sm font-semibold text-on-surface">IRPC</h2>
          </div>
          <p className="air-body-lg text-on-surface-variant">
            Isomorphic RPC with real-time streaming. One function declaration — runs on server, browser, or worker.
            Switch the symbol and the stream re-subscribes with zero teardown code.
          </p>
          <a
            href="https://airlib.dev/remote-function"
            target="_blank"
            rel="noreferrer"
            className="air-button-text self-start -ml-4"
          >
            Learn more
            <span className="material-symbols-outlined text-[18px]!">arrow_forward</span>
          </a>
        </div>
        <PriceTile />
      </div>
    </section>

    {/* ── AIR Form: Schema-Driven Forms ── */}
    <section className="flex flex-col w-full py-12 gap-6 text-left">
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        <ContactForm
          onSubmit={async (data) => {
            const result = await submitContact(data);
            console.log('IRPC Result:', result);
          }}
          className="air-card-group gap-2 flex-1 [--card-padding:1.5rem]"
        >
          <div className="air-card">
            <div className="air-card-body grid gap-5 sm:grid-cols-2">
              <ContactForm.Field name="name" label="Your Name">
                <TextInput placeholder="Jane Doe" />
              </ContactForm.Field>

              <ContactForm.Field name="email" label="Email Address">
                <EmailInput placeholder="jane@example.com" />
              </ContactForm.Field>

              <ContactForm.Field name="message" label="Message" className="air-field sm:col-span-2">
                <Textarea placeholder="What are you building?" rows={3} />
              </ContactForm.Field>

              <ContactForm.Field name="updates" className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <Checkbox id="updates-check" />
                  <span className="air-body-md text-on-surface">Keep me updated on releases</span>
                </label>
              </ContactForm.Field>
            </div>
          </div>

          <div className="air-card">
            <div className="air-card-body flex items-center justify-end gap-3 bg-surface-variant">
              <FormReset>Reset</FormReset>
              <FormSubmit>{(form) => (form?.pending ? 'Sending…' : 'Send Message')}</FormSubmit>
            </div>
          </div>
        </ContactForm>

        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
            <h2 className="air-headline-sm font-semibold text-on-surface">AIR Form</h2>
          </div>
          <p className="air-body-lg text-on-surface-variant">
            Schema-driven forms with live validation. Declare your schema with Zod, get typed fields, inline errors, and
            async submit state — all wired automatically.
          </p>
          <a
            href="https://airlib.dev/airlib/form"
            target="_blank"
            rel="noreferrer"
            className="air-button-text self-start -ml-4"
          >
            Learn more
            <span className="material-symbols-outlined text-[18px]!">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>

    {/* ── Material 3 CSS: Component Sampler ── */}
    <section className="flex flex-col w-full py-12 gap-6 text-left">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl">palette</span>
          <h2 className="air-headline-sm font-semibold text-on-surface">Material 3 CSS</h2>
        </div>
        <p className="air-body-lg text-on-surface-variant">
          A CSS-only M3 token system with utility classes for every component. No JavaScript required for styling —
          bring your own interaction layer.
        </p>
        <a
          href="https://airlib.dev/airlib/material-css"
          target="_blank"
          rel="noreferrer"
          className="air-button-text self-start -ml-4"
        >
          Learn more
          <span className="material-symbols-outlined text-[18px]!">arrow_forward</span>
        </a>
      </div>
      <M3Sampler />
    </section>

    {/* ── Bottom CTA ── */}
    <section className="flex flex-col w-full py-16 items-center text-center">
      <h2 className="air-headline-sm text-on-surface mb-3">Explore the full demos</h2>
      <p className="air-body-lg text-on-surface-variant mb-6">Each library has an interactive deep-dive demo.</p>
      <div className="flex gap-3 flex-wrap justify-center mb-8">
        <Link to={FormsPage} className="air-button">
          <span className="material-symbols-outlined text-[18px]!">edit_note</span>
          Forms Demo
        </Link>
        <Link to={MaterialPage} className="air-button-tonal">
          <span className="material-symbols-outlined text-[18px]!">palette</span>
          Material 3 CSS Demo
        </Link>
      </div>

      <div className="air-card-outlined px-6 py-4 text-left max-w-sm w-full">
        <p className="air-label-sm text-on-surface-variant mb-2">Install</p>
        <code className="font-mono air-body-sm text-on-surface block">bun add @anchorlib/react @irpclib/irpc</code>
      </div>
    </section>
  </div>
));

export default RootPage;
