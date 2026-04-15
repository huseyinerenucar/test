// Single-origin setup: in dev, Vite runs as middleware inside the Express
// server (see server/index.js), and in production Express serves the built
// assets. Either way, the frontend and API share an origin — no CORS, no
// proxy, no port-hopping. Relative URLs Just Work.
export const API_BASE = '';

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
