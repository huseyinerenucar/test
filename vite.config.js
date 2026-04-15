import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev: Vite runs as middleware inside the Express server (see server/index.js)
// so the frontend and API share an origin. No proxy config needed.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
