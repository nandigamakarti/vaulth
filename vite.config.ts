import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  preview: {
    host: '0.0.0.0',
    port: 10000,
    allowedHosts: ['vaulth.onrender.com'],  
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
