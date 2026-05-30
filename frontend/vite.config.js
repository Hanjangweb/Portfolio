import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Dev server restart triggered

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        timeout: 120000, // 2 minutes
        proxyTimeout: 120000,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('lucide') || id.includes('toast')) return 'ui';
            return 'vendor';
          }
        }
      }
    }
  },
})
