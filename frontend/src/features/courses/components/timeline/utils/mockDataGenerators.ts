/**
 * Helper functions para generar contenido mock para el timeline
 */

export function getClassTopic(index: number): string {
  const topics = [
    'Introducción al Framework',
    'Componentes y Props',
    'Estado y Ciclo de Vida',
    'Manejo de Eventos',
    'Hooks Básicos',
    'Context API',
    'Routing y Navegación',
    'Formularios y Validación',
    'API Integration',
    'Testing Básico',
    'Performance Optimization',
    'Deployment',
    'Patrones Avanzados',
    'State Management',
    'Custom Hooks'
  ]
  return topics[index % topics.length]
}

export function getAssignmentTitle(index: number): string {
  const assignments = [
    'Ejercicio: Componente de Lista',
    'Práctica: Formulario de Contacto',
    'Proyecto: Todo App',
    'Tarea: API Integration',
    'Ejercicio: Custom Hook',
    'Práctica: Router Setup',
    'Proyecto: Dashboard',
    'Tarea: Testing Components',
    'Ejercicio: Performance',
    'Práctica: State Management'
  ]
  return assignments[index % assignments.length]
}

export function getAnnouncementTitle(index: number): string {
  const announcements = [
    'Cambio de horario para próxima clase',
    'Material adicional disponible',
    'Recordatorio: entrega de proyecto',
    'Nueva fecha de examen',
    'Recursos recomendados',
    'Consultas disponibles',
    'Actualización del cronograma'
  ]
  return announcements[index % announcements.length]
}
