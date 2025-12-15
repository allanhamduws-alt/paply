import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  root: 'src',
  build: {
    outDir: '../renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dashboard: path.resolve(__dirname, 'src/dashboard.html'),
        settings: path.resolve(__dirname, 'src/settings.html'),
        history: path.resolve(__dirname, 'src/history.html'),
        recording: path.resolve(__dirname, 'src/recording.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
