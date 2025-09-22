# Guía de Estilo (Sin código)

Este documento define look & feel para que, el día del evento, podamos generar el sistema visual de forma consistente.

## Identidad
- Nombre: ClassTrack
- Tagline: "Seguimiento claro, decisiones inteligentes"
- Tono: profesional, claro, empático y orientado a datos.

## Colores (tokens de referencia)
- Primario: Sky 500 — #0ea5e9 (acciones principales)
- Primario Hover: Sky 600 — #0284c7
- Secundario: Slate 600 — #475569 (textos secundarios)
- Fondo Claro: Slate 50 — #f8fafc
- Fondo Oscuro: Slate 900 — #0f172a
- Éxito: Green 500 — #22c55e
- Advertencia: Amber 500 — #f59e0b
- Error: Red 500 — #ef4444

## Tipografía
- Familia: Inter (o sistema equivalente)
- Escalas (claro/oscuro):
  - H1: 32/40, semibold
  - H2: 24/32, semibold
  - H3: 20/28, medium
  - Body: 16/24, regular
  - Small: 14/20, regular
  - Metrics: 36/44, bold

## Espaciado y radios
- Espaciado base: 4px scale (4, 8, 12, 16, 20, 24, 32, 40)
- Radios: sm=6, md=10, lg=14, xl=20
- Sombra: s, m, l (según profundidad)

## Componentes base (comportamiento visual)
- Botón
  - Variantes: primary, secondary, ghost, outline, destructive
  - Estados: default, hover, focus-visible, active, disabled, loading
- Input/Select
  - Labels accesibles, ayudatextos, error state con icon y color
- Card
  - Header (título + acción), body (contenido), footer (acciones)
- Table
  - Cabecera sticky, filas con hover, empty state con ilustración
- Badge/Tag
  - Estados: success, warning, error, info, neutral

## Layout
- Navbar superior + Sidebar (colapsable en móvil)
- Container central con padding responsivo (mobile-first)

## Iconografía
- Set: Lucide
- Usar 20–24px, color heredado del contexto

## Ilustraciones y estados vacíos
- Estilo lineal/simple, mensajes claros y acción principal visible

## Microinteracciones
- Transiciones 150–250ms, ease-out
- Feedback inmediato en hover/active/loading

## Accesibilidad
- Contraste AA mínimo (texto principal ≥ 4.5:1)
- Focus visible en todos los elementos interactivos
- Navegación por teclado completa
