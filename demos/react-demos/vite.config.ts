import { airWorker } from '@airlib/vite';
import { airImage } from '@airlib/vite/image';
import react from '@vitejs/plugin-react';
import tailwindplus from 'tailwindplus-vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindplus(), airWorker(), airImage({ devEnabled: true })],
});
