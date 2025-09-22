# Patrones de UX (Sin código)

Definimos patrones de interacción para asegurar consistencia y claridad.

## Navegación
- Navbar superior con acceso a Dashboard, Students, Courses, Reports (opcional).
- Sidebar con secciones y estados de navegación; colapsable en móvil.
- Breadcrumbs opcionales en páginas profundas.

## Filtros y búsqueda
- Filtros persistentes por cohorte, profesor y estado de entrega en Students y Courses.
- Búsqueda por nombre/email con debounce (300ms) — comportamiento definido, sin implementar.
- Botón "Clear filters" visible.

## Estados del sistema
- Loading: mostrar `Spinner` y skeletons en tablas.
- Empty: mensaje claro + acción principal ("Conectar Classroom", "Cambiar filtros").
- Error: mensaje claro con detalles resumidos + botón "Reintentar".
- Success: toasts breves (2–3s).

## Tablas y listados
- Cabecera sticky; columnas: nombre, cohorte, progreso, estado, acciones.
- Ordenamiento por columnas (si hay tiempo) o por defecto lógico.
- Paginación o carga incremental (React Query) — comportamiento documentado.

## Formularios
- Labels visibles; ayuda contextual; validación inline.
- Estados: disabled, readonly, error con color semántico.

## Acciones críticas
- Confirmaciones modales para acciones destructivas.
- Avisos de éxito/fracaso mediante toasts.

## Accesibilidad general
- Focus visible en todos los elementos interactivos.
- Teclado: Tab/Shift+Tab navegan toda la UI, ESC cierra modales.
- Roles ARIA adecuados en navegación (nav, main, aside).

## Microinteracciones
- Transiciones 150–250ms; feedback en hover/active.
- No bloquear UI en requests; mostrar progreso.
