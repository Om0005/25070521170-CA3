import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The API runs on port 5000 by default. Override with API_PROXY_TARGET if your
// backend uses a different port.
const apiProxy = {
  '/api': {
    target: process.env.API_PROXY_TARGET || 'http://localhost:5000',
    changeOrigin: true,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Any request starting with /api is forwarded to the Express server,
    // so the browser never runs into CORS problems during development.
    proxy: apiProxy,
  },
  preview: {
    port: 4173,
    proxy: apiProxy,
  },
});
