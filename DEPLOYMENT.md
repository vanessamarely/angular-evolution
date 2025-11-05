# Deployment Guide

## Para Vercel

1. **Configurar variable de entorno en Vercel:**
   - Ve a tu proyecto en Vercel Dashboard
   - Settings > Environment Variables
   - Agregar: `VITE_GEMINI_API_KEY` = `tu-api-key-aqui`

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add environment configuration"
   git push
   ```

## Para GitHub Pages

GitHub Pages no soporta variables de entorno del servidor. Opciones:

### Opción 1: Hardcoded (solo para demos)
- El fallback en `api.config.ts` funcionará automáticamente

### Opción 2: Variables de entorno de GitHub Actions
1. En tu repo: Settings > Secrets and variables > Actions
2. Agregar: `VITE_GEMINI_API_KEY` = `tu-api-key-aqui`
3. Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Para Netlify

1. **Configurar variable de entorno:**
   - Site settings > Environment variables
   - Agregar: `VITE_GEMINI_API_KEY` = `tu-api-key-aqui`

2. **Deploy:** Push a tu repo conectado

## Desarrollo Local

El archivo `.env` seguirá funcionando para desarrollo local.