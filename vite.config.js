import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Use 127.0.0.1 explicitly to avoid IPv4/IPv6 resolution issues on Windows
        // (localhost can resolve to ::1 while the server binds to 0.0.0.0)
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        // Disable timeout on large uploads
        timeout: 0,
        proxyTimeout: 0,
      },
    },
  },
})
