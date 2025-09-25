# Design Token to Bootstrap Variable Mapping

Este documento describe cómo los design tokens de ClassTrack se mapean a variables CSS y variables de Bootstrap 5.

## Color Mapping

| Design Token | CSS Variable | Bootstrap Variable | Usage |
|--------------|--------------|-------------------|--------|
| `palette.primary.500` | `--color-primary-500` | `--bs-primary` | Botones primarios, enlaces |
| `palette.success.500` | `--color-success-500` | `--bs-success` | Estados de éxito, badges |
| `palette.warning.500` | `--color-warning-500` | `--bs-warning` | Alertas, badges de advertencia |
| `palette.error.500` | `--color-error-500` | `--bs-danger` | Errores, validaciones |
| `palette.neutral.600` | `--color-neutral-600` | `--bs-secondary` | Texto secundario |
| `palette.neutral.100` | `--color-neutral-100` | `--bs-light` | Fondos claros |
| `palette.neutral.900` | `--color-neutral-900` | `--bs-dark` | Texto principal, navbar |

## Typography Mapping

| Design Token | CSS Variable | Bootstrap Variable | Usage |
|--------------|--------------|-------------------|--------|
| `font.family.base` | `--font-family-base` | `--bs-body-font-family` | Fuente principal |
| `font.lineHeight.normal` | `--font-line-height-normal` | `--bs-body-line-height` | Interlineado base |
| `font.size.h1` | `--font-size-h1` | N/A | Títulos principales |
| `font.size.metrics` | `--font-size-metrics` | N/A | Números grandes en dashboards |

## Spacing Mapping

| Design Token | CSS Variable | Bootstrap Class | Usage |
|--------------|--------------|----------------|--------|
| `space[0]` (4px) | `--space-1` | `.gap-1` | Espaciado mínimo |
| `space[1]` (8px) | `--space-2` | `.gap-2` | Espaciado pequeño |
| `space[2]` (12px) | `--space-3` | `.gap-3` | Espaciado medio |
| `space[3]` (16px) | `--space-4` | `.gap-4` | Espaciado estándar |
| `space[4]` (20px) | `--space-5` | `.gap-5` | Espaciado grande |
| `space[5]` (24px) | `--space-6` | `.gap-6` | Espaciado extra grande |

## Border Radius Mapping

| Design Token | CSS Variable | Bootstrap Variable | Usage |
|--------------|--------------|-------------------|--------|
| `radius.sm` | `--radius-sm` | `--bs-border-radius` | Botones, inputs |
| `radius.md` | `--radius-md` | `--bs-border-radius-lg` | Cards, modales |
| `radius.lg` | `--radius-lg` | `--bs-border-radius-xl` | Elementos destacados |
| `radius.xl` | `--radius-xl` | `--bs-border-radius-2xl` | Elementos especiales |

## Shadow Mapping

| Design Token | CSS Variable | Bootstrap Variable | Usage |
|--------------|--------------|-------------------|--------|
| `elevation.s` | `--elevation-s` | `--bs-box-shadow-sm` | Cards, botones |
| `elevation.m` | `--elevation-m` | `--bs-box-shadow-lg` | Modales, dropdowns |
| `elevation.l` | `--elevation-l` | N/A | Elementos flotantes |

## Motion Mapping

| Design Token | CSS Variable | Bootstrap Variable | Usage |
|--------------|--------------|-------------------|--------|
| `motion.duration.fast` | `--motion-duration-fast` | N/A | Hover effects |
| `motion.duration.normal` | `--motion-duration-normal` | `--bs-transition` | Transiciones generales |
| `motion.easing.default` | `--motion-easing-default` | N/A | Curva de animación |

## Custom Utilities Added

### Spacing
- `.gap-1` through `.gap-10` - Utilidades de gap para flexbox/grid
- `.container-narrow` - Contenedor con ancho máximo de 960px

### Visual
- `.shadow-s`, `.shadow-m`, `.shadow-l` - Sombras personalizadas
- `.rounded-sm`, `.rounded-md`, `.rounded-lg`, `.rounded-xl` - Border radius
- `.text-metrics` - Estilo para números grandes en dashboards

### Animation
- `.transition-fast`, `.transition-normal` - Transiciones personalizadas

### Color
- `.text-neutral-600`, `.text-neutral-900` - Colores de texto neutrales
- `.bg-neutral-50`, `.bg-neutral-100` - Fondos neutrales

## Enhanced Bootstrap Components

### Cards
- Sombra sutil por defecto
- Hover effect con elevación
- Bordes redondeados con nuestros tokens

### Buttons
- Font weight 500
- Hover effect con elevación
- Transiciones suaves

### Forms
- Focus states con color primario
- Border radius personalizado
- Transiciones suaves

### Tables
- Headers con fondo neutral
- Border radius en contenedor
- Mejor contraste en headers

## Usage Examples

```css
/* Usando tokens directamente */
.custom-card {
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-s);
  padding: var(--space-4);
}

/* Usando utilidades personalizadas */
<div className="card shadow-m rounded-lg gap-4">
  <h2 className="text-metrics">42</h2>
</div>

/* Bootstrap con nuestros colores */
<button className="btn btn-primary">
  <!-- Usa automáticamente --bs-primary (nuestro azul) -->
</button>
```

## Benefits

1. **Consistencia**: Todos los componentes usan los mismos tokens
2. **Mantenibilidad**: Cambios centralizados en `theme.css`
3. **Bootstrap Compatible**: No rompe el ecosistema de Bootstrap
4. **Performance**: Solo CSS variables, sin JavaScript
5. **Accesibilidad**: Focus states mejorados y contrastes adecuados
