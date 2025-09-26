export function getClassTopic(classNumber: number): string {
  const topics = [
    'Introducción y Conceptos Básicos',
    'Fundamentos del Framework',
    'Componentes y Arquitectura',
    'Estado y Gestión de Datos',
    'Eventos y Interactividad',
    'Hooks y Funcionalidades Avanzadas',
    'Routing y Navegación',
    'Formularios y Validación',
    'Integración con APIs',
    'Testing y Calidad',
    'Performance y Optimización',
    'Deployment y Producción',
    'Patrones de Diseño',
    'State Management Avanzado',
    'Proyecto Final'
  ]
  return topics[(classNumber - 1) % topics.length]
}
