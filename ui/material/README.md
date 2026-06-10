# AIR M3

Building a cohesive design system requires a robust set of modular styles. This package provides the foundational Material Design 3 CSS utilities required to build the `@airlib` component system. It leverages Tailwind CSS v4 to keep the footprint minimal, highly scalable, and completely free of JavaScript runtime styling overhead.

## Getting Started

Integrating a new design system shouldn't require complex build steps or heavy runtime dependencies. This library is distributed as a standard npm package and is consumed purely via CSS imports.

> [!IMPORTANT]
> **Prerequisite:** This library strictly requires **Tailwind CSS v4** to be installed and configured in your project, as it leverages the new `@theme` and `@utility` CSS APIs.

```bash
npm install @airlib/material
```
```css
/* OPTION A (Preferred): Import theme/components AND default surface backgrounds */
@import "@airlib/material/index.css";
@import "@airlib/material/default.css";

/* OPTION B: Import only the core theme and components (no default backgrounds) */
@import "@airlib/material/index.css";

/* Optionally, override the global brand color */
:root {
  --seed-color: oklch(60% 0.15 260);
}
```

By keeping the integration strictly at the CSS layer, your application remains completely agnostic to JavaScript frameworks while instantly inheriting the full Material Design 3 specification.

## Core Theme & Utilities

To maintain visual consistency across an entire application, we must rely on a centralized theme configuration and shared utilities. These files define the base variables, typography scales, and global behaviors that all other components consume.

- [src/default.css](src/default.css) - The main entry point that aggregates all theme tokens, layout structures, and component styles.
- [src/theme/index.css](src/theme/index.css) - The core theme engine. It dynamically generates the full OKLCH color palette from a single seed color, and defines elevations, radii, and z-index layers.
- [src/theme/typography.css](src/theme/typography.css) - The complete set of Material Design 3 typography scales (Display, Headline, Title, Body, Label).
- [src/theme/state.css](src/theme/state.css) - Global state layer utilities (hover, focus, pressed) used to provide interactive feedback across all components.
- [src/utilities/index.css](src/utilities/index.css) - General utility classes that don't fit into a specific component context.

By decoupling the design tokens from the components themselves, developers can safely re-theme the entire library simply by overriding the `--seed-color` variable at the root level.

## Layout Elements

Structuring the application shell is the first critical step in building a user interface. These modules provide the scaffolding necessary to frame your content gracefully across both mobile and desktop devices.

- [src/layout/app-bar.css](src/layout/app-bar.css) - Top-level headers containing page titles, navigation icons, and primary actions.
- [src/layout/navigation-bar.css](src/layout/navigation-bar.css) - Bottom navigation structures optimized for mobile and compact screens.
- [src/layout/navigation-rail.css](src/layout/navigation-rail.css) - Vertical side navigation structures optimized for tablet and desktop environments.
- [src/layout/navigation-drawer.css](src/layout/navigation-drawer.css) - Expandable side panels for deep navigation hierarchies.
- [src/layout/bottom-sheet.css](src/layout/bottom-sheet.css) - Modal surfaces anchored to the bottom of the screen for secondary content.
- [src/layout/side-sheet.css](src/layout/side-sheet.css) - Modal or persistent surfaces anchored to the edges of the screen.
- [src/layout/tabs.css](src/layout/tabs.css) - Horizontal navigation elements for switching between related content views.
- [src/layout/accordion.css](src/layout/accordion.css) - Vertically stacked panels that expand and collapse to reveal content.
- [src/layout/carousel.css](src/layout/carousel.css) - Horizontally scrollable containers for browsing multiple items.

Using these layout utilities ensures that the application shell behaves responsively while strictly respecting the standardized z-index hierarchy and logical Right-to-Left (RTL) flow.

## Interactive Components

Building user interactions requires precise visual feedback and accessible touch targets. These files define the standalone UI elements that users interact with directly.

- [src/components/button.css](src/components/button.css) - Core action triggers including Filled, Outlined, Text, Tonal, and Elevated variants.
- [src/components/button-group.css](src/components/button-group.css) - Layout utilities for visually grouping multiple related buttons.
- [src/components/icon-button.css](src/components/icon-button.css) - Compact action triggers focused solely on an icon.
- [src/components/fab.css](src/components/fab.css) - Floating Action Buttons for promoting the primary action on a screen.
- [src/components/fab-menu.css](src/components/fab-menu.css) - Speed dial extensions that expand from a FAB to reveal multiple actions.
- [src/components/segmented-button.css](src/components/segmented-button.css) - Grouped toggles for selecting options from a closely related set.
- [src/components/split-button.css](src/components/split-button.css) - Dual-action buttons containing a primary action and a trailing dropdown trigger.
- [src/components/chip.css](src/components/chip.css) - Compact elements that represent inputs, attributes, or actions.
- [src/components/text-field.css](src/components/text-field.css) - Input containers for entering and editing text.
- [src/components/checkbox.css](src/components/checkbox.css) - Selection controls for picking multiple options from a list.
- [src/components/radio.css](src/components/radio.css) - Selection controls for picking a single option from a list.
- [src/components/switch.css](src/components/switch.css) - Toggles for explicitly turning features on or off.
- [src/components/slider.css](src/components/slider.css) - Controls for making selections from a continuous or discrete range of values.
- [src/components/select.css](src/components/select.css) - Dropdown inputs for selecting a value from a predefined list.
- [src/components/search-bar.css](src/components/search-bar.css) - Specialized input containers optimized for search queries.
- [src/components/date-picker.css](src/components/date-picker.css) - Calendar interfaces for selecting dates.
- [src/components/time-picker.css](src/components/time-picker.css) - Interfaces for selecting specific times.
- [src/components/color-picker.css](src/components/color-picker.css) - Interfaces for selecting colors.
- [src/components/ripple.css](src/components/ripple.css) - Utility classes for the interactive ripple effect on press.

All interactive elements strictly enforce the 48x48 pixel minimum touch target requirement and implement clear, unclipped focus rings for keyboard accessibility.

## Data Display & Feedback

Presenting information clearly and keeping the user informed of system status is critical for a smooth user experience. These elements handle content framing and temporary notifications.

- [src/components/card.css](src/components/card.css) - Surfaces for grouping related content and actions about a single subject.
- [src/components/list.css](src/components/list.css) - Continuous, vertical indexes of text and images.
- [src/components/table.css](src/components/table.css) - Segmented data tables for structured information.
- [src/components/divider.css](src/components/divider.css) - Thin visual lines used to group or separate content.
- [src/components/dialog.css](src/components/dialog.css) - High-priority modal surfaces that interrupt the user for critical decisions.
- [src/components/menu.css](src/components/menu.css) - Transient lists of options that appear upon interaction.
- [src/components/snackbar.css](src/components/snackbar.css) - Brief, temporary messages displayed at the bottom of the screen.
- [src/components/tooltip.css](src/components/tooltip.css) - Informational labels that appear on hover or focus.
- [src/components/badge.css](src/components/badge.css) - Small indicators used to notify users of new or unread content.
- [src/components/progress.css](src/components/progress.css) - Linear and circular indicators that visualize the status of ongoing operations.

## Extensions

Powerful utilities and components extending beyond the base M3 specification for modern web applications.

- [src/extensions/masonry.css](src/extensions/masonry.css) - A pure CSS multi-column masonry grid layout.
- [src/extensions/skeleton.css](src/extensions/skeleton.css) - Universal skeleton loading utilities. Use `.skeleton` for standalone elements or `.skeleton-group` to recursively transform an entire container's text and inline blocks into shimmering placeholders.
- [src/extensions/ai.css](src/extensions/ai.css) - Specialized components for Conversational UI, including asymmetric chat bubbles, multiline prompt fields, and CSS-only streaming/thinking indicators.

By relying on these standardized display components, the interface remains consistent and predictable, minimizing cognitive load for the user while they interact with the application.
