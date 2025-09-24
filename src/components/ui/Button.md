# Componente Button

## Propósito
Componente de botón reutilizable con variantes y estados para la interfaz de usuario.

## Props Principales
- **variant**: 'primary' | 'secondary' | 'outline' | 'link'
- **size**: 'sm' | 'md' | 'lg'
- **disabled**: boolean
- **loading**: boolean
- **icon**: ReactNode opcional
- **onClick**: función de click

## Variantes de Estilo
- Basado en Bootstrap 5:
  - **Primary**: `btn btn-primary`
  - **Secondary**: `btn btn-secondary`
  - **Outline**: `btn btn-outline-*`
  - **Link**: `btn btn-link`

## Tamaños
- **Small**: 32px de altura, texto pequeño
- **Medium**: 40px de altura, texto normal
- **Large**: 48px de altura, texto grande

## Estados
- **Default**: Estado normal del botón
- **Hover**: Efecto al pasar el mouse
- **Active**: Estado al hacer click
- **Disabled**: Botón deshabilitado
- **Loading**: Estado de carga con spinner

## Accesibilidad
- **ARIA labels**: Para lectores de pantalla
- **Keyboard navigation**: Soporte para teclado
- **Focus states**: Estados de foco visibles
- **Screen reader support**: Texto descriptivo

## Integración
- Se usa en formularios y acciones
- Compatible con React Router
- Soporte para iconos de Lucide React
- Estilos con clases de Bootstrap 5

## Ejemplos de Uso
- Botones de acción en formularios
- Navegación entre páginas
- Confirmación de acciones
- Botones de filtro y búsqueda

