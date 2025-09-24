# Índice de Componentes UI

## Propósito
Archivo de barril (barrel) que exporta todos los componentes de UI para facilitar las importaciones.

## Componentes Exportados
- **Button**: Componente de botón reutilizable
- **Card**: Componente de tarjeta para información
- **Input**: Campo de entrada de texto
- **Select**: Lista desplegable de opciones
- **Modal**: Ventana modal para diálogos
- **Table**: Tabla de datos con paginación
- **Badge**: Etiqueta para estados y categorías
- **Spinner**: Indicador de carga
- **Alert**: Mensaje de alerta o notificación

## Patrón de Exportación
```typescript
export { Button } from './Button'
export { Card } from './Card'
export { Input } from './Input'
// ... más componentes
```

## Beneficios
- **Importaciones Limpias**: Un solo import para todos los componentes
- **Tree Shaking**: Solo se importan los componentes usados
- **Mantenimiento**: Fácil agregar o quitar componentes
- **Consistencia**: Patrón uniforme de importación

## Uso en la Aplicación
```typescript
import { Button, Card, Input } from '@/components/ui'
```

## Organización
- Cada componente en su propio archivo
- Props tipadas con TypeScript
- Estilos con clases de Bootstrap 5 y CSS propio cuando sea necesario
- Accesibilidad integrada
- Documentación en cada componente

