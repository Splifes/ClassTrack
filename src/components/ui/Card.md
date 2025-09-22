# Componente Card

## Propósito
Componente de tarjeta reutilizable para mostrar información estructurada en la interfaz.

## Props Principales
- **title**: string opcional
- **subtitle**: string opcional
- **children**: contenido de la tarjeta
- **className**: clases CSS adicionales
- **onClick**: función de click opcional
- **hover**: boolean para efecto hover

## Variantes de Estilo
- **Default**: Tarjeta estándar con borde sutil
- **Elevated**: Tarjeta con sombra para destacar
- **Outlined**: Tarjeta con borde más visible
- **Filled**: Tarjeta con fondo de color

## Estructura de la Tarjeta
- **Header**: Título y subtítulo opcionales
- **Body**: Contenido principal (children)
- **Footer**: Acciones o información adicional
- **Actions**: Botones o enlaces de acción

## Estados
- **Default**: Estado normal de la tarjeta
- **Hover**: Efecto al pasar el mouse
- **Active**: Estado al hacer click
- **Loading**: Estado de carga con skeleton
- **Error**: Estado de error con mensaje

## Casos de Uso
- **Dashboard Cards**: Métricas y estadísticas
- **Student Cards**: Información de estudiantes
- **Course Cards**: Detalles de cursos
- **Submission Cards**: Estado de entregas
- **Notification Cards**: Alertas y notificaciones

## Accesibilidad
- **Semantic HTML**: Uso de elementos semánticos
- **Keyboard navigation**: Soporte para teclado
- **Screen reader support**: Texto descriptivo
- **Focus management**: Manejo de foco

## Integración
- Compatible con Tailwind CSS
- Soporte para iconos de Lucide React
- Integración con React Router
- Responsive design

## Ejemplos de Uso
- Tarjetas de métricas en dashboard
- Lista de estudiantes con información
- Detalles de cursos y tareas
- Notificaciones y alertas

