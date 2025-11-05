// Configuration template file - copy to api.config.ts
// This works in all deployment environments
export const CONFIG = {
  // Try multiple sources for the API key
  getGeminiApiKey(): string {
    // 1. Try environment variable (Vercel, Netlify, etc.)
    if (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_GEMINI_API_KEY']) {
      return import.meta.env['VITE_GEMINI_API_KEY'];
    }
    
    // 2. No fallback - force environment variable usage
    throw new Error('VITE_GEMINI_API_KEY environment variable is required');
  }
};