import { Meta, page, Title } from '@anchorlib/react';
import { materialRoute } from './route.js';

export const MaterialPage = page(materialRoute).render(() => (
  <div className="p-8 w-full max-w-5xl mx-auto text-left">
    <Title>Material Design 3 CSS Utilities</Title>
    <Meta name="description" content="Material Design 3 Components Showcase" />

    <h1 className="air-display-md mb-12">M3 CSS Utilities</h1>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Typography</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="air-label-sm text-on-surface-variant">Display</span>
            <div className="air-display-lg">Display Large</div>
            <div className="air-display-md">Display Medium</div>
            <div className="air-display-sm">Display Small</div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="air-label-sm text-on-surface-variant">Headline</span>
            <div className="air-headline-lg">Headline Large</div>
            <div className="air-headline-md">Headline Medium</div>
            <div className="air-headline-sm">Headline Small</div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="air-label-sm text-on-surface-variant">Title</span>
            <div className="air-title-lg">Title Large</div>
            <div className="air-title-md">Title Medium</div>
            <div className="air-title-sm">Title Small</div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="air-label-sm text-on-surface-variant">Body</span>
            <div className="air-body-lg">Body Large</div>
            <div className="air-body-md">Body Medium</div>
            <div className="air-body-sm">Body Small</div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="air-label-sm text-on-surface-variant">Label</span>
            <div className="air-label-lg">Label Large</div>
            <div className="air-label-md">Label Medium</div>
            <div className="air-label-sm">Label Small</div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Buttons</h2>
      <div className="flex gap-4 flex-wrap items-center mb-8">
        <button type="button" className="air-button">
          Filled
        </button>
        <button type="button" className="air-button-elevated">
          Elevated
        </button>
        <button type="button" className="air-button-tonal">
          Tonal
        </button>
        <button type="button" className="air-button-outlined">
          Outlined
        </button>
        <button type="button" className="air-button-text">
          Text
        </button>
      </div>

      <h3 className="air-title-md mb-4 text-on-surface-variant">With Icons</h3>
      <div className="flex gap-4 flex-wrap items-center mb-8">
        <button type="button" className="air-button">
          <span className="air-icon text-[18px]">add</span>
          Leading
        </button>
        <button type="button" className="air-button-elevated">
          Trailing
          <span className="air-icon text-[18px]">arrow_forward</span>
        </button>
        <button type="button" className="air-button-tonal">
          <span className="air-icon text-[18px]">favorite</span>
          Both
          <span className="air-icon text-[18px]">close</span>
        </button>
        <button type="button" className="air-button-outlined">
          <span className="air-icon text-[18px]">search</span>
          Search
        </button>
      </div>

      <h3 className="air-title-md mb-4 text-on-surface-variant">Groups & Split</h3>
      <div className="flex gap-8 flex-wrap items-center mb-8">
        <div className="air-button-group">
          <button type="button" className="air-button-tonal">
            Cancel
          </button>
          <button type="button" className="air-button-tonal">
            Discard
          </button>
          <button type="button" className="air-button-tonal">
            Save
          </button>
        </div>
        <div className="air-split-button-group air-split-button-tonal">
          <button type="button" className="air-split-button-primary">
            Publish
          </button>
          <button type="button" className="air-split-button-trailing">
            <span className="air-icon">arrow_drop_down</span>
          </button>
        </div>
      </div>

      <h3 className="air-title-md mb-4 text-on-surface-variant">Sizes</h3>
      <div className="flex gap-4 flex-wrap items-center">
        <button type="button" className="air-button-tonal air-button-xs">
          Extra Small
        </button>
        <button type="button" className="air-button-tonal air-button-sm">
          Small
        </button>
        <button type="button" className="air-button-tonal air-button-md">
          Medium
        </button>
        <button type="button" className="air-button-tonal air-button-lg">
          Large
        </button>
        <button type="button" className="air-button-tonal air-button-xl">
          Extra Large
        </button>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="air-card">
          <div className="air-card-header">
            <h3 className="air-card-title">Default</h3>
          </div>
          <div className="air-card-body">surface-container-low + shadow</div>
        </div>
        <div className="air-card-filled">
          <div className="air-card-header">
            <h3 className="air-card-title">Filled</h3>
          </div>
          <div className="air-card-body">surface-container-highest</div>
        </div>
        <div className="air-card-outlined">
          <div className="air-card-header">
            <h3 className="air-card-title">Outlined</h3>
          </div>
          <div className="air-card-body">surface + outline</div>
        </div>
      </div>

      <h3 className="air-title-md mt-12 mb-4 text-on-surface-variant">Segmented Card Group</h3>
      <div className="air-card-group max-w-sm">
        <div className="air-card">
          <div className="air-card-header">
            <h4 className="air-card-title">Header Card</h4>
          </div>
          <div className="air-card-body">This is the first segment of the card group. It has a large top radius.</div>
        </div>

        <div className="air-card">
          <div className="air-card-header">
            <h4 className="air-card-title">Middle Card</h4>
          </div>
          <div className="air-card-body">
            This segment sits in the middle and uses the small inner radius on all corners.
          </div>
        </div>

        <div className="air-card">
          <div className="air-card-header">
            <h4 className="air-card-title">Footer Card</h4>
          </div>
          <div className="air-card-body">This is the final segment with a large bottom radius.</div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Text Fields</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mb-12">
        <div className="air-text-field">
          <input id="tf-d1" className="air-text-field-input" placeholder=" " />
          <label htmlFor="tf-d1" className="air-text-field-label">
            Outlined Input
          </label>
          <span className="air-text-field-supporting-text">Supporting text</span>
        </div>
        <div className="air-text-field">
          <input id="tf-d2" className="air-text-field-input-filled" placeholder=" " />
          <label htmlFor="tf-d2" className="air-text-field-label">
            Filled Input
          </label>
          <span className="air-text-field-supporting-text">Supporting text</span>
        </div>

        <div className="air-text-field">
          <span className="air-icon absolute left-4 top-[16px] text-on-surface-variant z-10 pointer-events-none">
            search
          </span>
          <input id="tf-d3" className="air-text-field-input" placeholder=" " />
          <label htmlFor="tf-d3" className="air-text-field-label">
            With Leading Icon
          </label>
        </div>

        <div className="air-text-field">
          <input id="tf-d4" className="air-text-field-input" placeholder=" " />
          <label htmlFor="tf-d4" className="air-text-field-label">
            With Trailing Icon
          </label>
          <button type={'button'} className="air-icon-button absolute right-2 top-[8px] text-on-surface-variant z-10">
            <span className="air-icon">visibility</span>
          </button>
        </div>
      </div>

      <h3 className="air-title-md mb-4 text-on-surface-variant">Sizes (Outlined)</h3>
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="air-text-field air-text-field-sm">
          <input id="tf-s1" className="air-text-field-input" placeholder=" " />
          <label htmlFor="tf-s1" className="air-text-field-label">
            Small
          </label>
        </div>
        <div className="air-text-field air-text-field-md">
          <input id="tf-s2" className="air-text-field-input" placeholder=" " />
          <label htmlFor="tf-s2" className="air-text-field-label">
            Medium
          </label>
        </div>
        <div className="air-text-field air-text-field-lg">
          <input id="tf-s3" className="air-text-field-input" placeholder=" " />
          <label htmlFor="tf-s3" className="air-text-field-label">
            Large
          </label>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Chips</h2>
      <div className="flex gap-4 flex-wrap items-center mb-8">
        <div className="air-chip">Outlined Chip</div>
        <div className="air-chip-elevated">Elevated Chip</div>
        <button role="checkbox" className="air-chip" aria-checked="true">
          Selected Chip
        </button>
      </div>

      <h3 className="air-title-md mb-4 text-on-surface-variant">Sizes</h3>
      <div className="flex gap-4 flex-wrap items-center">
        <div className="air-chip air-chip-sm">Small Chip</div>
        <div className="air-chip air-chip-md">Medium Chip</div>
        <div className="air-chip air-chip-lg">Large Chip</div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Floating Action Buttons</h2>
      <div className="flex gap-6 flex-wrap items-center mb-8">
        <button type="button" className="air-fab">
          1
        </button>
        <button type="button" className="air-fab-surface">
          2
        </button>
        <button type="button" className="air-fab-secondary">
          3
        </button>
        <button type="button" className="air-fab-tertiary">
          4
        </button>
        <button type="button" className="air-fab air-fab-extended">
          Extended FAB
        </button>
      </div>

      <h3 className="air-title-md mb-4 text-on-surface-variant">Sizes</h3>
      <div className="flex gap-6 flex-wrap items-end">
        <button type="button" className="air-fab-secondary air-fab-sm">
          S
        </button>
        <button type="button" className="air-fab-secondary">
          M
        </button>
        <button type="button" className="air-fab-secondary air-fab-lg">
          L
        </button>
      </div>

      <h3 className="air-title-md mt-8 mb-4 text-on-surface-variant">FAB Menu (Speed Dial)</h3>
      <div className="flex justify-start pl-4 min-h-[240px] items-end">
        <div className="air-fab-menu" data-state="open">
          <div className="air-fab-menu-list">
            <button type="button" className="air-fab-secondary air-fab-sm air-fab-menu-item">
              <span className="air-icon">edit</span>
            </button>
            <button type="button" className="air-fab-secondary air-fab-sm air-fab-menu-item">
              <span className="air-icon">share</span>
            </button>
            <button type="button" className="air-fab-secondary air-fab-sm air-fab-menu-item">
              <span className="air-icon">delete</span>
            </button>
          </div>
          <button type="button" className="air-fab air-fab-menu-trigger" data-state="open">
            <span className="air-icon">add</span>
          </button>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Badges & Progress</h2>
      <div className="flex gap-8 flex-wrap items-center">
        <div className="air-badge-container">
          <button className="air-button-tonal">Notifications</button>
          <span className="air-badge-dot" />
        </div>
        <div className="air-badge-container">
          <button className="air-button-tonal">Messages</button>
          <span className="air-badge">3</span>
        </div>
        <div className="w-48">
          <div className="air-progress-linear">
            <div className="air-progress-linear-bar air-progress-linear-primary" style={{ width: '45%' }} />
          </div>
        </div>
        <div className="air-progress-circular air-progress-circular-indeterminate">
          <svg viewBox="22 22 44 44" className="w-full h-full">
            <circle
              className="air-progress-circular-circle air-progress-circular-circle-indeterminate air-progress-circular-primary"
              cx="44"
              cy="44"
              r="20"
            />
          </svg>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Selection Controls</h2>
      <div className="flex gap-8 flex-wrap items-center">
        <div className="flex gap-4">
          <button type="button" role="checkbox" aria-checked="true" className="air-checkbox-container">
            <span className="air-checkbox air-checkbox-checked">
              <svg className="air-checkbox-icon air-checkbox-checked-icon" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <svg className="air-checkbox-icon air-checkbox-indeterminate-icon hidden" viewBox="0 0 24 24">
                <path d="M6 11h12v2H6z" />
              </svg>
            </span>
          </button>
          <button type="button" role="checkbox" aria-checked="mixed" className="air-checkbox-container">
            <span className="air-checkbox air-checkbox-indeterminate">
              <svg className="air-checkbox-icon air-checkbox-checked-icon hidden" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <svg className="air-checkbox-icon air-checkbox-indeterminate-icon" viewBox="0 0 24 24">
                <path d="M6 11h12v2H6z" />
              </svg>
            </span>
          </button>
          <button type="button" role="checkbox" aria-checked="false" className="air-checkbox-container">
            <span className="air-checkbox">
              <svg className="air-checkbox-icon air-checkbox-checked-icon hidden" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <svg className="air-checkbox-icon air-checkbox-indeterminate-icon hidden" viewBox="0 0 24 24">
                <path d="M6 11h12v2H6z" />
              </svg>
            </span>
          </button>
        </div>
        <div className="flex gap-4">
          <button type="button" role="radio" aria-checked="true" className="air-radio">
            <span className="air-radio-visual air-radio-checked">
              <span className="air-radio-visual-dot air-radio-checked-dot" />
            </span>
          </button>
          <button type="button" role="radio" aria-checked="false" className="air-radio">
            <span className="air-radio-visual">
              <span className="air-radio-visual-dot" />
            </span>
          </button>
        </div>
        <div className="flex gap-4">
          <button type="button" role="switch" className="air-switch" aria-checked="true">
            <span className="air-switch-thumb">
              <svg className="air-switch-icon air-switch-icon-checked" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            </span>
          </button>
          <button type="button" role="switch" className="air-switch" aria-checked="false">
            <span className="air-switch-thumb">
              <svg className="air-switch-icon" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Sliders</h2>
      <div className="max-w-md flex items-center h-12">
        <input type="range" className="air-slider-primary" min="0" max="100" defaultValue="40" />
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Icon & Segmented Buttons</h2>
      <div className="flex gap-8 flex-wrap items-center mb-8">
        <div className="flex gap-2">
          <button className="air-icon-button">
            <span className="air-icon">star</span>
          </button>
          <button className="air-icon-button-filled">
            <span className="air-icon">star</span>
          </button>
          <button className="air-icon-button-tonal">
            <span className="air-icon">star</span>
          </button>
          <button className="air-icon-button-outlined">
            <span className="air-icon">star</span>
          </button>
        </div>
        <div className="air-segmented-group">
          <button className="air-segmented-button" aria-pressed="true">
            Day
          </button>
          <button className="air-segmented-button">Week</button>
          <button className="air-segmented-button">Month</button>
        </div>
      </div>

      <h3 className="air-title-md mb-4 text-on-surface-variant">Icon Button Sizes</h3>
      <div className="flex gap-4 flex-wrap items-center">
        <button className="air-icon-button-tonal air-icon-button-xs">
          <span className="air-icon">star</span>
        </button>
        <button className="air-icon-button-tonal air-icon-button-sm">
          <span className="air-icon">star</span>
        </button>
        <button className="air-icon-button-tonal air-icon-button-md">
          <span className="air-icon">star</span>
        </button>
        <button className="air-icon-button-tonal air-icon-button-lg">
          <span className="air-icon">star</span>
        </button>
        <button className="air-icon-button-tonal air-icon-button-xl">
          <span className="air-icon">star</span>
        </button>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Menus, Lists & Dialogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col">
          <h3 className="air-title-md mb-4">Segmented List</h3>
          <div className="air-list-view">
            <div role="menuitem" className="air-list-view-item air-list-view-item-filled" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="air-icon text-on-tertiary-container">music_note</span>
              </div>
              <div className="air-list-view-item-content">
                <span className="air-title-md text-on-surface">Your Likes</span>
                <span className="air-list-view-item-supporting-text flex items-center gap-1">
                  <span className="air-icon text-[14px]!">push_pin</span>
                  Auto playlist
                </span>
              </div>
              <button className="air-icon-button ml-4 shrink-0">
                <span className="air-icon">more_vert</span>
              </button>
            </div>
            <div role="menuitem" className="air-list-view-item air-list-view-item-filled" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-secondary-container flex items-center justify-center shrink-0">
                <span className="air-icon text-on-secondary-container">album</span>
              </div>
              <div className="air-list-view-item-content">
                <span className="air-title-md text-on-surface">Party Mix</span>
                <span className="air-list-view-item-supporting-text">Daisy Chain • 16 songs</span>
              </div>
              <button className="air-icon-button ml-4 shrink-0">
                <span className="air-icon">more_vert</span>
              </button>
            </div>
            <div role="menuitem" className="air-list-view-item air-list-view-item-filled" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-primary-container flex items-center justify-center shrink-0">
                <span className="air-icon text-on-primary-container">description</span>
              </div>
              <div className="air-list-view-item-content">
                <span className="air-title-md text-on-surface">Documents</span>
                <span className="air-list-view-item-supporting-text">Updated 2 days ago</span>
              </div>
              <button className="air-icon-button ml-4 shrink-0">
                <span className="air-icon">more_vert</span>
              </button>
            </div>
          </div>

          <h3 className="air-title-md mb-4 mt-8">Filled List (No Segments)</h3>
          <div className="air-list-view air-list-view-filled">
            <div role="menuitem" className="air-list-view-item" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="air-icon text-on-tertiary-container">music_note</span>
              </div>
              <div className="air-list-view-item-content">
                <span className="air-title-md text-on-surface">Your Likes</span>
                <span className="air-list-view-item-supporting-text flex items-center gap-1">Auto playlist</span>
              </div>
            </div>
            <div role="menuitem" className="air-list-view-item" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-secondary-container flex items-center justify-center shrink-0">
                <span className="air-icon text-on-secondary-container">album</span>
              </div>
              <div className="air-list-view-item-content">
                <span className="air-title-md text-on-surface">Party Mix</span>
                <span className="air-list-view-item-supporting-text">Daisy Chain • 16 songs</span>
              </div>
            </div>
            <div role="menuitem" className="air-list-view-item" tabIndex={0}>
              <div className="w-14 h-14 rounded-md bg-primary-container flex items-center justify-center shrink-0">
                <span className="air-icon text-on-primary-container">description</span>
              </div>
              <div className="air-list-view-item-content">
                <span className="air-title-md text-on-surface">Documents</span>
                <span className="air-list-view-item-supporting-text">Updated 2 days ago</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="air-title-md mb-4">Static Dialog Preview</h3>
          <div role="dialog" className="air-dialog-body relative max-w-sm mx-0" aria-hidden="false">
            <div className="air-dialog-header">
              <h2 className="air-dialog-title mb-0">Dialog Title</h2>
            </div>
            <div className="air-dialog-content">This is a static preview of the dialog surface.</div>
            <div className="air-dialog-footer">
              <button className="air-button-text">Cancel</button>
              <button className="air-button">Confirm</button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden relative min-h-[300px]">
          <div className="p-4">
            <h3 className="air-title-md mb-4">Side Sheet Preview</h3>
            <p className="air-body-md text-on-surface-variant">Main content area</p>
          </div>
          <div className="air-side-sheet-scrim absolute" data-state="open" style={{ position: 'absolute' }}></div>
          <div
            className="air-side-sheet air-side-sheet-right air-side-sheet-surface absolute"
            data-state="open"
            style={{ position: 'absolute', maxWidth: '60%' }}
          >
            <div className="p-4">
              <h4 className="air-title-sm mb-4">Sheet Content</h4>
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
      <h2 className="air-headline-sm mb-6">Data Table (Segmented)</h2>
      <div className="w-full overflow-x-auto pb-4">
        <table className="air-table-view min-w-[600px]">
          <thead>
            <tr>
              <th className="air-table-header-cell">Name</th>
              <th className="air-table-header-cell">Role</th>
              <th className="air-table-header-cell">Status</th>
              <th className="air-table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="air-table-row-filled" tabIndex={0}>
              <td className="air-table-cell">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                    A
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-on-surface">Alice Johnson</span>
                    <span className="air-body-sm text-on-surface-variant">alice@example.com</span>
                  </div>
                </div>
              </td>
              <td className="air-table-cell">Admin</td>
              <td className="air-table-cell">
                <span className="air-chip air-chip-tonal text-xs h-6">Active</span>
              </td>
              <td className="air-table-cell text-right">
                <button className="air-icon-button air-icon-button-standard">
                  <span className="air-icon">edit</span>
                </button>
              </td>
            </tr>
            <tr className="air-table-row-filled" tabIndex={0} aria-selected="true">
              <td className="air-table-cell">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    B
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-on-surface">Bob Smith</span>
                    <span className="air-body-sm text-on-surface-variant">bob.smith@example.com</span>
                  </div>
                </div>
              </td>
              <td className="air-table-cell">Editor</td>
              <td className="air-table-cell">
                <span className="air-chip air-chip-tonal text-xs h-6">Active</span>
              </td>
              <td className="air-table-cell text-right">
                <button className="air-icon-button air-icon-button-standard">
                  <span className="air-icon">edit</span>
                </button>
              </td>
            </tr>
            <tr className="air-table-row-filled" tabIndex={0}>
              <td className="air-table-cell">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                    C
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-on-surface">Charlie Davis</span>
                    <span className="air-body-sm text-on-surface-variant">charlie.d@example.com</span>
                  </div>
                </div>
              </td>
              <td className="air-table-cell">Viewer</td>
              <td className="air-table-cell">
                <span className="air-chip bg-surface-variant text-on-surface-variant text-xs h-6">Offline</span>
              </td>
              <td className="air-table-cell text-right">
                <button className="air-icon-button air-icon-button-standard">
                  <span className="air-icon">edit</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Tabs & Accordion</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="air-tab flex-1">
          <div role="tablist" className="air-tab-list">
            <button role="tab" className="air-tab-item" aria-selected="true">
              Flight
              <div className="air-tab-indicator w-full" />
            </button>
            <button role="tab" className="air-tab-item" aria-selected="false">
              Hotel
            </button>
            <button role="tab" className="air-tab-item" aria-selected="false">
              Car
            </button>
          </div>
          <div role="tabpanel" className="air-tab-content p-4 air-body-md text-on-surface-variant">
            Tab content goes here.
          </div>
        </div>

        <div className="flex-1">
          <div className="air-accordion-group">
            <div className="air-accordion-item">
              <button className="air-accordion-header" aria-expanded="true">
                Accordion Item 1
                <span className="air-icon transition-transform duration-200" style={{ transform: 'rotate(180deg)' }}>
                  expand_more
                </span>
              </button>
              <div className="air-accordion-content" data-state="open">
                <div className="air-accordion-inner air-body-md text-on-surface-variant">
                  This is the content for the first accordion item.
                </div>
              </div>
            </div>

            <div className="air-accordion-item">
              <button className="air-accordion-header" aria-expanded="false">
                Accordion Item 2<span className="air-icon transition-transform duration-200">expand_more</span>
              </button>
              <div className="air-accordion-content" data-state="closed">
                <div className="air-accordion-inner air-body-md text-on-surface-variant">
                  This is the content for the second accordion item.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Pickers & Inputs</h2>
      <div className="flex flex-wrap gap-8 items-start">
        <div className="flex flex-col min-w-[320px]">
          <h3 className="air-title-md mb-4">Date Picker</h3>
          <div className="air-date-picker">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="air-label-lg">June 2026</span>
              <div className="flex gap-2">
                <button className="air-icon-button">
                  <span className="air-icon">chevron_left</span>
                </button>
                <button className="air-icon-button">
                  <span className="air-icon">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2 px-2">
              <span className="air-label-sm">S</span>
              <span className="air-label-sm">M</span>
              <span className="air-label-sm">T</span>
              <span className="air-label-sm">W</span>
              <span className="air-label-sm">T</span>
              <span className="air-label-sm">F</span>
              <span className="air-label-sm">S</span>
            </div>
            <div className="air-date-picker-grid grid grid-cols-7 gap-1 px-2">
              <button className="air-date-picker-cell air-body-sm">1</button>
              <button className="air-date-picker-cell air-body-sm">2</button>
              <button className="air-date-picker-cell air-body-sm">3</button>
              <button role="gridcell" className="air-date-picker-cell air-body-sm" aria-selected="true">
                4
              </button>
              <button className="air-date-picker-cell air-body-sm air-date-picker-cell-today">5</button>
              <button className="air-date-picker-cell air-body-sm">6</button>
              <button className="air-date-picker-cell air-body-sm">7</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-w-[280px]">
          <h3 className="air-title-md mb-4">Time Picker</h3>
          <div className="air-time-picker">
            <div className="flex items-center justify-center gap-2 mb-6">
              <button role="option" className="air-time-picker-unit" aria-selected="true">
                12
              </button>
              <div className="air-time-picker-separator air-display-md">:</div>
              <div className="air-time-picker-unit">00</div>
            </div>
            <div className="flex justify-center">
              <div className="air-segmented-group">
                <button className="air-segmented-button" aria-pressed="true">
                  AM
                </button>
                <button className="air-segmented-button">PM</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 min-w-[280px] pt-4">
          <div className="air-search-bar relative">
            <span className="air-icon-button absolute left-2 top-2">
              <span className="air-icon">search</span>
            </span>
            <input type="text" className="air-search-bar-input pl-14" placeholder="Search..." />
          </div>

          <div className="relative">
            <button className="w-full flex items-center justify-between bg-surface-variant text-on-surface-variant px-4 py-3 h-[56px] rounded-t-md border-b border-on-surface-variant hover:bg-surface-variant/80 transition-colors">
              Select Option
              <span className="air-icon">arrow_drop_down</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Overlays & Notifications</h2>
      <div className="flex gap-8 flex-wrap items-start">
        <div className="air-snackbar flex items-center justify-between min-w-[300px]" data-state="visible">
          Single-line snackbar
          <button className="air-snackbar-action ml-4 font-medium">Action</button>
        </div>

        <div className="air-tooltip-plain relative! mt-2" data-state="visible">
          Plain tooltip
        </div>

        <div className="air-tooltip-rich relative! max-w-xs" data-state="visible">
          <h4 className="air-title-sm mb-1">Rich Tooltip</h4>
          <p className="air-body-sm">
            This is a rich tooltip that provides more detailed information and context about an element.
          </p>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-display-sm mb-8">Extensions</h2>

      {/* Masonry */}
      <h3 className="air-headline-sm mb-6">Masonry Layout</h3>
      <div className="air-masonry mb-16 w-full max-w-5xl">
        <div className="air-masonry-item air-card air-card-outlined">
          <div className="air-card-header">
            <h4 className="air-card-title">Item 1</h4>
          </div>
          <div className="air-card-body">Short content.</div>
        </div>

        <div className="air-masonry-item air-card-filled">
          <div className="air-card-header">
            <h4 className="air-card-title">Item 2</h4>
          </div>
          <div className="air-card-body">
            Longer content that wraps into multiple lines to show off how the masonry layout handles variable heights
            seamlessly!
          </div>
        </div>

        <div className="air-masonry-item air-card air-card-elevated">
          <div className="air-card-header">
            <h4 className="air-card-title">Item 3</h4>
          </div>
          <div className="air-card-body">Medium content.</div>
        </div>

        <div className="air-masonry-item air-card air-card-outlined">
          <div className="air-card-header">
            <h4 className="air-card-title">Item 4</h4>
          </div>
          <div className="air-card-body flex flex-col gap-4">
            <div className="w-full h-32 bg-surface-container rounded-lg flex items-center justify-center shrink-0">
              <span className="air-icon text-4xl text-on-surface-variant">image</span>
            </div>
            Content with image.
          </div>
        </div>

        <div className="air-masonry-item air-card-filled">
          <div className="air-card-header">
            <h4 className="air-card-title">Item 5</h4>
          </div>
          <div className="air-card-body">Very short.</div>
        </div>
      </div>

      {/* Universal Skeleton */}
      <h3 className="air-headline-sm mb-6">Universal Skeleton Group</h3>
      <div className="air-skeleton-group air-card air-card-outlined p-6 max-w-md mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-surface-container shrink-0"></div>
          <div className="flex flex-col gap-1">
            <h4 className="air-title-md">User Name</h4>
            <p className="air-body-sm">user@example.com</p>
          </div>
        </div>
        <p className="air-body-md mb-4">
          This entire block of text, the headers, and the buttons below are automatically skeletonized by simply
          applying the .air-skeleton-group class to the parent container.
        </p>
        <div className="flex gap-2 justify-end">
          <button className="air-button">Primary Action</button>
          <button className="air-button-tonal">Secondary</button>
        </div>
      </div>

      {/* AI Components */}
      <h3 className="air-headline-sm mb-6">AI Conversational UI</h3>
      <div className="air-card air-card-outlined p-6 w-full flex flex-col gap-8 bg-surface-container-lowest">
        {/* Chat Thread */}
        <div className="air-ai-chat-thread">
          <div className="air-ai-message air-ai-message-user">
            <div className="air-ai-message-bubble">
              Can you help me build a React application with Material Design 3?
            </div>
          </div>

          <div className="air-ai-message air-ai-message-agent">
            <div className="air-ai-avatar">
              <span className="air-ai-sparkle air-icon text-[20px]">auto_awesome</span>
            </div>
            <div className="air-ai-message-bubble">
              Absolutely! I can help you with that. Material Design 3 provides a fantastic set of tokens and components
              for building beautiful, accessible React applications. Where would you like to start?
            </div>
          </div>

          <div className="air-ai-message air-ai-message-user">
            <div className="air-ai-message-bubble">Let's start with the AI prompt field.</div>
          </div>

          <div className="air-ai-message air-ai-message-agent">
            <div className="air-ai-avatar">
              <span className="air-ai-sparkle air-icon text-[20px]">auto_awesome</span>
            </div>
            <div className="air-ai-message-bubble">
              <div className="air-ai-typing-indicator">
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
          <div className="air-ai-prompt w-full relative">
            <div className="absolute top-4 right-4 z-10">
              <button className="air-icon-button air-icon-button-standard text-on-surface-variant hover:text-on-surface">
                <span className="air-icon">close</span>
              </button>
            </div>

            <div className="air-ai-prompt-attachments">
              <div className="air-ai-attachment">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                  alt="Person"
                />
              </div>
              <div className="air-ai-attachment">
                <img
                  src="https://images.unsplash.com/photo-1518908336710-4e1cf821d3d1?auto=format&fit=crop&w=200&q=80"
                  alt="Dress"
                />
              </div>
            </div>

            <textarea className="air-ai-prompt-textarea" placeholder="What do you want to create?"></textarea>

            <div className="air-ai-prompt-actions">
              <div className="flex items-center gap-2">
                <button className="air-icon-button air-icon-button-standard">
                  <span className="air-icon">add</span>
                </button>
                <button className="air-toggle-button">Agent</button>
              </div>
              <div className="flex items-center gap-2">
                <button className="air-button-tonal px-4!">
                  Video · 10s <span className="air-icon text-[18px]!">smartphone</span> 1x
                </button>
                <button className="air-icon-button air-icon-button-tonal">
                  <span className="air-icon">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <h4 className="air-title-md text-on-surface-variant mt-4">Popover Menus (Static Previews)</h4>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Settings Popover (Model Menu Closed) */}
            <div className="air-card air-card-elevated p-4 flex flex-col gap-4 w-72 shrink-0">
              {/* Type */}
              <div className="air-segmented-group w-full">
                <button className="air-segmented-button flex-1 justify-center">
                  <span className="air-icon text-[18px]! mr-2">image</span> Image
                </button>
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  <span className="air-icon text-[18px]! mr-2">play_circle</span> Video
                </button>
              </div>

              {/* Input Type */}
              <div className="air-segmented-group w-full">
                <button className="air-segmented-button flex-1 justify-center">
                  <span className="air-icon text-[18px]! mr-2">crop_free</span> Frames
                </button>
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  <span className="air-icon text-[18px]! mr-2">extension</span> Ingredients
                </button>
              </div>

              {/* Aspect Ratio */}
              <div className="air-segmented-group w-full">
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  <span className="air-icon text-[18px]! mr-2">smartphone</span> 9:16
                </button>
                <button className="air-segmented-button flex-1 justify-center">
                  <span className="air-icon text-[18px]! mr-2">crop_landscape</span> 16:9
                </button>
              </div>

              {/* Speed */}
              <div className="air-segmented-group w-full">
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  1x
                </button>
                <button className="air-segmented-button flex-1 justify-center">x2</button>
                <button className="air-segmented-button flex-1 justify-center">x3</button>
                <button className="air-segmented-button flex-1 justify-center">x4</button>
              </div>

              {/* Model Select Mock Trigger (Closed) */}
              <button className="air-button-tonal w-full justify-between">
                Omni Flash <span className="air-icon">arrow_drop_down</span>
              </button>

              {/* Duration */}
              <div className="air-segmented-group w-full">
                <button className="air-segmented-button flex-1 justify-center">4s</button>
                <button className="air-segmented-button flex-1 justify-center">6s</button>
                <button className="air-segmented-button flex-1 justify-center">8s</button>
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  10s
                </button>
              </div>

              <p className="air-body-sm text-center text-on-surface-variant mt-2">
                Generating will use <span className="underline cursor-pointer">15 credits</span>
              </p>
            </div>

            {/* Settings Popover (Model Menu Open) */}
            <div className="air-card air-card-elevated p-4 flex flex-col gap-4 w-72 shrink-0">
              {/* Type */}
              <div className="air-segmented-group w-full">
                <button className="air-segmented-button flex-1 justify-center">
                  <span className="air-icon text-[18px]! mr-2">image</span> Image
                </button>
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  <span className="air-icon text-[18px]! mr-2">play_circle</span> Video
                </button>
              </div>

              {/* Input Type */}
              <div className="air-segmented-group w-full">
                <button className="air-segmented-button flex-1 justify-center">
                  <span className="air-icon text-[18px]! mr-2">crop_free</span> Frames
                </button>
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  <span className="air-icon text-[18px]! mr-2">extension</span> Ingredients
                </button>
              </div>

              {/* Aspect Ratio */}
              <div className="air-segmented-group w-full">
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  <span className="air-icon text-[18px]! mr-2">smartphone</span> 9:16
                </button>
                <button className="air-segmented-button flex-1 justify-center">
                  <span className="air-icon text-[18px]! mr-2">crop_landscape</span> 16:9
                </button>
              </div>

              {/* Speed */}
              <div className="air-segmented-group w-full">
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  1x
                </button>
                <button className="air-segmented-button flex-1 justify-center">x2</button>
                <button className="air-segmented-button flex-1 justify-center">x3</button>
                <button className="air-segmented-button flex-1 justify-center">x4</button>
              </div>

              {/* Model Select Mock Trigger (Open) */}
              <div className="relative w-full">
                <button className="air-button-tonal w-full justify-between relative z-0">
                  Omni Flash <span className="air-icon">arrow_drop_down</span>
                </button>

                {/* Static Model Menu Overlay positioned correctly */}
                <ul
                  className="air-menu isolate absolute bottom-full left-0 mb-1 w-full shadow-lg z-popover"
                  data-state="open"
                >
                  <li className="air-menu-item bg-surface-variant text-on-surface-variant font-medium">
                    <span className="air-icon mr-3">volume_up</span> Omni Flash
                  </li>
                  <li className="air-menu-item">
                    <span className="air-icon mr-3">volume_up</span> Veo 3.1 - Lite
                  </li>
                  <li className="air-menu-item">
                    <span className="air-icon mr-3">volume_up</span> Veo 3.1 - Fast
                  </li>
                  <li className="air-menu-item">
                    <span className="air-icon mr-3">volume_up</span> Veo 3.1 - Quality
                  </li>
                </ul>
              </div>

              {/* Duration */}
              <div className="air-segmented-group w-full">
                <button className="air-segmented-button flex-1 justify-center">4s</button>
                <button className="air-segmented-button flex-1 justify-center">6s</button>
                <button className="air-segmented-button flex-1 justify-center">8s</button>
                <button role="radio" className="air-segmented-button flex-1 justify-center" aria-checked="true">
                  10s
                </button>
              </div>

              <p className="air-body-sm text-center text-on-surface-variant mt-2">
                Generating will use <span className="underline cursor-pointer">15 credits</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Asset Browser Layout</h2>
      <div className="air-card flex flex-col w-full max-w-5xl h-[600px] overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center gap-4 p-4">
          <div className="air-split-button-group air-split-button-tonal">
            <button className="air-split-button-primary">Talents</button>
            <button className="air-split-button-trailing">
              <span className="air-icon">arrow_drop_down</span>
            </button>
          </div>

          <div className="air-search-bar air-search-bar-surface flex-1">
            <span className="air-icon text-on-surface-variant">search</span>
            <input className="air-search-bar-input" placeholder="Search assets" />
          </div>

          <div className="air-split-button-group air-split-button-tonal">
            <button className="air-split-button-primary">Recent</button>
            <button className="air-split-button-trailing">
              <span className="air-icon">arrow_drop_down</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-56 flex flex-col px-4 bg-surface-container-low">
            <div className="air-list-view flex-1 flex flex-col gap-1 overflow-y-auto">
              <button role="option" className="air-list-view-item air-list-view-item-filled" aria-selected="true">
                <span className="air-icon">grid_view</span>
                <span className="air-list-view-item-content">All</span>
              </button>
              <button className="air-list-view-item air-list-view-item-filled">
                <span className="air-icon">image</span>
                <span className="air-list-view-item-content">Images</span>
              </button>
              <button className="air-list-view-item air-list-view-item-filled">
                <span className="air-icon">videocam</span>
                <span className="air-list-view-item-content">Videos</span>
              </button>
              <button className="air-list-view-item air-list-view-item-filled">
                <span className="air-icon">mic</span>
                <span className="air-list-view-item-content">Voices</span>
              </button>
              <button className="air-list-view-item air-list-view-item-filled">
                <span className="air-icon">person</span>
                <span className="air-list-view-item-content">Characters</span>
              </button>
              <button className="air-list-view-item air-list-view-item-filled">
                <span className="air-icon">face</span>
                <span className="air-list-view-item-content">Avatar</span>
              </button>
              <button className="air-list-view-item air-list-view-item-filled">
                <span className="air-icon">upload_file</span>
                <span className="air-list-view-item-content">Uploads</span>
              </button>
            </div>
            <div className="mb-4 mt-2">
              <button className="air-button-text w-full justify-start">
                <span className="air-icon">upload</span>
                Upload media
              </button>
            </div>
          </div>

          {/* Middle List */}
          <div className="air-list-view w-80 flex flex-col overflow-y-auto gap-1">
            <button className="air-list-view-item air-list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="air-icon text-on-surface-variant">person</span>
              </div>
              <div className="air-list-view-item-content min-w-0">
                <span className="air-body-lg truncate font-medium">Woman in Javanese atti...</span>
                <span className="air-list-view-item-supporting-text truncate">Image</span>
              </div>
            </button>

            <button role="option" className="air-list-view-item air-list-view-item-filled" aria-selected="true">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="air-icon text-on-surface-variant">videocam</span>
              </div>
              <div className="air-list-view-item-content min-w-0">
                <span className="air-body-lg truncate">Woman walking toward...</span>
                <span className="air-list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="air-list-view-item air-list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="air-icon text-on-surface-variant">videocam</span>
              </div>
              <div className="air-list-view-item-content min-w-0">
                <span className="air-body-lg truncate">Woman walking toward...</span>
                <span className="air-list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="air-list-view-item air-list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="air-icon text-on-surface-variant">videocam</span>
              </div>
              <div className="air-list-view-item-content min-w-0">
                <span className="air-body-lg truncate">Woman walking toward...</span>
                <span className="air-list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="air-list-view-item air-list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="air-icon text-on-surface-variant">videocam</span>
              </div>
              <div className="air-list-view-item-content min-w-0">
                <span className="air-body-lg truncate">Woman walking toward...</span>
                <span className="air-list-view-item-supporting-text truncate">Video</span>
              </div>
            </button>

            <button className="air-list-view-item air-list-view-item-filled">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="air-icon text-on-surface-variant">image</span>
              </div>
              <div className="air-list-view-item-content min-w-0">
                <span className="air-body-lg truncate">Woman walking on Java...</span>
                <span className="air-list-view-item-supporting-text truncate">Image</span>
              </div>
            </button>
          </div>

          {/* Right Preview */}
          <div className="flex-1 flex flex-col relative p-4 pt-0 gap-4">
            <div className="air-card-filled flex-1 overflow-hidden">
              <img src="/images/image-1.png" alt="preview" className="w-full h-full object-cover object-center" />
            </div>

            <button className="air-button air-button-filled w-full max-w-sm">Add to Prompt</button>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-16">
      <h2 className="air-headline-sm mb-6">Shell Layout Preview</h2>
      {/* We use a responsive container that switches from Mobile (Bottom Nav) to Desktop (Nav Rail) */}
      <div className="relative overflow-hidden border border-outline rounded-xl h-[550px] md:h-[450px] w-full max-w-4xl bg-surface shadow-sm">
        {/* Navigation Rail (Desktop/Tablet) - Left Side Full Height */}
        <nav className="air-navigation-rail absolute! top-0 left-0 flex flex-col items-center py-4 px-2 bg-surface-container border-r border-outline-variant w-[80px] h-full z-20 hidden md:flex">
          <button className="air-icon-button mb-8">
            <span className="air-icon">menu</span>
          </button>
          <button role="option" className="air-navigation-rail-item mb-4" aria-selected="true">
            <div className="air-nav-rail-icon-container">
              <span className="air-icon">home</span>
            </div>
            <span className="air-label-sm mt-1">Home</span>
          </button>
          <button className="air-navigation-rail-item">
            <div className="air-nav-rail-icon-container">
              <span className="air-icon">star</span>
            </div>
            <span className="air-label-sm mt-1">Starred</span>
          </button>
        </nav>

        {/* Top App Bar */}
        <header className="air-app-bar absolute! top-0 right-0 left-0 md:left-[80px] flex items-center px-4 py-3 bg-surface border-b border-outline-variant z-10 h-[64px]">
          <button className="air-icon-button mr-4 md:hidden">
            <span className="air-icon">menu</span>
          </button>
          <h1 className="air-app-bar-title air-title-lg flex-1">App Layout</h1>
          <button className="air-icon-button">
            <span className="air-icon">account_circle</span>
          </button>
        </header>

        {/* Main Content Area */}
        <main className="absolute! top-[64px] bottom-[80px] md:bottom-0 left-0 md:left-[80px] right-0 p-6 overflow-y-auto bg-surface-container-lowest">
          <p className="air-body-lg text-on-surface-variant">Main content area simulating a responsive page layout.</p>
          <p className="air-body-md text-on-surface-variant mt-2">
            On mobile sizes, it uses the Bottom Navigation Bar. On tablet/desktop sizes, it switches to the Navigation
            Rail.
          </p>

          <div className="mt-8">
            <h3 className="air-title-md mb-4">Carousel Preview</h3>
            <div className="air-carousel flex gap-4 overflow-x-auto pb-4">
              <div className="air-carousel-item air-card min-w-[200px] h-[120px] flex items-center justify-center">
                Card 1
              </div>
              <div className="air-carousel-item air-card min-w-[200px] h-[120px] flex items-center justify-center">
                Card 2
              </div>
              <div className="air-carousel-item air-card min-w-[200px] h-[120px] flex items-center justify-center">
                Card 3
              </div>
              <div className="air-carousel-item air-card min-w-[200px] h-[120px] flex items-center justify-center">
                Card 4
              </div>
            </div>
          </div>
        </main>

        {/* Navigation Bar (Mobile) - Bottom */}
        <div className="air-navigation-bar absolute! bottom-0 left-0 right-0 flex justify-around bg-surface-container border-t border-outline-variant py-2 px-4 h-[80px] z-20 md:hidden">
          <button
            role="option"
            className="air-navigation-bar-item flex flex-col items-center justify-center flex-1"
            aria-selected="true"
          >
            <div className="air-nav-icon-container">
              <span className="air-icon">home</span>
            </div>
            <span className="air-label-sm mt-1">Home</span>
          </button>
          <button className="air-navigation-bar-item flex flex-col items-center justify-center flex-1">
            <div className="air-nav-icon-container">
              <span className="air-icon">search</span>
            </div>
            <span className="air-label-sm mt-1">Search</span>
          </button>
          <button className="air-navigation-bar-item flex flex-col items-center justify-center flex-1">
            <div className="air-nav-icon-container">
              <span className="air-icon">account_circle</span>
            </div>
            <span className="air-label-sm mt-1">Profile</span>
          </button>
        </div>

        {/* Bottom Sheet (Peer) */}
        <div className="peer absolute inset-x-0 md:left-[80px] bottom-0 bg-surface-container-low rounded-t-[28px] px-6 pt-4 pb-8 translate-y-[calc(100%-36px)] hover:translate-y-0 transition-transform duration-300 cursor-pointer z-30">
          <div className="w-8 h-1 bg-on-surface-variant rounded-full mx-auto mb-4 opacity-40"></div>
          <h3 className="air-title-md mb-2">Bottom Sheet</h3>
          <p className="air-body-md text-on-surface-variant">
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
