# Módulo de Gestión de Asistentes IA

Aplicación web responsive desarrollada con Next.js para la gestión completa de asistentes de inteligencia artificial. Permite crear, editar, eliminar y entrenar asistentes con persistencia local de datos.

## 🚀 Características

- **Gestión de Asistentes**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Modal Multi-paso**: Formulario de creación/edición con validaciones en tiempo real
- **Configuración Avanzada**: Personalización de longitud de respuestas, idioma, tono y audio
- **Entrenamiento**: Sistema de entrenamiento con persistencia de reglas e instrucciones
- **Chat Simulado**: Interfaz de chat para probar las respuestas del asistente
- **Persistencia Local**: Todos los datos se guardan en localStorage del navegador
- **Diseño Responsive**: Optimizado para móvil y desktop

## 🛠️ Tecnologías

- **Framework**: [Next.js 16.1.1](https://nextjs.org/) con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Persistencia**: LocalStorage (navegador)
- **Runtime**: React 19.2.3

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm, yarn, pnpm o bun

## 🔧 Instalación

1. Clona el repositorio o descarga el proyecto
2. Instala las dependencias:

```bash
npm install
```

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para Producción

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
asistente-ia/
├── app/                    # Next.js App Router
│   ├── [id]/              # Ruta dinámica para entrenamiento
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal (listado)
├── components/            # Componentes reutilizables
├── hooks/                 # Custom hooks
├── lib/                   # Utilidades y helpers
├── types/                 # Definiciones de TypeScript
│   └── assistant.ts       # Interfaces y tipos
└── public/                # Assets estáticos
```

## 🎯 Funcionalidades Principales

### 1. Listado de Asistentes
- Vista en tarjetas con información del asistente
- Menú de acciones (Editar, Eliminar, Entrenar)
- Estado vacío cuando no hay asistentes

### 2. Creación/Edición de Asistentes
- **Paso 1**: Datos básicos (nombre, idioma, tono)
- **Paso 2**: Configuración avanzada (longitud de respuestas, audio)
- Validaciones en tiempo real
- Validación de porcentajes (debe sumar 100%)

### 3. Entrenamiento
- Área de texto para prompts e instrucciones
- Persistencia en localStorage
- Chat simulado con delay realista

### 4. Chat Simulado
- Interfaz de mensajes
- Respuestas simuladas con delay de 1-2 segundos
- Reinicio de conversación

## 🧠 Decisiones Técnicas

### Arquitectura y Stack

#### **Next.js 16 con App Router**
- **Razón**: App Router es la forma moderna y recomendada de Next.js. Proporciona Server Components por defecto, mejorando el rendimiento.
- **Beneficios**: Renderizado del lado del servidor automático, optimización de bundles, routing basado en archivos intuitivo.

#### **TypeScript**
- **Razón**: Type safety en tiempo de compilación previene errores antes de ejecutar el código.
- **Implementación**: Interfaces estrictas para todos los datos, evitando `any` y usando tipos específicos.

#### **Componentes UI Custom (sin librerías externas)**
- **Razón**: Siguiendo las mejores prácticas de Next.js oficial, se crearon todos los componentes desde cero usando solo Tailwind CSS y React.
- **Ventajas**: 
  - Control total sobre el código
  - Sin dependencias externas que aumenten el bundle
  - Componentes específicos para las necesidades del proyecto
  - Mejor rendimiento
- **Componentes creados**: Modal, Input, Select, Checkbox, Textarea, Button, Badge, Card, Toast, ConfirmDialog

### Gestión de Estado

#### **React Context API**
- **Razón**: Para un proyecto de este tamaño, Context API es suficiente y evita dependencias adicionales como Redux o Zustand.
- **Implementación**: `AssistantProvider` que encapsula toda la lógica CRUD y expone métodos a través del contexto.
- **Ventajas**: Sin dependencias externas, integración nativa con React, suficiente para el scope del proyecto.

#### **Custom Hook `useLocalStorage`**
- **Razón**: Abstrae la lógica de persistencia en localStorage y la sincroniza automáticamente con el estado de React.
- **Beneficios**: Reutilizable, maneja errores, compatible con SSR de Next.js.

### Persistencia

#### **LocalStorage (requisito del proyecto)**
- **Implementación**: Custom hook que sincroniza estado de React con localStorage automáticamente.
- **Consideraciones**: 
  - Los datos son específicos del navegador/dispositivo
  - Limitación de ~5-10MB según el navegador
  - Sincronización automática en cada cambio

### UX/UI

#### **Validaciones en Tiempo Real**
- **Decisión**: En lugar de usar `alert()` nativos (como sugiere el PDF), implementé validaciones inline con mensajes de error claros.
- **Razón**: Mejor experiencia de usuario, no bloquea la interacción, feedback inmediato.

#### **Toast en lugar de Alert**
- **Decisión**: Sistema de notificaciones tipo toast en lugar de `alert()` del navegador.
- **Razón**: 
  - No bloquea la interacción
  - Diseño consistente con la aplicación
  - Auto-cierre automático (3 segundos)
  - Mejor UX profesional

#### **ConfirmDialog Personalizado**
- **Decisión**: Modal de confirmación custom en lugar de `confirm()` nativo.
- **Razón**: 
  - Diseño moderno y consistente
  - Mensajes más descriptivos
  - Botones personalizables
  - Indicador visual de acciones destructivas (botón rojo)

#### **Diseño Mobile-First**
- **Implementación**: Grid responsive que se adapta: 1 columna (móvil), 2 columnas (tablet), 3 columnas (desktop).
- **Razón**: La mayoría de usuarios acceden desde móvil primero.

### Prevención de Errores de Hidratación

#### **Estado `isMounted`**
- **Problema**: Next.js renderiza en servidor (sin localStorage) y luego en cliente (con localStorage), causando mismatch.
- **Solución**: Detectar cuando el componente está montado en el cliente antes de mostrar datos de localStorage.
- **Implementación**: `useEffect` que activa un flag después del primer render del cliente.

### Chat Simulado

#### **Delay Aleatorio 1-2 segundos**
- **Implementación**: `Math.random() * 1000 + 1000` para simular latencia de red variable.
- **Razón**: Experiencia más realista, simula comportamiento de API real.

#### **Respuestas Aleatorias**
- **Implementación**: Array predefinido con selección aleatoria usando `Math.random()`.
- **Razón**: Variedad en la experiencia, simula diferentes respuestas de IA.

### Principios Aplicados

- **SOLID**: Cada componente tiene una responsabilidad única
- **DRY**: Componentes y funciones reutilizables
- **KISS**: Soluciones simples y directas, sin over-engineering

## ✨ Características Implementadas

### Requisitos Obligatorios (100%)
- ✅ Página principal con listado en tarjetas
- ✅ Modal de creación/edición de 2 pasos
- ✅ Validaciones en tiempo real
- ✅ Página de entrenamiento con área de texto
- ✅ Chat simulado con delay y respuestas aleatorias
- ✅ Funcionalidad de eliminación con confirmación
- ✅ Persistencia en localStorage
- ✅ Diseño responsive (mobile y desktop)
- ✅ Loading states
- ✅ Estados de error claros
- ✅ Componentes reutilizables
- ✅ TypeScript
- ✅ Next.js con App Router

### Extras Implementados
- ✅ Sistema de notificaciones (toasts) profesional
- ✅ Dialog de confirmación personalizado
- ✅ Animaciones suaves en toda la app
- ✅ Indicador de "escribiendo..." en el chat
- ✅ Scroll automático en el chat
- ✅ Timestamps en mensajes
- ✅ Feedback visual inmediato en todas las acciones
- ✅ Estado vacío con call-to-action
- ✅ Botón de reiniciar conversación
- ✅ Validación defensiva para evitar errores de datos
- ✅ Accesibilidad (aria-labels, navegación por teclado)

## ⏱️ Tiempo de Dedicación

**Tiempo total aproximado: 25-27 horas**

Desglose por etapa:
- **Configuración inicial y tipos**: 1.50 horas
- **Persistencia y estado global**: 3.5 horas
- **Componentes UI base**: 3.5 horas
- **Página principal y listado**: 3 hora
- **Modal multi-paso con validaciones**: 3.5 horas
- **Página de entrenamiento**: 3.5 horas
- **Chat simulado**: 4 horas
- **Mejoras de UX (Toast, ConfirmDialog)**: 2 hora
- **Testing y correcciones**: 2 hora

## 📊 Datos de Ejemplo

La aplicación incluye 2 asistentes de ejemplo que se cargan automáticamente:
- **Asistente de Ventas** (Español, Profesional)
- **Soporte Técnico** (Inglés, Amigable)

## 💾 Persistencia de Datos

Todos los datos se almacenan en `localStorage` del navegador:
- Los asistentes persisten entre sesiones
- Las reglas de entrenamiento se guardan por asistente
- Los datos son específicos del navegador/dispositivo





