import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { airSSR } from '@airlib/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    airSSR({
      router: './src/lib/router.ts',
      layout: './src/pages/layout.tsx',
      renderer: '@airlib/react/ssr',
      irpc: {
        module: { path: './src/lib/module.ts', name: 'irpc' },
        transport: { path: './src/lib/module.ts', name: 'transport' },
        handlers: ['./src/pages/constructor.ts'],
      },
    }),
  ],
});
