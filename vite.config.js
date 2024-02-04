// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import html2pdf from 'html2pdf.js';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['html2pdf.js'], 
    },
  },
});

