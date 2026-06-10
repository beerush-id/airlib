import { Meta, page, Title } from '@anchorlib/react';
import { materialRoute } from './route.js';

export const MaterialPage = page(materialRoute).render(() => (
  <div className="p-8 w-full max-w-5xl mx-auto text-left">
    <Title>Material Design 3 CSS Utilities</Title>
    <Meta name="description" content="Material Design 3 Components Showcase" />

    <h1 className="text-display-medium mb-12">M3 CSS Utilities</h1>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Typography</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-label-small text-on-surface-variant">Display</span>
            <div className="text-display-large">Display Large</div>
            <div className="text-display-medium">Display Medium</div>
            <div className="text-display-small">Display Small</div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-label-small text-on-surface-variant">Headline</span>
            <div className="text-headline-large">Headline Large</div>
            <div className="text-headline-medium">Headline Medium</div>
            <div className="text-headline-small">Headline Small</div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-label-small text-on-surface-variant">Title</span>
            <div className="text-title-large">Title Large</div>
            <div className="text-title-medium">Title Medium</div>
            <div className="text-title-small">Title Small</div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-label-small text-on-surface-variant">Body</span>
            <div className="text-body-large">Body Large</div>
            <div className="text-body-medium">Body Medium</div>
            <div className="text-body-small">Body Small</div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-label-small text-on-surface-variant">Label</span>
            <div className="text-label-large">Label Large</div>
            <div className="text-label-medium">Label Medium</div>
            <div className="text-label-small">Label Small</div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Buttons</h2>
      <div className="flex gap-4 flex-wrap items-center mb-8">
        <button className="button">Filled</button>
        <button className="button-elevated">Elevated</button>
        <button className="button-tonal">Tonal</button>
        <button className="button-outlined">Outlined</button>
        <button className="button-text">Text</button>
      </div>

      <h3 className="text-title-medium mb-4 text-on-surface-variant">With Icons</h3>
      <div className="flex gap-4 flex-wrap items-center mb-8">
        <button className="button">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Leading
        </button>
        <button className="button-elevated">
          Trailing
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <button className="button-tonal">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          Both
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
        <button className="button-outlined">
          <span className="material-symbols-outlined text-[18px]">search</span>
          Search
        </button>
      </div>

      <h3 className="text-title-medium mb-4 text-on-surface-variant">Groups & Split</h3>
      <div className="flex gap-8 flex-wrap items-center mb-8">
        <div className="button-group">
          <button className="button-tonal">Cancel</button>
          <button className="button-tonal">Discard</button>
          <button className="button-tonal">Save</button>
        </div>
        <div className="split-button-group split-button-tonal">
          <button className="split-button-primary">Publish</button>
          <button className="split-button-trailing">
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </button>
        </div>
      </div>

      <h3 className="text-title-medium mb-4 text-on-surface-variant">Sizes</h3>
      <div className="flex gap-4 flex-wrap items-center">
        <button className="button-tonal button-xs">Extra Small</button>
        <button className="button-tonal button-sm">Small</button>
        <button className="button-tonal button-md">Medium</button>
        <button className="button-tonal button-lg">Large</button>
        <button className="button-tonal button-xl">Extra Large</button>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Default</h3>
          </div>
          <div className="card-body">surface-container-low + shadow</div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Filled</h3>
          </div>
          <div className="card-body">surface-container-highest</div>
        </div>
        <div className="card-outlined">
          <div className="card-header">
            <h3 className="card-title">Outlined</h3>
          </div>
          <div className="card-body">surface + outline</div>
        </div>
      </div>

      <h3 className="text-title-medium mt-12 mb-4 text-on-surface-variant">Segmented Card Group</h3>
      <div className="card-group max-w-sm">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Header Card</h4>
          </div>
          <div className="card-body">This is the first segment of the card group. It has a large top radius.</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Middle Card</h4>
          </div>
          <div className="card-body">
            This segment sits in the middle and uses the small inner radius on all corners.
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Footer Card</h4>
          </div>
          <div className="card-body">This is the final segment with a large bottom radius.</div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Text Fields</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mb-12">
        <div className="text-field">
          <input className="text-field-input" placeholder=" " />
          <label className="text-field-label">Outlined Input</label>
          <span className="text-field-supporting-text">Supporting text</span>
        </div>
        <div className="text-field">
          <input className="text-field-input-filled" placeholder=" " />
          <label className="text-field-label">Filled Input</label>
          <span className="text-field-supporting-text">Supporting text</span>
        </div>

        <div className="text-field">
          <span className="material-symbols-outlined absolute left-4 top-[16px] text-on-surface-variant z-10 pointer-events-none">
            search
          </span>
          <input className="text-field-input" placeholder=" " />
          <label className="text-field-label">With Leading Icon</label>
        </div>

        <div className="text-field">
          <input className="text-field-input" placeholder=" " />
          <label className="text-field-label">With Trailing Icon</label>
          <button className="icon-button absolute right-2 top-[8px] text-on-surface-variant z-10">
            <span className="material-symbols-outlined">visibility</span>
          </button>
        </div>
      </div>

      <h3 className="text-title-medium mb-4 text-on-surface-variant">Sizes (Outlined)</h3>
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="text-field text-field-sm">
          <input className="text-field-input" placeholder=" " />
          <label className="text-field-label">Small</label>
        </div>
        <div className="text-field text-field-md">
          <input className="text-field-input" placeholder=" " />
          <label className="text-field-label">Medium</label>
        </div>
        <div className="text-field text-field-lg">
          <input className="text-field-input" placeholder=" " />
          <label className="text-field-label">Large</label>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Chips</h2>
      <div className="flex gap-4 flex-wrap items-center mb-8">
        <div className="chip">Outlined Chip</div>
        <div className="chip-elevated">Elevated Chip</div>
        <div className="chip" aria-selected="true">
          Selected Chip
        </div>
      </div>

      <h3 className="text-title-medium mb-4 text-on-surface-variant">Sizes</h3>
      <div className="flex gap-4 flex-wrap items-center">
        <div className="chip chip-sm">Small Chip</div>
        <div className="chip chip-md">Medium Chip</div>
        <div className="chip chip-lg">Large Chip</div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Floating Action Buttons</h2>
      <div className="flex gap-6 flex-wrap items-center mb-8">
        <button className="fab">1</button>
        <button className="fab-surface">2</button>
        <button className="fab-secondary">3</button>
        <button className="fab-tertiary">4</button>
        <button className="fab fab-extended">Extended FAB</button>
      </div>

      <h3 className="text-title-medium mb-4 text-on-surface-variant">Sizes</h3>
      <div className="flex gap-6 flex-wrap items-end">
        <button className="fab-secondary fab-sm">S</button>
        <button className="fab-secondary">M</button>
        <button className="fab-secondary fab-lg">L</button>
      </div>

      <h3 className="text-title-medium mt-8 mb-4 text-on-surface-variant">FAB Menu (Speed Dial)</h3>
      <div className="flex justify-start pl-4 min-h-[240px] items-end">
        <div className="fab-menu" data-state="open">
          <div className="fab-menu-list">
            <button className="fab-secondary fab-sm fab-menu-item">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className="fab-secondary fab-sm fab-menu-item">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="fab-secondary fab-sm fab-menu-item">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
          <button className="fab fab-menu-trigger" data-state="open">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Badges & Progress</h2>
      <div className="flex gap-8 flex-wrap items-center">
        <div className="badge-container">
          <button className="button-tonal">Notifications</button>
          <span className="badge-dot" />
        </div>
        <div className="badge-container">
          <button className="button-tonal">Messages</button>
          <span className="badge">3</span>
        </div>
        <div className="w-48">
          <div className="progress-linear">
            <div className="progress-linear-bar progress-linear-primary" style={{ width: '45%' }} />
          </div>
        </div>
        <div className="progress-circular progress-circular-indeterminate">
          <svg viewBox="22 22 44 44" className="w-full h-full">
            <circle
              className="progress-circular-circle progress-circular-circle-indeterminate progress-circular-primary"
              cx="44"
              cy="44"
              r="20"
            />
          </svg>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Selection Controls</h2>
      <div className="flex gap-8 flex-wrap items-center">
        <div className="flex gap-4">
          <button type="button" role="checkbox" aria-checked="true" className="checkbox-container">
            <span className="checkbox checkbox-checked">
              <svg className="checkbox-icon checkbox-checked-icon" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <svg className="checkbox-icon checkbox-indeterminate-icon hidden" viewBox="0 0 24 24">
                <path d="M6 11h12v2H6z" />
              </svg>
            </span>
          </button>
          <button type="button" role="checkbox" aria-checked="mixed" className="checkbox-container">
            <span className="checkbox checkbox-indeterminate">
              <svg className="checkbox-icon checkbox-checked-icon hidden" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <svg className="checkbox-icon checkbox-indeterminate-icon" viewBox="0 0 24 24">
                <path d="M6 11h12v2H6z" />
              </svg>
            </span>
          </button>
          <button type="button" role="checkbox" aria-checked="false" className="checkbox-container">
            <span className="checkbox">
              <svg className="checkbox-icon checkbox-checked-icon hidden" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <svg className="checkbox-icon checkbox-indeterminate-icon hidden" viewBox="0 0 24 24">
                <path d="M6 11h12v2H6z" />
              </svg>
            </span>
          </button>
        </div>
        <div className="flex gap-4">
          <button type="button" role="radio" aria-checked="true" className="radio">
            <span className="radio-visual radio-checked">
              <span className="radio-visual-dot radio-checked-dot" />
            </span>
          </button>
          <button type="button" role="radio" aria-checked="false" className="radio">
            <span className="radio-visual">
              <span className="radio-visual-dot" />
            </span>
          </button>
        </div>
        <div className="flex gap-4">
          <button type="button" role="switch" className="switch" aria-checked="true">
            <span className="switch-thumb">
              <svg className="switch-icon switch-icon-checked" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            </span>
          </button>
          <button type="button" role="switch" className="switch" aria-checked="false">
            <span className="switch-thumb">
              <svg className="switch-icon" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Sliders</h2>
      <div className="max-w-md flex items-center h-12">
        <input type="range" className="slider-primary" min="0" max="100" defaultValue="40" />
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Icon & Segmented Buttons</h2>
      <div className="flex gap-8 flex-wrap items-center mb-8">
        <div className="flex gap-2">
          <button className="icon-button">
            <span className="material-symbols-outlined">star</span>
          </button>
          <button className="icon-button-filled">
            <span className="material-symbols-outlined">star</span>
          </button>
          <button className="icon-button-tonal">
            <span className="material-symbols-outlined">star</span>
          </button>
          <button className="icon-button-outlined">
            <span className="material-symbols-outlined">star</span>
          </button>
        </div>
        <div className="segmented-group">
          <button className="segmented-button" aria-pressed="true">
            Day
          </button>
          <button className="segmented-button">Week</button>
          <button className="segmented-button">Month</button>
        </div>
      </div>

      <h3 className="text-title-medium mb-4 text-on-surface-variant">Icon Button Sizes</h3>
      <div className="flex gap-4 flex-wrap items-center">
        <button className="icon-button-tonal icon-button-xs">
          <span className="material-symbols-outlined">star</span>
        </button>
        <button className="icon-button-tonal icon-button-sm">
          <span className="material-symbols-outlined">star</span>
        </button>
        <button className="icon-button-tonal icon-button-md">
          <span className="material-symbols-outlined">star</span>
        </button>
        <button className="icon-button-tonal icon-button-lg">
          <span className="material-symbols-outlined">star</span>
        </button>
        <button className="icon-button-tonal icon-button-xl">
          <span className="material-symbols-outlined">star</span>
        </button>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Menus, Lists & Dialogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col">
          <h3 className="text-title-medium mb-4">Segmented List</h3>
          <ul className="list-view">
            <li className="list-view-item list-view-item-filled" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container">music_note</span>
              </div>
              <div className="list-view-item-content">
                <span className="text-title-medium text-on-surface">Your Likes</span>
                <span className="list-view-item-supporting-text flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]!">push_pin</span>
                  Auto playlist
                </span>
              </div>
              <button className="icon-button ml-4 shrink-0">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </li>
            <li className="list-view-item list-view-item-filled" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container">album</span>
              </div>
              <div className="list-view-item-content">
                <span className="text-title-medium text-on-surface">Party Mix</span>
                <span className="list-view-item-supporting-text">Daisy Chain • 16 songs</span>
              </div>
              <button className="icon-button ml-4 shrink-0">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </li>
            <li className="list-view-item list-view-item-filled" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container">description</span>
              </div>
              <div className="list-view-item-content">
                <span className="text-title-medium text-on-surface">Documents</span>
                <span className="list-view-item-supporting-text">Updated 2 days ago</span>
              </div>
              <button className="icon-button ml-4 shrink-0">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </li>
          </ul>

          <h3 className="text-title-medium mb-4 mt-8">Filled List (No Segments)</h3>
          <ul className="list-view list-view-filled">
            <li className="list-view-item" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container">music_note</span>
              </div>
              <div className="list-view-item-content">
                <span className="text-title-medium text-on-surface">Your Likes</span>
                <span className="list-view-item-supporting-text flex items-center gap-1">Auto playlist</span>
              </div>
            </li>
            <li className="list-view-item" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container">album</span>
              </div>
              <div className="list-view-item-content">
                <span className="text-title-medium text-on-surface">Party Mix</span>
                <span className="list-view-item-supporting-text">Daisy Chain • 16 songs</span>
              </div>
            </li>
            <li className="list-view-item" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container">description</span>
              </div>
              <div className="list-view-item-content">
                <span className="text-title-medium text-on-surface">Documents</span>
                <span className="list-view-item-supporting-text">Updated 2 days ago</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-title-medium mb-4">Static Dialog Preview</h3>
          <div className="dialog relative max-w-sm mx-0" open>
            <h2 className="dialog-title">Dialog Title</h2>
            <div className="dialog-content">This is a static preview of the dialog surface.</div>
            <div className="dialog-actions">
              <button className="button-text">Cancel</button>
              <button className="button">Confirm</button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden relative min-h-[300px]">
          <div className="p-4">
            <h3 className="text-title-medium mb-4">Side Sheet Preview</h3>
            <p className="text-body-medium text-on-surface-variant">Main content area</p>
          </div>
          <div className="side-sheet-scrim absolute" data-state="open" style={{ position: 'absolute' }}></div>
          <div
            className="side-sheet side-sheet-right side-sheet-surface absolute"
            data-state="open"
            style={{ position: 'absolute', maxWidth: '60%' }}
          >
            <div className="p-4">
              <h4 className="text-title-small mb-4">Sheet Content</h4>
              <div className="flex flex-col gap-2">
                <div className="h-8 bg-surface-container rounded-md"></div>
                <div className="h-8 bg-surface-container rounded-md"></div>
                <div className="h-8 bg-surface-container rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Data Table (Segmented)</h2>
      <div className="w-full overflow-x-auto pb-4">
        <table className="table-view min-w-[600px]">
          <thead>
            <tr>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Role</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-row-filled" tabIndex={0}>
              <td className="table-cell">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                    A
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-on-surface">Alice Johnson</span>
                    <span className="text-body-small text-on-surface-variant">alice@example.com</span>
                  </div>
                </div>
              </td>
              <td className="table-cell">Admin</td>
              <td className="table-cell">
                <span className="chip chip-tonal text-xs h-6">Active</span>
              </td>
              <td className="table-cell text-right">
                <button className="icon-button icon-button-standard">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </td>
            </tr>
            <tr className="table-row-filled" tabIndex={0} aria-selected="true">
              <td className="table-cell">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    B
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-on-surface">Bob Smith</span>
                    <span className="text-body-small text-on-surface-variant">bob.smith@example.com</span>
                  </div>
                </div>
              </td>
              <td className="table-cell">Editor</td>
              <td className="table-cell">
                <span className="chip chip-tonal text-xs h-6">Active</span>
              </td>
              <td className="table-cell text-right">
                <button className="icon-button icon-button-standard">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </td>
            </tr>
            <tr className="table-row-filled" tabIndex={0}>
              <td className="table-cell">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                    C
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-on-surface">Charlie Davis</span>
                    <span className="text-body-small text-on-surface-variant">charlie.d@example.com</span>
                  </div>
                </div>
              </td>
              <td className="table-cell">Viewer</td>
              <td className="table-cell">
                <span className="chip bg-surface-variant text-on-surface-variant text-xs h-6">Offline</span>
              </td>
              <td className="table-cell text-right">
                <button className="icon-button icon-button-standard">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Tabs & Accordion</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="tab flex-1">
          <div className="tab-list">
            <button className="tab-item" aria-selected="true">
              Flight
              <div className="tab-indicator" />
            </button>
            <button className="tab-item" aria-selected="false">
              Hotel
              <div className="tab-indicator" />
            </button>
            <button className="tab-item" aria-selected="false">
              Car
              <div className="tab-indicator" />
            </button>
          </div>
          <div className="tab-content p-4 text-body-medium text-on-surface-variant">Tab content goes here.</div>
        </div>

        <div className="flex-1">
          <div className="accordion-group">
            <div className="accordion-item">
              <button className="accordion-header" aria-expanded="true">
                Accordion Item 1
                <span
                  className="material-symbols-outlined transition-transform duration-200"
                  style={{ transform: 'rotate(180deg)' }}
                >
                  expand_more
                </span>
              </button>
              <div className="accordion-content" data-state="open">
                <div className="accordion-inner text-body-medium text-on-surface-variant">
                  This is the content for the first accordion item.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <button className="accordion-header" aria-expanded="false">
                Accordion Item 2
                <span className="material-symbols-outlined transition-transform duration-200">expand_more</span>
              </button>
              <div className="accordion-content" data-state="closed">
                <div className="accordion-inner text-body-medium text-on-surface-variant">
                  This is the content for the second accordion item.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Pickers & Inputs</h2>
      <div className="flex flex-wrap gap-8 items-start">
        <div className="flex flex-col min-w-[320px]">
          <h3 className="text-title-medium mb-4">Date Picker</h3>
          <div className="date-picker">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-label-large">June 2026</span>
              <div className="flex gap-2">
                <button className="icon-button">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="icon-button">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2 px-2">
              <span className="text-label-small">S</span>
              <span className="text-label-small">M</span>
              <span className="text-label-small">T</span>
              <span className="text-label-small">W</span>
              <span className="text-label-small">T</span>
              <span className="text-label-small">F</span>
              <span className="text-label-small">S</span>
            </div>
            <div className="date-picker-grid grid grid-cols-7 gap-1 px-2">
              <button className="date-picker-cell text-body-small">1</button>
              <button className="date-picker-cell text-body-small">2</button>
              <button className="date-picker-cell text-body-small">3</button>
              <button className="date-picker-cell text-body-small" aria-selected="true">
                4
              </button>
              <button className="date-picker-cell text-body-small date-picker-cell-today">5</button>
              <button className="date-picker-cell text-body-small">6</button>
              <button className="date-picker-cell text-body-small">7</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-w-[280px]">
          <h3 className="text-title-medium mb-4">Time Picker</h3>
          <div className="time-picker">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="time-picker-unit" aria-selected="true">
                12
              </div>
              <div className="time-picker-separator text-display-medium">:</div>
              <div className="time-picker-unit">00</div>
            </div>
            <div className="flex justify-center">
              <div className="segmented-group">
                <button className="segmented-button" aria-pressed="true">
                  AM
                </button>
                <button className="segmented-button">PM</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 min-w-[280px] pt-4">
          <div className="search-bar relative">
            <span className="icon-button absolute left-2 top-2">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input type="text" className="search-bar-input pl-14" placeholder="Search..." />
          </div>

          <div className="relative">
            <button className="w-full flex items-center justify-between bg-surface-variant text-on-surface-variant px-4 py-3 h-[56px] rounded-t-md border-b border-on-surface-variant hover:bg-surface-variant/80 transition-colors">
              Select Option
              <span className="material-symbols-outlined">arrow_drop_down</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Overlays & Notifications</h2>
      <div className="flex gap-8 flex-wrap items-start">
        <div className="snackbar flex items-center justify-between min-w-[300px]" data-state="visible">
          Single-line snackbar
          <button className="snackbar-action ml-4 font-medium">Action</button>
        </div>

        <div className="tooltip-plain relative! mt-2" data-state="visible">
          Plain tooltip
        </div>

        <div className="tooltip-rich relative! max-w-xs" data-state="visible">
          <h4 className="text-title-small mb-1">Rich Tooltip</h4>
          <p className="text-body-small">
            This is a rich tooltip that provides more detailed information and context about an element.
          </p>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-display-small mb-8">Extensions</h2>

      {/* Masonry */}
      <h3 className="text-headline-small mb-6">Masonry Layout</h3>
      <div className="masonry mb-16 w-full max-w-5xl">
        <div className="masonry-item card card-outlined">
          <div className="card-header">
            <h4 className="card-title">Item 1</h4>
          </div>
          <div className="card-body">Short content.</div>
        </div>

        <div className="masonry-item card-filled">
          <div className="card-header">
            <h4 className="card-title">Item 2</h4>
          </div>
          <div className="card-body">
            Longer content that wraps into multiple lines to show off how the masonry layout handles variable heights
            seamlessly!
          </div>
        </div>

        <div className="masonry-item card card-elevated">
          <div className="card-header">
            <h4 className="card-title">Item 3</h4>
          </div>
          <div className="card-body">Medium content.</div>
        </div>

        <div className="masonry-item card card-outlined">
          <div className="card-header">
            <h4 className="card-title">Item 4</h4>
          </div>
          <div className="card-body flex flex-col gap-4">
            <div className="w-full h-32 bg-surface-container rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
            </div>
            Content with image.
          </div>
        </div>

        <div className="masonry-item card-filled">
          <div className="card-header">
            <h4 className="card-title">Item 5</h4>
          </div>
          <div className="card-body">Very short.</div>
        </div>
      </div>

      {/* Universal Skeleton */}
      <h3 className="text-headline-small mb-6">Universal Skeleton Group</h3>
      <div className="skeleton-group card card-outlined p-6 max-w-md mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-surface-container shrink-0"></div>
          <div className="flex flex-col gap-1">
            <h4 className="text-title-medium">User Name</h4>
            <p className="text-body-small">user@example.com</p>
          </div>
        </div>
        <p className="text-body-medium mb-4">
          This entire block of text, the headers, and the buttons below are automatically skeletonized by simply
          applying the .skeleton-group class to the parent container.
        </p>
        <div className="flex gap-2 justify-end">
          <button className="button">Primary Action</button>
          <button className="button-tonal">Secondary</button>
        </div>
      </div>

      {/* AI Components */}
      <h3 className="text-headline-small mb-6">AI Conversational UI</h3>
      <div className="card card-outlined p-6 w-full flex flex-col gap-8 bg-surface-container-lowest">
        {/* Chat Thread */}
        <div className="ai-chat-thread">
          <div className="ai-message ai-message-user">
            <div className="ai-message-bubble">Can you help me build a React application with Material Design 3?</div>
          </div>

          <div className="ai-message ai-message-agent">
            <div className="ai-avatar">
              <span className="ai-sparkle material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div className="ai-message-bubble">
              Absolutely! I can help you with that. Material Design 3 provides a fantastic set of tokens and components
              for building beautiful, accessible React applications. Where would you like to start?
            </div>
          </div>

          <div className="ai-message ai-message-user">
            <div className="ai-message-bubble">Let's start with the AI prompt field.</div>
          </div>

          <div className="ai-message ai-message-agent">
            <div className="ai-avatar">
              <span className="ai-sparkle material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div className="ai-message-bubble">
              <div className="ai-typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Prompt Layout */}
        <div className="mt-4 flex flex-col gap-8 w-full">
          {/* Main Prompt Field */}
          <div className="ai-prompt w-full relative">
            <div className="absolute top-4 right-4 z-10">
              <button className="icon-button icon-button-standard text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="ai-prompt-attachments">
              <div className="ai-attachment">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                  alt="Person"
                />
              </div>
              <div className="ai-attachment">
                <img
                  src="https://images.unsplash.com/photo-1518908336710-4e1cf821d3d1?auto=format&fit=crop&w=200&q=80"
                  alt="Dress"
                />
              </div>
            </div>

            <textarea className="ai-prompt-textarea" placeholder="What do you want to create?"></textarea>

            <div className="ai-prompt-actions">
              <div className="flex items-center gap-2">
                <button className="icon-button icon-button-standard">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className="toggle-button">Agent</button>
              </div>
              <div className="flex items-center gap-2">
                <button className="button-tonal px-4!">
                  Video · 10s <span className="material-symbols-outlined text-[18px]!">smartphone</span> 1x
                </button>
                <button className="icon-button icon-button-tonal">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <h4 className="text-title-medium text-on-surface-variant mt-4">Popover Menus (Static Previews)</h4>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Settings Popover (Model Menu Closed) */}
            <div className="card card-elevated p-4 flex flex-col gap-4 w-72 shrink-0">
              {/* Type */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center">
                  <span className="material-symbols-outlined text-[18px]! mr-2">image</span> Image
                </button>
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  <span className="material-symbols-outlined text-[18px]! mr-2">play_circle</span> Video
                </button>
              </div>

              {/* Input Type */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center">
                  <span className="material-symbols-outlined text-[18px]! mr-2">crop_free</span> Frames
                </button>
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  <span className="material-symbols-outlined text-[18px]! mr-2">extension</span> Ingredients
                </button>
              </div>

              {/* Aspect Ratio */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  <span className="material-symbols-outlined text-[18px]! mr-2">smartphone</span> 9:16
                </button>
                <button className="segmented-button flex-1 justify-center">
                  <span className="material-symbols-outlined text-[18px]! mr-2">crop_landscape</span> 16:9
                </button>
              </div>

              {/* Speed */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  1x
                </button>
                <button className="segmented-button flex-1 justify-center">x2</button>
                <button className="segmented-button flex-1 justify-center">x3</button>
                <button className="segmented-button flex-1 justify-center">x4</button>
              </div>

              {/* Model Select Mock Trigger (Closed) */}
              <button className="button-tonal w-full justify-between">
                Omni Flash <span className="material-symbols-outlined">arrow_drop_down</span>
              </button>

              {/* Duration */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center">4s</button>
                <button className="segmented-button flex-1 justify-center">6s</button>
                <button className="segmented-button flex-1 justify-center">8s</button>
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  10s
                </button>
              </div>

              <p className="text-body-small text-center text-on-surface-variant mt-2">
                Generating will use <span className="underline cursor-pointer">15 credits</span>
              </p>
            </div>

            {/* Settings Popover (Model Menu Open) */}
            <div className="card card-elevated p-4 flex flex-col gap-4 w-72 shrink-0">
              {/* Type */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center">
                  <span className="material-symbols-outlined text-[18px]! mr-2">image</span> Image
                </button>
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  <span className="material-symbols-outlined text-[18px]! mr-2">play_circle</span> Video
                </button>
              </div>

              {/* Input Type */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center">
                  <span className="material-symbols-outlined text-[18px]! mr-2">crop_free</span> Frames
                </button>
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  <span className="material-symbols-outlined text-[18px]! mr-2">extension</span> Ingredients
                </button>
              </div>

              {/* Aspect Ratio */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  <span className="material-symbols-outlined text-[18px]! mr-2">smartphone</span> 9:16
                </button>
                <button className="segmented-button flex-1 justify-center">
                  <span className="material-symbols-outlined text-[18px]! mr-2">crop_landscape</span> 16:9
                </button>
              </div>

              {/* Speed */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  1x
                </button>
                <button className="segmented-button flex-1 justify-center">x2</button>
                <button className="segmented-button flex-1 justify-center">x3</button>
                <button className="segmented-button flex-1 justify-center">x4</button>
              </div>

              {/* Model Select Mock Trigger (Open) */}
              <div className="relative w-full">
                <button className="button-tonal w-full justify-between relative z-0">
                  Omni Flash <span className="material-symbols-outlined">arrow_drop_down</span>
                </button>

                {/* Static Model Menu Overlay positioned correctly */}
                <ul className="menu absolute bottom-full left-0 mb-1 w-full shadow-lg z-popover" data-state="open">
                  <li className="menu-item bg-surface-variant text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined mr-3">volume_up</span> Omni Flash
                  </li>
                  <li className="menu-item">
                    <span className="material-symbols-outlined mr-3">volume_up</span> Veo 3.1 - Lite
                  </li>
                  <li className="menu-item">
                    <span className="material-symbols-outlined mr-3">volume_up</span> Veo 3.1 - Fast
                  </li>
                  <li className="menu-item">
                    <span className="material-symbols-outlined mr-3">volume_up</span> Veo 3.1 - Quality
                  </li>
                </ul>
              </div>

              {/* Duration */}
              <div className="segmented-group w-full">
                <button className="segmented-button flex-1 justify-center">4s</button>
                <button className="segmented-button flex-1 justify-center">6s</button>
                <button className="segmented-button flex-1 justify-center">8s</button>
                <button className="segmented-button flex-1 justify-center" aria-selected="true">
                  10s
                </button>
              </div>

              <p className="text-body-small text-center text-on-surface-variant mt-2">
                Generating will use <span className="underline cursor-pointer">15 credits</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Asset Browser Layout</h2>
      <div className="card flex flex-col w-full max-w-5xl h-[600px] overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center gap-4 p-4">
          <div className="split-button-group split-button-tonal">
            <button className="split-button-primary">Talents</button>
            <button className="split-button-trailing">
              <span className="material-symbols-outlined">arrow_drop_down</span>
            </button>
          </div>

          <div className="search-bar search-bar-surface flex-1">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input className="search-bar-input" placeholder="Search assets" />
          </div>

          <div className="split-button-group split-button-tonal">
            <button className="split-button-primary">Recent</button>
            <button className="split-button-trailing">
              <span className="material-symbols-outlined">arrow_drop_down</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-56 flex flex-col px-4 bg-surface-container-low">
            <div className="list-view flex-1 flex flex-col gap-1 overflow-y-auto">
              <button className="list-view-item list-view-item-filled" aria-selected="true">
                <span className="material-symbols-outlined">grid_view</span>
                <span className="list-view-item-content">All</span>
              </button>
              <button className="list-view-item list-view-item-filled">
                <span className="material-symbols-outlined">image</span>
                <span className="list-view-item-content">Images</span>
              </button>
              <button className="list-view-item list-view-item-filled">
                <span className="material-symbols-outlined">videocam</span>
                <span className="list-view-item-content">Videos</span>
              </button>
              <button className="list-view-item list-view-item-filled">
                <span className="material-symbols-outlined">mic</span>
                <span className="list-view-item-content">Voices</span>
              </button>
              <button className="list-view-item list-view-item-filled">
                <span className="material-symbols-outlined">person</span>
                <span className="list-view-item-content">Characters</span>
              </button>
              <button className="list-view-item list-view-item-filled">
                <span className="material-symbols-outlined">face</span>
                <span className="list-view-item-content">Avatar</span>
              </button>
              <button className="list-view-item list-view-item-filled">
                <span className="material-symbols-outlined">upload_file</span>
                <span className="list-view-item-content">Uploads</span>
              </button>
            </div>
            <div className="mb-4 mt-2">
              <button className="button-text w-full justify-start">
                <span className="material-symbols-outlined">upload</span>
                Upload media
              </button>
            </div>
          </div>

          {/* Middle List */}
          <div className="list-view w-80 flex flex-col overflow-y-auto gap-1">
            <button className="list-view-item list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div className="list-view-item-content min-w-0">
                <span className="text-body-large truncate font-medium">Woman in Javanese atti...</span>
                <span className="list-view-item-supporting-text truncate">Image</span>
              </div>
            </button>

            <button className="list-view-item list-view-item-filled" aria-selected="true">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
              </div>
              <div className="list-view-item-content min-w-0">
                <span className="text-body-large truncate">Woman walking toward...</span>
                <span className="list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="list-view-item list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
              </div>
              <div className="list-view-item-content min-w-0">
                <span className="text-body-large truncate">Woman walking toward...</span>
                <span className="list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="list-view-item list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
              </div>
              <div className="list-view-item-content min-w-0">
                <span className="text-body-large truncate">Woman walking toward...</span>
                <span className="list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="list-view-item list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
              </div>
              <div className="list-view-item-content min-w-0">
                <span className="text-body-large truncate">Woman walking toward...</span>
                <span className="list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="list-view-item list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">image</span>
              </div>
              <div className="list-view-item-content min-w-0">
                <span className="text-body-large truncate">Woman walking on Java...</span>
                <span className="list-view-item-supporting-text truncate">Image</span>
              </div>
            </button>
          </div>

          {/* Right Preview */}
          <div className="flex-1 flex flex-col relative p-4 pt-0 gap-4">
            <div className="card-filled flex-1 overflow-hidden">
              <img src="/images/image-1.png" className="w-full h-full object-cover object-center" />
            </div>

            <button className="button button-filled w-full max-w-sm">Add to Prompt</button>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="text-headline-small mb-6">Shell Layout Preview</h2>
      {/* We use a responsive container that switches from Mobile (Bottom Nav) to Desktop (Nav Rail) */}
      <div className="relative overflow-hidden border border-outline rounded-xl h-[550px] md:h-[450px] w-full max-w-4xl bg-surface shadow-sm">
        {/* Navigation Rail (Desktop/Tablet) - Left Side Full Height */}
        <nav className="navigation-rail absolute! top-0 left-0 flex flex-col items-center py-4 px-2 bg-surface-container border-r border-outline-variant w-[80px] h-full z-20 hidden md:flex">
          <button className="icon-button mb-8">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <button className="navigation-rail-item mb-4">
            <div className="nav-rail-icon-container" aria-selected="true">
              <span className="material-symbols-outlined">home</span>
            </div>
            <span className="text-label-small mt-1">Home</span>
          </button>
          <button className="navigation-rail-item">
            <div className="nav-rail-icon-container">
              <span className="material-symbols-outlined">star</span>
            </div>
            <span className="text-label-small mt-1">Starred</span>
          </button>
        </nav>

        {/* Top App Bar */}
        <header className="app-bar absolute! top-0 right-0 left-0 md:left-[80px] flex items-center px-4 py-3 bg-surface border-b border-outline-variant z-10 h-[64px]">
          <button className="icon-button mr-4 md:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="app-bar-title text-title-large flex-1">App Layout</h1>
          <button className="icon-button">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </header>

        {/* Main Content Area */}
        <main className="absolute! top-[64px] bottom-[80px] md:bottom-0 left-0 md:left-[80px] right-0 p-6 overflow-y-auto bg-surface-container-lowest">
          <p className="text-body-large text-on-surface-variant">
            Main content area simulating a responsive page layout.
          </p>
          <p className="text-body-medium text-on-surface-variant mt-2">
            On mobile sizes, it uses the Bottom Navigation Bar. On tablet/desktop sizes, it switches to the Navigation
            Rail.
          </p>

          <div className="mt-8">
            <h3 className="text-title-medium mb-4">Carousel Preview</h3>
            <div className="carousel flex gap-4 overflow-x-auto pb-4">
              <div className="carousel-item card min-w-[200px] h-[120px] flex items-center justify-center">Card 1</div>
              <div className="carousel-item card min-w-[200px] h-[120px] flex items-center justify-center">Card 2</div>
              <div className="carousel-item card min-w-[200px] h-[120px] flex items-center justify-center">Card 3</div>
              <div className="carousel-item card min-w-[200px] h-[120px] flex items-center justify-center">Card 4</div>
            </div>
          </div>
        </main>

        {/* Navigation Bar (Mobile) - Bottom */}
        <div className="navigation-bar absolute! bottom-0 left-0 right-0 flex justify-around bg-surface-container border-t border-outline-variant py-2 px-4 h-[80px] z-20 md:hidden">
          <button className="navigation-bar-item flex flex-col items-center justify-center flex-1">
            <div className="nav-icon-container" aria-selected="true">
              <span className="material-symbols-outlined">home</span>
            </div>
            <span className="text-label-small mt-1">Home</span>
          </button>
          <button className="navigation-bar-item flex flex-col items-center justify-center flex-1">
            <div className="nav-icon-container">
              <span className="material-symbols-outlined">search</span>
            </div>
            <span className="text-label-small mt-1">Search</span>
          </button>
          <button className="navigation-bar-item flex flex-col items-center justify-center flex-1">
            <div className="nav-icon-container">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <span className="text-label-small mt-1">Profile</span>
          </button>
        </div>

        {/* Bottom Sheet (Peer) */}
        <div className="peer absolute inset-x-0 md:left-[80px] bottom-0 bg-surface-container-low rounded-t-[28px] px-6 pt-4 pb-8 translate-y-[calc(100%-36px)] hover:translate-y-0 transition-transform duration-300 cursor-pointer z-30">
          <div className="w-8 h-1 bg-on-surface-variant rounded-full mx-auto mb-4 opacity-40"></div>
          <h3 className="text-title-medium mb-2">Bottom Sheet</h3>
          <p className="text-body-medium text-on-surface-variant">
            Hover me to slide up! The drag handle is now perfectly balanced vertically, and the sheet properly aligns
            with the main content area.
          </p>
        </div>

        {/* Scrim Backdrop */}
        <div className="absolute inset-0 md:left-[80px] bg-black opacity-0 peer-hover:opacity-[0.32] transition-opacity duration-300 z-20 pointer-events-none"></div>
      </div>
    </section>
  </div>
));
export default MaterialPage;
