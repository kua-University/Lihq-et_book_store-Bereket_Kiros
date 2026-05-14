// ============================================
// Frontend API Configuration
// ============================================
// Controls where the frontend sends API requests.
//
// - In development (Vite proxy):    Leave VITE_API_URL empty → requests go to same origin
// - In Docker Compose (Nginx proxy): Leave VITE_API_URL empty → Nginx proxies /api to backend
// - Deployed separately (Vercel):    Set VITE_API_URL=https://your-backend.railway.app

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default API_BASE_URL;
