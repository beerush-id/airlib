import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  target: 'es2022',
  clean: true,
  minify: true,
  dts: true,
  entry: ['src/index.ts'],
})
