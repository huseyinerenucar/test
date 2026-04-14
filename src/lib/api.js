// Base URL for API calls.
// In dev, talk directly to the Express server (port 3001) to bypass the
// Vite proxy — on Windows the proxy occasionally resets multipart uploads
// mid-flight with ECONNRESET. CORS is enabled server-side, so a direct
// cross-origin call from :5173 to :3001 works fine.
// In production the Express server serves the built assets, so a relative
// URL hits the same origin.
export const API_BASE = import.meta.env.DEV ? 'http://127.0.0.1:3001' : '';

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
