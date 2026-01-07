'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Assistant } from '@/types/assistant';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AssistantCardProps {
  assistant: Assistant;
  onEdit: (assistant: Assistant) => void;
  onDelete: (id: string) => void;
}

/**
 * Componente de tarjeta para mostrar un asistente
 * Incluye menú de acciones (Editar, Eliminar, Entrenar)
 */
export function AssistantCard({
  assistant,
  onEdit,
  onDelete,
}: AssistantCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toneColors: Record<string, 'default' | 'success' | 'warning' | 'info'> =
    {
      Formal: 'default',
      Casual: 'success',
      Profesional: 'info',
      Amigable: 'warning',
    };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {assistant.name}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="info">{assistant.language}</Badge>
              <Badge variant={toneColors[assistant.tone] || 'default'}>
                {assistant.tone}
              </Badge>
              {assistant.audioEnabled && (
                <Badge variant="success">Audio</Badge>
              )}
            </div>
            {assistant.responseLength && (
              <div className="text-sm text-gray-600">
                <p>
                  Respuestas: {assistant.responseLength.short}% cortas,{' '}
                  {assistant.responseLength.medium}% medianas,{' '}
                  {assistant.responseLength.long}% largas
                </p>
              </div>
            )}
          </div>

          {/* Menú de acciones */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menú de acciones"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(assistant);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Editar
                  </button>
                  <Link
                    href={`/${assistant.id}`}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrenar
                  </Link>
                  <button
                    onClick={() => {
                      onDelete(assistant.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

