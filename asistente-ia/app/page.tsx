'use client';

import { useState } from 'react';
import { useAssistants } from '@/lib/context/assistant-context';
import { AssistantCard } from '@/components/assistant/assistant-card';
import { EmptyState } from '@/components/assistant/empty-state';
import { Button } from '@/components/ui/button';
import { Assistant } from '@/types/assistant';

export default function Home() {
  const { assistants, deleteAssistant } = useAssistants();
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
    null
  );

  function handleEdit(assistant: Assistant) {
    setEditingAssistant(assistant);
    // TODO: Abrir modal de edición (Paso 4)
    console.log('Editar asistente:', assistant);
  }

  function handleDelete(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este asistente?')) {
      deleteAssistant(id);
    }
  }

  function handleCreate() {
    setEditingAssistant(null);
    // TODO: Abrir modal de creación (Paso 4)
    console.log('Crear nuevo asistente');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Asistentes IA
            </h1>
            <p className="mt-2 text-gray-600">
              Crea y gestiona tus asistentes de inteligencia artificial
            </p>
          </div>
          <Button onClick={handleCreate} size="lg">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Asistente
          </Button>
        </div>

        {/* Listado de asistentes */}
        {assistants.length === 0 ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistants.map((assistant) => (
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
