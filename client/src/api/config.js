// client/src/api/config.js
// API base URL config
// Set VITE_API_URL in your .env for production, e.g:
//   VITE_API_URL=https://your-api.com
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
