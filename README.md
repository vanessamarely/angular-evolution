# 🍪 Cookies Gemini Chat - Evolución de Angular Taller Práctico

**Objetivo**: Construir una aplicación de chat interactiva que use la API de Google Gemini para generar recetas. En el proceso, aplicaremos los conceptos clave de Angular moderno: Componentes Standalone, Formularios Reactivos y Signals para el manejo de estado.

## � Paso 0: Instalar Angular CLI

Antes de empezar, asegúrate de tener todo lo necesario:

### Node.js
Necesitas tener Node.js (versión LTS recomendada). Verifica tu versión en la terminal:
```bash
node -v
```

### Angular CLI
Instala (o actualiza) la Interfaz de Línea de Comandos (CLI) de Angular:
```bash
npm install -g @angular/cli
```

Verifica la CLI:
```bash
ng version
```

## 🚀 Paso 1: Creación del Proyecto y Configuración Inicial

### Crear el Proyecto
```bash
ng new cookies-gemini-chat --standalone --routing --style=css --ssr=false
```

Cuando pregunte:
```
Do you want to create a 'zoneless' application without zone.js?
(y/N) y
```

### Navegar al Proyecto
```bash
cd cookies-gemini-chat
```

## 🔐 Paso 2: Configurar el Entorno y Variables de Entorno

### 1. Obtener API Key de Gemini
- Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
- Crea una nueva API Key y guárdala de forma segura

### 2. Instalar SDK de Gemini
```bash
npm install @google/generative-ai
```

### 3. Configurar Variables de Entorno

#### Para Desarrollo Local:
Crea archivo `.env` en la raíz del proyecto:
```bash
echo "VITE_GEMINI_API_KEY=tu-api-key-aqui" > .env
```

#### Configurar TypeScript para Variables de Entorno:
Crea `src/env.d.ts`:
```typescript
interface ImportMeta {
  readonly env: {
    [key: string]: string;
    VITE_GEMINI_API_KEY: string;
  };
}
```

### 4. Configurar Archivos de Entorno

#### Crear directorio de entornos:
```bash
mkdir src/environments
```

#### Crear `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  geminiApiKey: import.meta.env['VITE_GEMINI_API_KEY'] || 'tu-api-key-de-desarrollo'
};
```

#### Crear `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  geminiApiKey: import.meta.env['VITE_GEMINI_API_KEY'] || ''
};
```

### 5. Configurar .gitignore
Añadir al `.gitignore`:
```gitignore
# Environment files with sensitive data
.env
.env.local
.env.production
.env.development

# Configuration files with API keys (si usas archivos locales)
src/environments/environment.ts
src/environments/environment.prod.ts
```

## 🎨 Paso 3: Limpieza Inicial y Estilos Globales

### Limpiar `src/app/app.component.html`:
```html
<main class="main">
  <div class="content">
    <div class="left-side">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 982 239" fill="none" class="angular-logo">
        <!-- ... SVG path ... -->
      </svg>
      <h1>Chat de Recetas de Galletas</h1>
    </div>
    <div class="right-side">
      <div class="divider" role="separator" aria-label="Divider"></div>
    </div>
  </div>
</main>

<router-outlet />
```

### Estilos Globales `src/styles.css`:
```css
:host {
  --bright-blue: oklch(51.01% 0.274 263.83);
  --electric-violet: oklch(53.18% 0.28 296.97);
  --french-violet: oklch(47.66% 0.246 305.88);
  --vivid-pink: oklch(69.02% 0.277 332.77);
  --hot-red: oklch(61.42% 0.238 15.34);
  --orange-red: oklch(63.32% 0.24 31.68);

  --gray-900: oklch(19.37% 0.006 300.98);
  --gray-700: oklch(36.98% 0.014 302.71);
  --gray-400: oklch(70.9% 0.015 304.04);

  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-size: 3.125rem;
  color: var(--gray-900);
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.125rem;
  margin: 0;
  font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
}
```

## 🗨️ Paso 4: Creación del Componente del Chat

### Generar el Componente:
```bash
ng generate component chat/cookies-chat
```

### Componente TypeScript `src/app/chat/cookies-chat/cookies-chat.ts`:
```typescript
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  parts: string;
  role: 'user' | 'model';
}

@Component({
  selector: 'app-cookies-chat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cookies-chat.html',
  styleUrl: './cookies-chat.css',
})
export class CookiesChat {
  API_KEY = environment.geminiApiKey;

  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  messageControl = new FormControl('', [Validators.required]);
  loading = signal(false);
  chatHistory = signal<ChatMessage[]>([]);

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    this.chat = this.model.startChat({ history: [] });
  }

  async handleSubmit(): Promise<void> {
    if (this.messageControl.invalid) {
      return;
    }

    const userMessage = this.messageControl.value || '';

    this.loading.set(true);
    this.chatHistory.update((currentHistory) => [
      ...currentHistory,
      { parts: userMessage, role: 'user' },
    ]);

    this.messageControl.setValue('');

    try {
      const result = await this.chat.sendMessage(userMessage);
      const response = await result.response;
      let botResponse = response.text();

      botResponse = botResponse
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');

      this.chatHistory.update((currentHistory) => [
        ...currentHistory,
        { parts: botResponse, role: 'model' },
      ]);
    } catch (error) {
      console.error('Error al enviar mensaje a Gemini:', error);
      this.chatHistory.update((currentHistory) => [
        ...currentHistory,
        { parts: 'Ups, algo salió mal. Intenta de nuevo.', role: 'model' },
      ]);
    } finally {
      this.loading.set(false);
    }
  }
}
```

### HTML del Componente `src/app/chat/cookies-chat/cookies-chat.html`:
```html
<div class="chat-container">
  <div class="chat-body">
    <div class="message bot">
      <p>¡Hola! Soy un experto en galletas 🍪. ¿Qué te gustaría hornear hoy?</p>
    </div>

    @for (item of chatHistory(); track $index) {
    <div class="message" [class.user]="item.role === 'user'" [class.bot]="item.role === 'model'">
      <p [innerHTML]="item.parts"></p>
    </div>
    }

    @if (loading()) {
    <div class="message bot">
      <p>Escribiendo...</p>
    </div>
    }
  </div>
  
  <div class="chat-footer">
    <input
      type="text"
      placeholder="Escribe tu pregunta sobre galletas..."
      [formControl]="messageControl"
      (keyup.enter)="handleSubmit()"
    />
    <button (click)="handleSubmit()" [disabled]="messageControl.invalid">
      Send
    </button>
  </div>
</div>
```

### CSS del Componente `src/app/chat/cookies-chat/cookies-chat.css`:
```css
.chat-container {
  width: 500px;
  height: 400px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.chat-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.user {
  background-color: rgb(121, 134, 249);
  text-align: right;
}

.bot {
  background-color: rgb(249, 242, 121);
  text-align: left;
}

.chat-footer {
  padding: 10px;
  display: flex;
}

.chat-footer input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chat-footer button {
  padding: 10px;
  background-color: oklch(69.02% 0.277 332.77);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
```

## 🚏 Paso 5: Configurar el Routing

### Editar `src/app/app.routes.ts`:
```typescript
import { Routes } from '@angular/router';
import { CookiesChat } from './chat/cookies-chat/cookies-chat';

export const routes: Routes = [
  { path: '', component: CookiesChat }
];
```

### Verificar `src/app/app.component.ts`:
```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = signal('cookies-gemini-chat');
}
```

## 🏃‍♂️ Paso 6: Ejecutar Localmente

```bash
npm start
```

## 🚀 Deployment

### Para Vercel
1. **Configurar variable de entorno en Vercel:**
   - Ve a tu proyecto en Vercel Dashboard
   - Settings > Environment Variables
   - Agregar: `VITE_GEMINI_API_KEY` = `tu-api-key-aqui`

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add chat application"
   git push
   ```

### Para GitHub Pages
1. **En tu repo: Settings > Secrets and variables > Actions**
2. **Agregar:** `VITE_GEMINI_API_KEY` = `tu-api-key-aqui`
3. **Crear `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/cookies-gemini-chat
```

### Para Netlify
1. **Configurar variable de entorno:**
   - Site settings > Environment variables
   - Agregar: `VITE_GEMINI_API_KEY` = `tu-api-key-aqui`

## ⚠️ Seguridad

- ❌ **NUNCA** commitees archivos con API keys
- ✅ Usa variables de entorno para production
- ✅ Los archivos `.env` están en `.gitignore`
- ✅ Usa secrets en GitHub/Vercel/Netlify

## 🎯 Conceptos Aprendidos

- ✅ **Componentes Standalone** para una arquitectura limpia
- ✅ **Routing** para cargar componentes
- ✅ **Formularios Reactivos** para manejo robusto de entrada
- ✅ **Signals** para manejo de estado reactivo
- ✅ **API externa (Gemini)** para IA
- ✅ **Variables de entorno** para deployment seguro

## 🚀 Próximos Pasos

1. ¿Cómo harías scroll automático hacia abajo?
2. ¿Cómo moverías la lógica de Gemini a un Servicio?
3. ¿Cómo añadirías `Validators.maxLength(200)`?

## 🆘 Solución de Problemas

### Si no funciona localmente:
1. Verifica que el archivo `.env` existe y tiene la API key
2. Reinicia el servidor: `npm start`
3. Revisa la consola del navegador para errores

### Si no funciona en deployment:
1. Verifica que la variable de entorno está configurada en la plataforma
2. Revisa los logs de build para errores
3. Asegúrate de que la API key es válida

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
