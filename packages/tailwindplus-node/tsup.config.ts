import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: ['cjs'],
    target: 'es2022',
    minify: true,
    dts: true,
    entry: ['src/index.cts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
  {
    format: ['esm'],
    target: 'es2022',
    minify: true,
    dts: true,
    entry: ['src/index.ts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
  {
    format: ['esm'],
    target: 'es2022',
    minify: true,
    dts: true,
    entry: ['src/esm-cache.loader.mts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
  {
    format: ['cjs'],
    target: 'es2022',
    minify: true,
    dts: true,
    entry: ['src/require-cache.cts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
])
