import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from './../../../environments/environment';

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
  API_KEY = environment.API_KEY;

  private genAI: GoogleGenerativeAI;
  private model: any; // GenerativeModel
  private chat: any; // ChatSession
  messageControl = new FormControl('', [Validators.required]);
  loading = signal(false);
  chatHistory = signal<ChatMessage[]>([]);

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
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
    // 1. Validar el formulario
    if (this.messageControl.invalid) {
      return; // Si es inválido, no hacer nada
    }

    const userMessage = this.messageControl.value || '';

    // 2. Actualizar el estado con Signals
    this.loading.set(true); // ¡Empezamos a cargar!
    // .update() toma el valor actual y retorna uno nuevo
    this.chatHistory.update((currentHistory) => [
      ...currentHistory,
      { parts: userMessage, role: 'user' },
    ]);

    // 3. Limpiar el input
    this.messageControl.setValue('');

    try {
      // 4. Enviar el mensaje a Gemini
      const result = await this.chat.sendMessage(userMessage);
      const response = await result.response;
      let botResponse = response.text();

      // 5. Formatear la respuesta (como en tu código original)
      // (Nota: Esta no es la forma más robusta, pero funciona para el demo)
      botResponse = botResponse
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // **texto** -> <b>texto</b>
        .replace(/\*(.*?)\*/g, '<li>$1</li>') // *texto* -> <li>texto</li>
        .replace(/\n/g, '<br>'); // Saltos de línea

      // 6. Actualizar el historial con la respuesta del bot
      this.chatHistory.update((currentHistory) => [
        ...currentHistory,
        { parts: botResponse, role: 'model' },
      ]);
    } catch (error) {
      console.error('Error al enviar mensaje a Gemini:', error);
      // Opcional: mostrar un mensaje de error en el chat
      this.chatHistory.update((currentHistory) => [
        ...currentHistory,
        { parts: 'Ups, algo salió mal. Intenta de nuevo.', role: 'model' },
      ]);
    } finally {
      // 7. Dejar de cargar (¡siempre!)
      this.loading.set(false);
    }
  }
}
