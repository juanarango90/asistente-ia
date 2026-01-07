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

## 📊 Datos de Ejemplo

La aplicación incluye 2 asistentes de ejemplo que se cargan automáticamente:
- **Asistente de Ventas** (Español, Profesional)
- **Soporte Técnico** (Inglés, Amigable)

## 💾 Persistencia de Datos

Todos los datos se almacenan en `localStorage` del navegador:
- Los asistentes persisten entre sesiones
- Las reglas de entrenamiento se guardan por asistente
- Los datos son específicos del navegador/dispositivo

## 🎨 Diseño

- Diseño responsive mobile-first
- Interfaz moderna y limpia
- Estados de carga y error claros
- Feedback visual para todas las acciones

## 📝 Notas

- Los datos se guardan localmente en el navegador
- El chat es simulado (no usa IA real)
- Compatible con todos los navegadores modernos

## 📄 Licencia

Este proyecto es privado y está desarrollado como prueba técnica.
