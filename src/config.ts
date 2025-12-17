/**
 * Application configuration
 * Update PRODUCTION_API_URL with your deployed backend URL
 */

const PRODUCTION_API_URL = 'https://your-app.railway.app'; // TODO: Replace with your deployed URL

export const config = {
  apiUrl: typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? PRODUCTION_API_URL
    : 'http://localhost:8000',
};

export default config;
