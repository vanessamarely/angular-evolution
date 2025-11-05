// Environment configuration template for production
// Copy this file to environment.prod.ts and configure for production
export const environment = {
  production: true,
  geminiApiKey: import.meta.env['VITE_GEMINI_API_KEY'] || ''
};