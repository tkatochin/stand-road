import { defineConfig } from 'vite';

export default defineConfig({
  base: '/stand-road/',
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
