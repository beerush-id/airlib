import { airWorker } from '@anchorlib/vite-ssr';
import { airImage } from '@anchorlib/vite-ssr/image';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), airWorker(), airImage({ devEnabled: true })],
});
