'use client';

import { useState, useEffect } from 'react';
import { useAssistants } from '@/lib/context/assistant-context';
import { AssistantCard } from '@/components/assistant/assistant-card';
import { AssistantModal } from '@/components/assistant/assistant-modal';
import { EmptyState } from '@/components/assistant/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Assistant } from '@/types/assistant';

export default function Home() {
  const { assistants, createAssistant, updateAssistant, deleteAssistant } =
    useAssistants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    assistantId: string | null;
    assistantName: string;
  }>({ isOpen: false, assistantId: null, assistantName: '' });
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isVisible: false, message: '', type: 'success' });

  // Evitar error de hidratación: solo renderizar después de montar en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleEdit(assistant: Assistant) {
    setEditingAssistant(assistant);
    setIsModalOpen(true);
  }

  function handleDelete(id: string) {
    const assistant = assistants.find((a) => a.id === id);
    setDeleteConfirm({
      isOpen: true,
      assistantId: id,
      assistantName: assistant?.name || 'este asistente',
    });
  }

  function confirmDelete() {
    if (deleteConfirm.assistantId) {
      deleteAssistant(deleteConfirm.assistantId);
      showToast('Asistente eliminado correctamente', 'success');
    }
    setDeleteConfirm({ isOpen: false, assistantId: null, assistantName: '' });
  }

  function handleCreate() {
    setEditingAssistant(null);
    setIsModalOpen(true);
  }

  function handleSave(assistantData: Omit<Assistant, 'id'>) {
    if (editingAssistant) {
      // Modo edición: actualizar asistente existente
      updateAssistant(editingAssistant.id, assistantData);
      showToast('Asistente actualizado correctamente', 'success');
    } else {
      // Modo creación: crear nuevo asistente
      createAssistant(assistantData);
      showToast('Asistente creado correctamente', 'success');
    }
    setIsModalOpen(false);
    setEditingAssistant(null);
  }

  function showToast(
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) {
    setToast({ isVisible: true, message, type });
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingAssistant(null);
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
        {!isMounted ? (
          // Placeholder mientras carga (evita error de hidratación)
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-400">Cargando...</div>
          </div>
        ) : assistants.length === 0 ? (
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

      {/* Modal de creación/edición */}
      <AssistantModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        assistant={editingAssistant}
      />

      {/* Dialog de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() =>
          setDeleteConfirm({ isOpen: false, assistantId: null, assistantName: '' })
        }
        onConfirm={confirmDelete}
        title="Eliminar Asistente"
        message={`¿Estás seguro de que deseas eliminar "${deleteConfirm.assistantName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
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
