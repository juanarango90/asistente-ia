'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Assistant, seedAssistants } from '@/types/assistant';
import { useLocalStorage } from '@/hooks/use-local-storage';

/**
 * Interfaz del contexto de asistentes
 * Define las operaciones CRUD disponibles
 */
interface AssistantContextType {
  assistants: Assistant[];
  createAssistant: (assistant: Omit<Assistant, 'id'>) => void;
  updateAssistant: (id: string, assistant: Partial<Assistant>) => void;
  deleteAssistant: (id: string) => void;
  getAssistantById: (id: string) => Assistant | undefined;
}

/**
 * Contexto de React para gestionar el estado global de asistentes
 */
const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

/**
 * Props del Provider
 */
interface AssistantProviderProps {
  children: ReactNode;
}

/**
 * Provider que envuelve la aplicación y proporciona el estado global
 * de asistentes con persistencia en localStorage
 */
export function AssistantProvider({ children }: AssistantProviderProps) {
  // Hook personalizado para localStorage con datos de ejemplo como valor inicial
  const [assistants, setAssistants] = useLocalStorage<Assistant[]>(
    'assistants',
    seedAssistants
  );

  /**
   * Crea un nuevo asistente
   * Genera un ID único basado en timestamp y random
   */
  function createAssistant(assistant: Omit<Assistant, 'id'>) {
    const newAssistant: Assistant = {
      ...assistant,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setAssistants((prev) => [...prev, newAssistant]);
  }

  /**
   * Actualiza un asistente existente
   */
  function updateAssistant(id: string, updates: Partial<Assistant>) {
    setAssistants((prev) =>
      prev.map((assistant) =>
        assistant.id === id ? { ...assistant, ...updates } : assistant
      )
    );
  }

  /**
   * Elimina un asistente por ID
   */
  function deleteAssistant(id: string) {
    setAssistants((prev) => prev.filter((assistant) => assistant.id !== id));
  }

  /**
   * Obtiene un asistente por su ID
   */
  function getAssistantById(id: string): Assistant | undefined {
    return assistants.find((assistant) => assistant.id === id);
  }

  const value: AssistantContextType = {
    assistants,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    getAssistantById,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de asistentes
 * Lanza un error si se usa fuera del Provider
 */
export function useAssistants() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistants must be used within an AssistantProvider');
  }
  return context;
}

