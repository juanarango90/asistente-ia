/**
 * Tipos e interfaces para el módulo de gestión de asistentes IA
 * 
 * Define el contrato de datos que representa un asistente de IA
 * con todas sus propiedades y configuraciones.
 */

export interface ResponseLength {
  short: number;
  medium: number;
  long: number;
}

export interface Assistant {
  id: string;
  name: string;
  language: "Español" | "Inglés" | "Portugués";
  tone: "Formal" | "Casual" | "Profesional" | "Amigable";
  responseLength: ResponseLength;
  audioEnabled: boolean;
  rules?: string;
}

/**
 * Datos de ejemplo para inicializar la aplicación
 * Estos asistentes se cargarán automáticamente si no hay datos en localStorage
 */
export const seedAssistants: Assistant[] = [
  {
    id: "1",
    name: "Asistente de Ventas",
    language: "Español",
    tone: "Profesional",
    responseLength: {
      short: 30,
      medium: 50,
      long: 20,
    },
    audioEnabled: true,
    rules: "Eres un asistente especializado en ventas. Siempre sé cordial y enfócate en identificar necesidades del cliente antes de ofrecer productos.",
  },
  {
    id: "2",
    name: "Soporte Técnico",
    language: "Inglés",
    tone: "Amigable",
    responseLength: {
      short: 20,
      medium: 30,
      long: 50,
    },
    audioEnabled: false,
    rules: "Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar.",
  },
];

/**
 * Respuestas simuladas para el chat
 * Estas respuestas se seleccionan aleatoriamente con un delay simulado
 */
export const simulatedResponses: string[] = [
  "Entendido, ¿en qué más puedo ayudarte?",
  "Esa es una excelente pregunta. Déjame explicarte...",
  "Claro, con gusto te ayudo con eso.",
  "¿Podrías darme más detalles sobre tu consulta?",
  "Perfecto, he registrado esa información.",
  "Comprendo tu situación. Te sugiero lo siguiente...",
  "Gracias por esa información. Ahora puedo ayudarte mejor.",
  "Excelente, vamos a resolver esto juntos.",
];

