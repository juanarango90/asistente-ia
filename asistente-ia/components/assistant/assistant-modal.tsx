'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Assistant } from '@/types/assistant';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assistant: Omit<Assistant, 'id'>) => void;
  assistant?: Assistant | null;
}

interface FormData {
  name: string;
  language: 'Español' | 'Inglés' | 'Portugués';
  tone: 'Formal' | 'Casual' | 'Profesional' | 'Amigable';
  short: number;
  medium: number;
  long: number;
  audioEnabled: boolean;
}

interface FormErrors {
  name?: string;
  percentages?: string;
}

/**
 * Modal de creación/edición de asistentes
 * Formulario de 2 pasos con validaciones
 */
export function AssistantModal({
  isOpen,
  onClose,
  onSave,
  assistant,
}: AssistantModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    language: 'Español',
    tone: 'Profesional',
    short: 33,
    medium: 34,
    long: 33,
    audioEnabled: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (assistant) {
        // Modo edición: cargar datos del asistente
        setFormData({
          name: assistant.name,
          language: assistant.language,
          tone: assistant.tone,
          short: assistant.responseLength.short,
          medium: assistant.responseLength.medium,
          long: assistant.responseLength.long,
          audioEnabled: assistant.audioEnabled,
        });
      } else {
        // Modo creación: resetear formulario
        setFormData({
          name: '',
          language: 'Español',
          tone: 'Profesional',
          short: 33,
          medium: 34,
          long: 33,
          audioEnabled: false,
        });
      }
      setStep(1);
      setErrors({});
    }
  }, [isOpen, assistant]);

  // Validar paso 1
  function validateStep1(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Validar paso 2
  function validateStep2(): boolean {
    const newErrors: FormErrors = {};
    const total = formData.short + formData.medium + formData.long;

    if (total !== 100) {
      const diff = 100 - total;
      if (diff > 0) {
        newErrors.percentages = `La suma debe ser 100%. Faltan ${diff}%`;
      } else {
        newErrors.percentages = `La suma debe ser 100%. Sobran ${Math.abs(diff)}%`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Manejar siguiente paso
  function handleNext() {
    if (validateStep1()) {
      setStep(2);
    }
  }

  // Manejar guardar
  function handleSave() {
    if (validateStep2()) {
      const assistantData: Omit<Assistant, 'id'> = {
        name: formData.name.trim(),
        language: formData.language,
        tone: formData.tone,
        responseLength: {
          short: formData.short,
          medium: formData.medium,
          long: formData.long,
        },
        audioEnabled: formData.audioEnabled,
        rules: assistant?.rules || '',
      };
      onSave(assistantData);
      onClose();
    }
  }

  // Manejar cambios en inputs
  function handleChange(field: keyof FormData, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar errores al editar
    setErrors({});
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assistant ? 'Editar Asistente' : 'Crear Asistente'}
    >
      {/* Indicador de pasos */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 1
                ? 'bg-blue-600 text-white'
                : 'bg-green-600 text-white'
            }`}
          >
            {step > 1 ? '✓' : '1'}
          </div>
          <div
            className={`w-16 h-1 ${
              step === 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 2
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            2
          </div>
        </div>
      </div>

      {/* Paso 1: Datos Básicos */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Datos Básicos
          </h3>

          <Input
            label="Nombre del asistente"
            placeholder="Ej: Asistente de Ventas"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <Select
            label="Idioma"
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            required
          >
            <option value="Español">Español</option>
            <option value="Inglés">Inglés</option>
            <option value="Portugués">Portugués</option>
          </Select>

          <Select
            label="Tono"
            value={formData.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
            required
          >
            <option value="Formal">Formal</option>
            <option value="Casual">Casual</option>
            <option value="Profesional">Profesional</option>
            <option value="Amigable">Amigable</option>
          </Select>

          <div className="flex justify-end pt-4">
            <Button onClick={handleNext}>Siguiente</Button>
          </div>
        </div>
      )}

      {/* Paso 2: Configuración de Respuestas */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Configuración de Respuestas
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Longitud de respuestas{' '}
                <span className="text-red-500">*</span>
              </label>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Cortas</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.short}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.short}
                    onChange={(e) =>
                      handleChange('short', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Medianas</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.medium}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.medium}
                    onChange={(e) =>
                      handleChange('medium', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Largas</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.long}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.long}
                    onChange={(e) =>
                      handleChange('long', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Total:
                </span>
                <span
                  className={`text-sm font-bold ${
                    formData.short + formData.medium + formData.long === 100
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formData.short + formData.medium + formData.long}%
                </span>
              </div>

              {errors.percentages && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.percentages}
                </p>
              )}
            </div>

            <Checkbox
              label="Habilitar respuestas de audio"
              checked={formData.audioEnabled}
              onChange={(e) => handleChange('audioEnabled', e.target.checked)}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Atrás
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

