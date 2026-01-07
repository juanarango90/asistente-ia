'use client';

import { useState } from 'react';

/**
 * Custom hook para manejar la persistencia de datos en localStorage
 * 
 * Sincroniza el estado de React con localStorage, permitiendo que los datos
 * persistan entre recargas de la página.
 * 
 * @template T - Tipo genérico para el valor almacenado
 * @param key - Clave única en localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns Tupla con el valor actual y función para actualizarlo
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Solo ejecutar en el cliente (evitar errores de SSR)
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Intentar obtener el valor de localStorage
      const item = window.localStorage.getItem(key);
      // Si existe, parsearlo; si no, usar el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error al parsear, usar el valor inicial
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que value sea una función para actualizaciones basadas en el valor anterior
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en el estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage (solo en el cliente)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

