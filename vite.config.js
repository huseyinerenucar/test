import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Note: we intentionally do NOT proxy /api here. The dev frontend calls
// the Express backend directly via http://127.0.0.1:3001 (see src/lib/api.js).
// On Windows the Vite proxy was occasionally resetting multipart CV uploads
// with ECONNRESET, so we bypass it entirely. CORS is enabled server-side.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
