# Material CSS Refactor Changelog

> **Version:** `2.0.0`

## Overview
This changelog documents the major refactoring of the `@airlib/material` CSS utility layer introduced in version `2.0.0`.

### Why these changes were made:
1. **Namespace Prefixing (`air-*`)**: We added the `air-` prefix to all component classes, utilities, and typography tokens. This ensures global namespace safety, prevents collisions with other utility frameworks (like TailwindCSS), and makes it explicitly clear which classes belong to the AIR Material design system.
2. **Proportional Radius Scaling**: Addressed layout bugs where components with fixed border-radii (`text-field`, `chip`) had inconsistent, disproportionate curves across their size variants (`sm`, `lg`). They now have explicitly mapped radius variables that scale proportionally with their height, bringing them in line with scaling components like `fab` and `button`.
3. **Removed `!important` Flags:** Cleaned up 51 unnecessary `!important` overrides across 11 components (`button`, `checkbox`, `chip`, `date-picker`, `icon-button`, `menu`, `radio`, `segmented-button`, `skeleton`, `tabs`, `window`). State mappings now correctly rely on native CSS specificity rules.
4. **Strict Icon Sandboxing & New Base Utility:** 
   - Created a dedicated `air-icon` utility (`components/icon.css`) to replace `.material-symbols-outlined`. It natively provides the necessary font-family features for Material Symbols.
   - Restricted all icon scaling algorithms and `:has` smart padding to strictly target this new `.air-icon` class. We removed all implicit tag assumptions (`svg`, `img`, `span`, `i`) to prevent aggressive resizing of arbitrary visual assets.
5. **Slider Focus & Hover States:** 
   - Fixed slider track background to only change on `:active` or `:focus-visible`, separating it from the thumb's `:hover` state.
   - Removed native `outline` focus rings on the slider track in favor of the MD3 state layer.
   - Fixed the virtual split by implementing the focus ring via `box-shadow` so the thumb's ghost shadow correctly clips it.
6. **Proportional Component Scaling:** Conducted a global sweep to eradicate hardcoded static pixel metrics used for component sizing, padding, and alignments (e.g. `24px` icons, `20px` slider thumbs, `48px` input padding). All dimensions are now completely fluid and dynamically calculated via `calc(var(--spacing) * N)` relative scaling mechanics.

---

## Component Class Changes
## Default
- `link` -> `air-link`

## Typography
- `text-display-large` -> `air-display-lg`
- `text-display-medium` -> `air-display-md`
- `text-display-small` -> `air-display-sm`
- `text-headline-large` -> `air-headline-lg`
- `text-headline-medium` -> `air-headline-md`
- `text-headline-small` -> `air-headline-sm`
- `text-title-large` -> `air-title-lg`
- `text-title-medium` -> `air-title-md`
- `text-title-small` -> `air-title-sm`
- `text-body-large` -> `air-body-lg`
- `text-body-medium` -> `air-body-md`
- `text-body-small` -> `air-body-sm`
- `text-label-large` -> `air-label-lg`
- `text-label-medium` -> `air-label-md`
- `text-label-small` -> `air-label-sm`
- (And all emphasized variants to `-strong`)

## State
- `state-layer` -> `air-state-layer`
- `focus-ring` -> `air-focus-ring`

## Accordion
- `accordion-header-base` -> `air-accordion-header-base`
- `accordion-header-surface` -> `air-accordion-header-surface`
- `accordion-content-base` -> `air-accordion-content-base`
- `accordion-inner-base` -> `air-accordion-inner-base`
- `accordion-inner-surface` -> `air-accordion-inner-surface`
- `accordion-header` -> `air-accordion-header`
- `accordion-content` -> `air-accordion-content`
- `accordion-inner` -> `air-accordion-inner`
- `accordion-group` -> `air-accordion-group`
- `accordion-item` -> `air-accordion-item`
- REMOVED: `accordion-header-hover`, `accordion-header-focus` (replaced with `air-state-layer`)

## App Bar
- `app-bar-base` -> `air-app-bar-base`
- `app-bar-surface` -> `air-app-bar-surface`
- `app-bar-surface-scrolled` -> `air-app-bar-surface-scrolled`
- `app-bar-title` -> `air-app-bar-title`
- `app-bar` -> `air-app-bar`

## Bottom Sheet
- `bottom-sheet-base` -> `air-bottom-sheet-base`
- `bottom-sheet-surface` -> `air-bottom-sheet-surface`
- `bottom-sheet-handle-base` -> `air-bottom-sheet-handle-base`
- `bottom-sheet-handle-surface` -> `air-bottom-sheet-handle-surface`
- `bottom-sheet-scrim-base` -> `air-bottom-sheet-scrim-base`
- `bottom-sheet-scrim-surface` -> `air-bottom-sheet-scrim-surface`
- `bottom-sheet` -> `air-bottom-sheet`
- `bottom-sheet-handle` -> `air-bottom-sheet-handle`
- `bottom-sheet-scrim` -> `air-bottom-sheet-scrim`

## Carousel
- `carousel` -> `air-carousel`
- `carousel-item` -> `air-carousel-item`

## Navigation Bar
- `navigation-bar-base` -> `air-navigation-bar-base`
- `navigation-bar-surface` -> `air-navigation-bar-surface`
- `navigation-bar-item-base` -> `air-navigation-bar-item-base`
- `navigation-bar-item-surface` -> `air-navigation-bar-item-surface`
- `navigation-bar-item-selected-surface` -> `air-navigation-bar-item-selected-surface`
- `nav-icon-container-base` -> `air-nav-icon-container-base`
- `nav-icon-container-surface` -> `air-nav-icon-container-surface`
- `nav-icon-container-selected-surface` -> `air-nav-icon-container-selected-surface`
- `navigation-bar` -> `air-navigation-bar`
- `navigation-bar-item` -> `air-navigation-bar-item`
- `nav-icon-container` -> `air-nav-icon-container`
- REMOVED: `nav-icon-container-hover`, `nav-icon-container-focus`, `nav-icon-container-selected-hover`, `nav-icon-container-selected-focus` (replaced with `air-state-layer`)

## Navigation Drawer
- `drawer-base` -> `air-drawer-base`
- `drawer-surface` -> `air-drawer-surface`
- `drawer-scrim-base` -> `air-drawer-scrim-base`
- `drawer-scrim-surface` -> `air-drawer-scrim-surface`
- `drawer-persistent` -> `air-drawer-persistent`
- `drawer` -> `air-drawer`
- `drawer-scrim` -> `air-drawer-scrim`

## Navigation Rail
- `navigation-rail-base` -> `air-navigation-rail-base`
- `navigation-rail-surface` -> `air-navigation-rail-surface`
- `navigation-rail-item-base` -> `air-navigation-rail-item-base`
- `navigation-rail-item-surface` -> `air-navigation-rail-item-surface`
- `navigation-rail-item-selected-surface` -> `air-navigation-rail-item-selected-surface`
- `nav-rail-icon-container-base` -> `air-nav-rail-icon-container-base`
- `nav-rail-icon-container-surface` -> `air-nav-rail-icon-container-surface`
- `nav-rail-icon-container-selected-surface` -> `air-nav-rail-icon-container-selected-surface`
- `navigation-rail` -> `air-navigation-rail`
- `navigation-rail-item` -> `air-navigation-rail-item`
- `nav-rail-icon-container` -> `air-nav-rail-icon-container`
- REMOVED: `nav-rail-icon-container-hover`, `nav-rail-icon-container-focus`, `nav-rail-icon-container-selected-hover`, `nav-rail-icon-container-selected-focus` (replaced with `air-state-layer`)

## Side Sheet
- `side-sheet-base` -> `air-side-sheet-base`
- `side-sheet-right` -> `air-side-sheet-right`
- `side-sheet-left` -> `air-side-sheet-left`
- `side-sheet-surface` -> `air-side-sheet-surface`
- `side-sheet-scrim-base` -> `air-side-sheet-scrim-base`
- `side-sheet-scrim-surface` -> `air-side-sheet-scrim-surface`
- `side-sheet` -> `air-side-sheet`
- `side-sheet-scrim` -> `air-side-sheet-scrim`

## Tabs
- `tab-list-base` -> `air-tab-list-base`
- `tab-list-surface` -> `air-tab-list-surface`
- `tab-content` -> `air-tab-content`
- `tab` -> `air-tab`
- `tab-base` -> `air-tab-base`
- `tab-indicator-base` -> `air-tab-indicator-base`
- `tab-item-surface` -> `air-tab-item-surface`
- `tab-item-selected-surface` -> `air-tab-item-selected-surface`
- `tab-indicator-surface` -> `air-tab-indicator-surface`
- `tab-indicator-selected` -> `air-tab-indicator-selected`
- `tab-item-disabled` -> `air-tab-item-disabled`
- `tab-list` -> `air-tab-list`
- `tab-item` -> `air-tab-item`
- `tab-indicator` -> `air-tab-indicator`
- REMOVED: `tab-item-hover`, `tab-item-focus`, `tab-item-selected-hover`, `tab-item-selected-focus` (replaced with `air-state-layer`)

## AI Extension
- `ai-prompt` -> `air-ai-prompt`
- `ai-prompt-attachments` -> `air-ai-prompt-attachments`
- `ai-attachment` -> `air-ai-attachment`
- `ai-prompt-textarea` -> `air-ai-prompt-textarea`
- `ai-prompt-actions` -> `air-ai-prompt-actions`
- `ai-chat-thread` -> `air-ai-chat-thread`
- `ai-message` -> `air-ai-message`
- `ai-message-user` -> `air-ai-message-user`
- `ai-message-agent` -> `air-ai-message-agent`
- `ai-message-bubble` -> `air-ai-message-bubble`
- `ai-avatar` -> `air-ai-avatar`
- `ai-typing-indicator` -> `air-ai-typing-indicator`
- `ai-sparkle` -> `air-ai-sparkle`

## Masonry
- `masonry` -> `air-masonry`
- `masonry-item` -> `air-masonry-item`

## Skeleton
- `skeleton` -> `air-skeleton`
- `skeleton-group` -> `air-skeleton-group`

## Badge
- `badge-container` -> `air-badge-container`
- `badge-base` -> `air-badge-base`
- `badge-sm` -> `air-badge-sm`
- `badge-lg` -> `air-badge-lg`
- `badge-error-surface` -> `air-badge-error-surface`
- `badge-primary-surface` -> `air-badge-primary-surface`
- `badge-secondary-surface` -> `air-badge-secondary-surface`
- `badge` -> `air-badge`
- `badge-dot` -> `air-badge-dot`

## Button Group
- `button-group` -> `air-button-group`

## Button
- `button-base` -> `air-button-base`
- `button-icon-slot` -> `air-button-icon-slot`
- `button-disabled` -> `air-button-disabled`
- `button` -> `air-button`
- `button-elevated` -> `air-button-elevated`
- `button-tonal` -> `air-button-tonal`
- `button-outlined` -> `air-button-outlined`
- `button-text` -> `air-button-text`
- `toggle-button` -> `air-toggle-button`
- `button-xs` -> `air-button-xs`
- `button-sm` -> `air-button-sm`
- `button-md` -> `air-button-md`
- `button-lg` -> `air-button-lg`
- `button-xl` -> `air-button-xl`
- REMOVED ALL INDIVIDUAL HOVER/FOCUS CLASSES: `button-filled-*`, `button-elevated-*`, `button-tonal-*`, `button-outlined-*`, `button-text-*`, `button-toggle-*` (Replaced with `air-state-layer`)

## Card
- `card-base` -> `air-card-base`
- `card-elevated-surface` -> `air-card-elevated-surface`
- `card-filled-surface` -> `air-card-filled-surface`
- `card-outlined-surface` -> `air-card-outlined-surface`
- `card-interactive` -> `air-card-interactive`
- `card` -> `air-card`
- `card-filled` -> `air-card-filled`
- `card-outlined` -> `air-card-outlined`
- `card-header` -> `air-card-header`
- `card-title` -> `air-card-title`
- `card-subtitle` -> `air-card-subtitle`
- `card-body` -> `air-card-body`
- `card-actions` -> `air-card-actions`
- `card-group` -> `air-card-group`
- REMOVED: `card-elevated-hover`, `card-elevated-focus`, `card-filled-hover`, `card-filled-focus`, `card-outlined-hover`, `card-outlined-focus` (Replaced with `air-state-layer` in `air-card-interactive`)

## Checkbox
- `checkbox-container` -> `air-checkbox-container`
- `checkbox-base` -> `air-checkbox-base`
- `checkbox-icon` -> `air-checkbox-icon`
- `checkbox-checked` -> `air-checkbox-checked`
- `checkbox-checked-icon` -> `air-checkbox-checked-icon`
- `checkbox-indeterminate-icon` -> `air-checkbox-indeterminate-icon`
- `checkbox-indeterminate` -> `air-checkbox-indeterminate`
- `checkbox-disabled` -> `air-checkbox-disabled`
- `checkbox-disabled-checked` -> `air-checkbox-disabled-checked`
- `checkbox` -> `air-checkbox`
- `checkbox-input` -> `air-checkbox-input`
- REMOVED: `checkbox-hover` (Replaced with `air-state-layer` in `air-checkbox-input`)

## Chip
- `chip-base` -> `air-chip-base`
- `chip-outlined-surface` -> `air-chip-outlined-surface`
- `chip-outlined-selected-surface` -> `air-chip-outlined-selected-surface`
- `chip-elevated-surface` -> `air-chip-elevated-surface`
- `chip-elevated-selected-surface` -> `air-chip-elevated-selected-surface`
- `chip-disabled` -> `air-chip-disabled`
- `chip` -> `air-chip`
- `chip-elevated` -> `air-chip-elevated`
- `chip-sm` -> `air-chip-sm`
- `chip-md` -> `air-chip-md`
- `chip-lg` -> `air-chip-lg`
- REMOVED: `chip-outlined-hover`, `chip-outlined-focus`, `chip-outlined-selected-hover`, `chip-outlined-selected-focus`, `chip-elevated-hover`, `chip-elevated-focus`, `chip-elevated-selected-hover`, `chip-elevated-selected-focus` (Replaced with `air-state-layer`)

## Color Picker
- `color-picker` -> `air-color-picker`

## Date Picker
- `date-picker-surface` -> `air-date-picker-surface`
- `date-picker-grid` -> `air-date-picker-grid`
- `date-picker-cell-base` -> `air-date-picker-cell-base`
- `date-picker-cell-surface` -> `air-date-picker-cell-surface`
- `date-picker-cell-selected-surface` -> `air-date-picker-cell-selected-surface`
- `date-picker-cell-today-surface` -> `air-date-picker-cell-today-surface`
- `date-picker-cell-disabled` -> `air-date-picker-cell-disabled`
- `date-picker-header` -> `air-date-picker-header`
- `date-picker` -> `air-date-picker`
- `date-picker-cell` -> `air-date-picker-cell`
- REMOVED: `date-picker-cell-hover`, `date-picker-cell-selected-hover` (Replaced with `air-state-layer`)

## Dialog
- `dialog-base` -> `air-native-dialog-base`
- `dialog-surface` -> `air-dialog-surface`
- `dialog-fullscreen` -> `air-dialog-fullscreen`
- `dialog-title` -> `air-dialog-title` (merged)
- `dialog-content` -> `air-dialog-content` (merged)
- `dialog-actions` -> `air-dialog-actions`
- `dialog` -> `air-native-dialog`

## Divider
- `divider-base` -> `air-divider-base`
- `divider-horizontal-layout` -> `air-divider-horizontal-layout`
- `divider-vertical-layout` -> `air-divider-vertical-layout`
- `divider-inset-layout` -> `air-divider-inset-layout`
- `divider-surface` -> `air-divider-surface`
- `divider-primary-surface` -> `air-divider-primary-surface`
- `divider` -> `air-divider`
- `divider-vertical` -> `air-divider-vertical`
- `divider-inset` -> `air-divider-inset`

## FAB Menu
- `fab-menu` -> `air-fab-menu`
- `fab-menu-trigger` -> `air-fab-menu-trigger`
- `fab-menu-list` -> `air-fab-menu-list`
- `fab-menu-item` -> `air-fab-menu-item`

## FAB
- `fab-base` -> `air-fab-base`
- `fab-sm` -> `air-fab-sm`
- `fab-lg` -> `air-fab-lg`
- `fab-extended` -> `air-fab-extended`
- `fab-primary-surface` -> `air-fab-primary-surface`
- `fab-surface-surface` -> `air-fab-surface-surface`
- `fab-secondary-surface` -> `air-fab-secondary-surface`
- `fab-tertiary-surface` -> `air-fab-tertiary-surface`
- `fab` -> `air-fab`
- `fab-surface` -> `air-fab-surface`
- `fab-secondary` -> `air-fab-secondary`
- `fab-tertiary` -> `air-fab-tertiary`
- REMOVED: `fab-primary-hover`, `fab-primary-focus`, `fab-surface-hover`, `fab-surface-focus`, `fab-secondary-hover`, `fab-secondary-focus`, `fab-tertiary-hover`, `fab-tertiary-focus` (Replaced with `air-state-layer`)

## Icon Button
- `icon-button-base` -> `air-icon-button-base`
- `icon-button-disabled` -> `air-icon-button-disabled`
- `icon-button-filled-disabled` -> `air-icon-button-filled-disabled`
- `icon-button` -> `air-icon-button`
- `icon-button-filled` -> `air-icon-button-filled`
- `icon-button-tonal` -> `air-icon-button-tonal`
- `icon-button-outlined` -> `air-icon-button-outlined`
- `icon-button-xs` -> `air-icon-button-xs`
- `icon-button-sm` -> `air-icon-button-sm`
- `icon-button-md` -> `air-icon-button-md`
- `icon-button-lg` -> `air-icon-button-lg`
- `icon-button-xl` -> `air-icon-button-xl`
- REMOVED: all `*-hover`, `*-focus` and individual state classes (Replaced with `air-state-layer`)

## Link
- `link` -> `air-link`
- `link-nav` -> `air-link-nav`
- `link-standalone` -> `air-link-standalone`

## List
- `list-view` -> `air-list-view`
- `list-view-filled` -> `air-list-view-filled`
- `list-view-item-filled` -> `air-list-view-item-filled`
- `list-view-item-base` -> `air-list-view-item-base`
- `list-view-item-surface` -> `air-list-view-item-surface`
- `list-view-item-selected-surface` -> `air-list-view-item-selected-surface`
- `list-view-item-content` -> `air-list-view-item-content`
- `list-view-item-supporting-text` -> `air-list-view-item-supporting-text`
- `list-view-item` -> `air-list-view-item`
- REMOVED: `list-view-item-hover`, `list-view-item-focus`, `list-view-item-selected-focus` (Replaced with `air-state-layer`)

## Menu
- `menu-surface` -> `air-menu-surface`
- `menu-item-base` -> `air-menu-item-base`
- `menu-item-surface` -> `air-menu-item-surface`
- `menu-item-disabled` -> `air-menu-item-disabled`
- `menu` -> `air-menu`
- `menu-item` -> `air-menu-item`
- REMOVED: `menu-item-hover`, `menu-item-focus` (Replaced with `air-state-layer`)

## Progress
- `progress-linear-base` -> `air-progress-linear-base`
- `progress-linear-surface` -> `air-progress-linear-surface`
- `progress-linear-bar` -> `air-progress-linear-bar`
- `progress-linear-primary` -> `air-progress-linear-primary`
- `progress-linear-indeterminate` -> `air-progress-linear-indeterminate`
- `progress-circular-base` -> `air-progress-circular-base`
- `progress-circular-indeterminate` -> `air-progress-circular-indeterminate`
- `progress-circular-circle` -> `air-progress-circular-circle`
- `progress-circular-primary` -> `air-progress-circular-primary`
- `progress-circular-circle-indeterminate` -> `air-progress-circular-circle-indeterminate`
- `progress-linear` -> `air-progress-linear`
- `progress-circular` -> `air-progress-circular`

## Radio
- `radio-target` -> `air-radio-target`
- `radio-size` -> `air-radio-size`
- `radio-base` -> `air-radio-base`
- `radio-visual` -> `air-radio-visual`
- `radio-visual-dot` -> `air-radio-visual-dot`
- `radio-checked` -> `air-radio-checked`
- `radio-checked-dot` -> `air-radio-checked-dot`
- `radio-disabled` -> `air-radio-disabled`
- `radio-disabled-dot` -> `air-radio-disabled-dot`
- `radio` -> `air-radio`
- REMOVED: `radio-hover`, `radio-focus`, `radio-checked-hover`, `radio-checked-focus` (Replaced with `air-state-layer`)

## Ripple
- `ripple-container` -> `air-ripple-container`
- `ripple` -> `air-ripple`

## Search Bar
- `search-bar-base` -> `air-search-bar-base`
- `search-bar-surface` -> `air-search-bar-surface`
- `search-bar-input-base` -> `air-search-bar-input-base`
- `search-bar` -> `air-search-bar`
- `search-bar-input` -> `air-search-bar-input`
- REMOVED: `search-bar-hover`, `search-bar-focus` (Replaced with `air-state-layer`)

## Segmented Button
- `segmented-group` -> `air-segmented-group`
- `segmented-button-base` -> `air-segmented-button-base`
- `segmented-button-surface` -> `air-segmented-button-surface`
- `segmented-button-selected-surface` -> `air-segmented-button-selected-surface`
- `segmented-button` -> `air-segmented-button`
- REMOVED: `segmented-button-hover`, `segmented-button-focus`, `segmented-button-selected-hover`, `segmented-button-selected-focus` (Replaced with `air-state-layer`)

## Select
- `select-trigger` -> `air-select-trigger`
- `select-caret` -> `air-select-caret`
- `select-caret-expanded` -> `air-select-caret-expanded`
- `select-option-selected-surface` -> `air-select-option-selected-surface`
- `select-option` -> `air-select-option`

## Slider
- `slider-track-height` -> `air-slider-track-height`
- `slider-handle-size` -> `air-slider-handle-size`
- `slider-handle-width` -> `air-slider-handle-width`
- `slider-handle-gap` -> `air-slider-handle-gap`
- `slider-base` -> `air-slider-base`
- `slider-track-base` -> `air-slider-track-base`
- `slider-track-active-base` -> `air-slider-track-active-base`
- `slider-handle-base` -> `air-slider-handle-base`
- `slider-track-secondary` -> `air-slider-track-secondary`
- `slider-track-active-primary` -> `air-slider-track-active-primary`
- `slider-handle-primary` -> `air-slider-handle-primary`
- `slider-handle-hover` -> `air-slider-handle-hover`
- `slider` -> `air-slider`
- `slider-native-primary-surface` -> `air-slider-native-primary-surface`
- `slider-primary` -> `air-slider-primary`

## Snackbar
- `snackbar-min-height` -> `air-snackbar-min-height`
- `snackbar-padding-x` -> `air-snackbar-padding-x`
- `snackbar-radius` -> `air-snackbar-radius`
- `snackbar-gap` -> `air-snackbar-gap`
- `snackbar-base` -> `air-snackbar-base`
- `snackbar-surface` -> `air-snackbar-surface`
- `snackbar-action` -> `air-snackbar-action`
- `snackbar` -> `air-snackbar`
- REMOVED: `snackbar-action` manual hover/focus rules (Replaced with `air-state-layer`)

## Split Button
- `split-button-height` -> `air-split-button-height`
- `split-button-radius-outer` -> `air-split-button-radius-outer`
- `split-button-radius-inner` -> `air-split-button-radius-inner`
- `split-button-gap` -> `air-split-button-gap`
- `split-button-group` -> `air-split-button-group`
- `split-button-base` -> `air-split-button-base`
- `split-button-primary` -> `air-split-button-primary`
- `split-button-trailing` -> `air-split-button-trailing`
- `split-button-filled` -> `air-split-button-filled`
- `split-button-tonal` -> `air-split-button-tonal`
- `split-button-elevated` -> `air-split-button-elevated`
- `split-button-outlined` -> `air-split-button-outlined`
- REMOVED: manual hover/focus rules inside variants (Replaced with `air-state-layer`)

## Switch
- `switch-track-width` -> `air-switch-track-width`
- `switch-track-height` -> `air-switch-track-height`
- `switch-handle-size` -> `air-switch-handle-size`
- `switch-handle-active-size` -> `air-switch-handle-active-size`
- `switch-base` -> `air-switch-base`
- `switch-track` -> `air-switch-track`
- `switch-track-checked` -> `air-switch-track-checked`
- `switch-track-disabled` -> `air-switch-track-disabled`
- `switch-handle` -> `air-switch-handle`
- `switch-handle-surface` -> `air-switch-handle-surface`
- `switch-handle-checked` -> `air-switch-handle-checked`
- `switch-handle-hover` -> `air-switch-handle-hover`
- `switch-handle-focus` -> `air-switch-handle-focus`
- `switch-handle-checked-hover` -> `air-switch-handle-checked-hover`
- `switch-handle-checked-focus` -> `air-switch-handle-checked-focus`
- `switch-icon` -> `air-switch-icon`
- `switch-icon-checked` -> `air-switch-icon-checked`
- `switch` -> `air-switch`
- `switch-thumb` -> `air-switch-thumb`

## Table
- `table-view` -> `air-table-view`
- `table-header-cell` -> `air-table-header-cell`
- `table-row` -> `air-table-row`
- `table-row-filled` -> `air-table-row-filled`
- `table-cell` -> `air-table-cell`
- REMOVED: `table-row-filled` manual hover/focus rules (Replaced with `air-state-layer`)

## Text Field
- `text-field-height` -> `air-text-field-height`
- `text-field-radius` -> `air-text-field-radius`
- `text-field-padding-x` -> `air-text-field-padding-x`
- `text-field-icon-padding-x` -> `air-text-field-icon-padding-x`
- `text-field-font-size` -> `air-text-field-font-size`
- `text-field-base` -> `air-text-field-base`
- `text-field` -> `air-text-field`
- `text-field-floating` -> `air-text-field-floating`
- `text-field-label` -> `air-text-field-label`
- `text-field-label-base` -> `air-text-field-label-base`
- `text-field-label-focus` -> `air-text-field-label-focus`
- `text-field-label-error` -> `air-text-field-label-error`
- `text-field-input-base` -> `air-text-field-input-base`
- `text-field-outlined-surface` -> `air-text-field-outlined-surface`
- `text-field-outlined-focus` -> `air-text-field-outlined-focus`
- `text-field-filled-surface` -> `air-text-field-filled-surface`
- `text-field-filled-focus` -> `air-text-field-filled-focus`
- `text-field-input-placeholder-visible` -> `air-text-field-input-placeholder-visible`
- `text-field-input-error` -> `air-text-field-input-error`
- `text-field-input-disabled` -> `air-text-field-input-disabled`
- `text-field-supporting-base` -> `air-text-field-supporting-base`
- `text-field-supporting-surface` -> `air-text-field-supporting-surface`
- `text-field-supporting-error` -> `air-text-field-supporting-error`
- `text-field-input` -> `air-text-field-input`
- `text-field-input-filled` -> `air-text-field-input-filled`
- `select-input` -> `air-select-input`
- `select-input-filled` -> `air-select-input-filled`
- `textarea-input` -> `air-textarea-input`
- `textarea-input-filled` -> `air-textarea-input-filled`
- `text-field-supporting-text` -> `air-text-field-supporting-text`
- `text-field-error` -> `air-text-field-error`
- `text-field-sm` -> `air-text-field-sm`
- `text-field-md` -> `air-text-field-md`
- `text-field-lg` -> `air-text-field-lg`

## Time Picker
- `time-picker-unit-size` -> `air-time-picker-unit-size`
- `time-picker-base` -> `air-time-picker-base`
- `time-picker-surface` -> `air-time-picker-surface`
- `time-picker-display` -> `air-time-picker-display`
- `time-picker-unit-base` -> `air-time-picker-unit-base`
- `time-picker-unit-surface` -> `air-time-picker-unit-surface`
- `time-picker-unit-selected-surface` -> `air-time-picker-unit-selected-surface`
- `time-picker-separator` -> `air-time-picker-separator`
- `time-picker` -> `air-time-picker`
- `time-picker-unit` -> `air-time-picker-unit`
- REMOVED: manual hover rules for units (Replaced with `air-state-layer`)

## Tooltip
- `tooltip-base` -> `air-tooltip-base`
- `tooltip-plain-layout` -> `air-tooltip-plain-layout`
- `tooltip-plain-surface` -> `air-tooltip-plain-surface`
- `tooltip-rich-layout` -> `air-tooltip-rich-layout`
- `tooltip-rich-surface` -> `air-tooltip-rich-surface`
- `tooltip-plain` -> `air-tooltip-plain`
- `tooltip-rich` -> `air-tooltip-rich`

