# Cookies Gemini Chat

## 🚨 CONFIGURACIÓN INICIAL REQUERIDA

Antes de ejecutar el proyecto, debes configurar tu API key de Gemini:

### 1. Configurar archivos de entorno

Copia los archivos template y agrega tu API key:

```bash
# Copiar templates
cp src/environments/environment.template.ts src/environments/environment.ts
cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
cp src/app/config/api.config.template.ts src/app/config/api.config.ts

# O crea el archivo .env en la raíz del proyecto
echo "VITE_GEMINI_API_KEY=tu-api-key-aqui" > .env
```

### 2. Editar los archivos copiados

Reemplaza `YOUR_GEMINI_API_KEY_HERE` con tu API key real de Gemini AI.

### 3. Ejecutar el proyecto

```bash
npm install
npm start
```

## 🚀 Deployment

### Para Vercel
1. Configurar variable de entorno: `VITE_GEMINI_API_KEY`
2. Hacer deploy

### Para GitHub Pages
1. Configurar secret: `VITE_GEMINI_API_KEY` 
2. Usar GitHub Actions (ver DEPLOYMENT.md)

### Para Netlify
1. Configurar variable de entorno: `VITE_GEMINI_API_KEY`
2. Hacer deploy

## ⚠️ Seguridad

- ❌ NUNCA commitees archivos con API keys
- ✅ Usa variables de entorno para production
- ✅ Los archivos `*.template.ts` son seguros para versionar

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
