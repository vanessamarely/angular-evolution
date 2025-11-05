// Este script se ejecuta en el servidor de Vercel ANTES del build
const fs = require('fs');
const path = require('path');

// Obtenemos la API key desde las variables de entorno de Vercel
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error('Error: GEMINI_API_KEY no está definida en las variables de entorno de Vercel.');
  process.exit(1);
}

// Ruta al archivo de entorno de producción
const envFilePath = path.join(__dirname, 'src/environments/environment.prod.ts');

// Contenido que se escribirá en el archivo
const envFileContent = `
export const environment = {
  production: true,
  API_KEY: '${geminiApiKey}'
};
`;

// Escribimos el archivo
try {
  fs.writeFileSync(envFilePath, envFileContent);
  console.log(`Archivo environment.prod.ts actualizado con éxito.`);
} catch (err) {
  console.error('Error al escribir el archivo environment.prod.ts:', err);
  process.exit(1);
}