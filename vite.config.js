import { defineConfig } from 'vite';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  // Dev server serves from project root (index.html, README.md, restyles.config.json, docs/)
  root: '.',
  publicDir: false,

  plugins: [cssInjectedByJsPlugin()],

  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/core/restyles.js'),
      name: 'ReStyles',
      fileName: 'lumina',
      formats: ['iife'],
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
