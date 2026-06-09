# @airlib/material

Material Design 3 Headless Component Library CSS Theme.

This package provides the foundational CSS variable structure and design tokens (Colors, Typography, Shape, Elevation) required by the `@airlib` component system. It leverages Tailwind 4's `@theme` directive to provide a zero-runtime, variable-driven mathematics engine for proportional scaling.

## Usage

Import the CSS theme directly into your pipeline:

```css
@import "@airlib/material/theme/index.css";
```

### Overriding the Seed Color

The entire color system is mathematically driven by a single seed variable. To theme your app, simply override it at the root:

```css
:root {
  --seed-color: oklch(60% 0.15 260); /* Your custom brand color */
}
```
