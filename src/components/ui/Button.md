# Componente Button

## Propósito
Componente de botón reutilizable con variantes y estados para la interfaz de usuario.

## Props Principales
- **variant**: 'primary' | 'secondary' | 'outline' | 'ghost'
- **size**: 'sm' | 'md' | 'lg'
- **disabled**: boolean
- **loading**: boolean
- **icon**: ReactNode opcional
- **onClick**: función de click

## Variantes de Estilo
- **Primary**: Botón principal con fondo azul
- **Secondary**: Botón secundario con fondo gris
- **Outline**: Botón con borde y fondo transparente
- **Ghost**: Botón sin fondo ni borde

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
- Integración con Tailwind CSS

## Ejemplos de Uso
- Botones de acción en formularios
- Navegación entre páginas
- Confirmación de acciones
- Botones de filtro y búsqueda

