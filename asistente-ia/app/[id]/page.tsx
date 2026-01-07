'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAssistants } from '@/lib/context/assistant-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Toast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { simulatedResponses } from '@/types/assistant';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

/**
 * Página de entrenamiento de un asistente específico
 * Incluye sección de entrenamiento y chat simulado
 */
export default function TrainingPage() {
  const params = useParams();
  const router = useRouter();
  const { getAssistantById, updateAssistant } = useAssistants();
  const [isMounted, setIsMounted] = useState(false);
  
  const assistantId = params.id as string;
  const assistant = getAssistantById(assistantId);

  // Estados
  const [rules, setRules] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isVisible: false, message: '', type: 'success' });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Evitar error de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar reglas del asistente
  useEffect(() => {
    if (assistant?.rules) {
      setRules(assistant.rules);
    }
  }, [assistant]);

  // Scroll automático al final del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Si no existe el asistente, redirigir
  useEffect(() => {
    if (isMounted && !assistant) {
      router.push('/');
    }
  }, [isMounted, assistant, router]);

  // Guardar reglas de entrenamiento
  function handleSaveRules() {
    if (!assistant) return;
    
    setIsSaving(true);
    updateAssistant(assistantId, { rules });
    
    // Simular guardado
    setTimeout(() => {
      setIsSaving(false);
      showToast('Reglas guardadas correctamente', 'success');
    }, 500);
  }

  function showToast(
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) {
    setToast({ isVisible: true, message, type });
  }

  // Enviar mensaje en el chat
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay de respuesta (1-2 segundos)
    const delay = Math.random() * 1000 + 1000; // 1000-2000ms
    
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Seleccionar respuesta aleatoria
    const randomResponse =
      simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];

    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      text: randomResponse,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  }

  // Reiniciar conversación
  function handleResetChat() {
    setResetConfirm(true);
  }

  function confirmReset() {
    setMessages([]);
    setResetConfirm(false);
    showToast('Conversación reiniciada', 'info');
  }

  // Mostrar loading mientras se monta
  if (!isMounted || !assistant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {assistant.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="info">{assistant.language}</Badge>
                <Badge variant="default">{assistant.tone}</Badge>
                {assistant.audioEnabled && <Badge variant="success">Audio</Badge>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sección de Entrenamiento */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Entrenamiento del Asistente
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Define las reglas e instrucciones que guiarán el comportamiento del
              asistente.
            </p>

            <Textarea
              label="Reglas y prompts"
              placeholder="Ejemplo: Eres un asistente especializado en ventas. Siempre sé cordial..."
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={12}
              className="mb-4"
            />

            <Button onClick={handleSaveRules} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Reglas'}
            </Button>
          </div>

          {/* Sección de Chat Simulado */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Chat Simulado
              </h2>
              <Button variant="ghost" size="sm" onClick={handleResetChat}>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reiniciar
              </Button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Envía un mensaje para comenzar la conversación
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {/* Indicador de "escribiendo..." */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input de mensaje */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Escribe un mensaje..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
                className="flex-1"
              />
              <Button type="submit" disabled={isTyping || !inputMessage.trim()}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Dialog de confirmación para reiniciar chat */}
      <ConfirmDialog
        isOpen={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={confirmReset}
        title="Reiniciar Conversación"
        message="¿Estás seguro de que deseas reiniciar la conversación? Se perderán todos los mensajes."
        confirmText="Reiniciar"
        cancelText="Cancelar"
        isDestructive
      />

      {/* Toast de notificaciones */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}

