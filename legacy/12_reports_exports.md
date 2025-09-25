# Prompt 12 — Reportes avanzados y exportables

Objetivo: generar vistas de reportes con gráficos (Recharts) y exportación (CSV/PNG/PDF opcional).

Instrucciones
- Tipos y datos
  - `src/types/reports.ts`: contratos para métricas (por cohorte, por curso, por alumno) y series de tiempo.
  - Derivar métricas desde hooks existentes (`useProgressMetrics`, `useRiskFlags`) y datos de Classroom.
- UI de reportes
  - `src/pages/Reports.tsx`: tabs para "Cohortes", "Cursos", "Alumnos".
  - Componentes: `src/components/charts/BarChart.tsx`, `src/components/charts/LineChart.tsx` (wrappers tipados sobre Recharts con estilos comunes).
  - Filtros compartidos (rango de fechas, cohorte, profesor, curso).
- Exportación
  - CSV: util `src/lib/exportCsv.ts` (genera y descarga CSV en el cliente).
  - PNG/PDF (opcional, si hay tiempo): capturar el contenedor con `html-to-image`/`dom-to-image` o similar (justificar dependencia si se usa) y descargar.
- Aceptación
  - Métricas calculadas y mostradas en gráficos y tablas.
  - Exportar CSV de la vista actual (filtros aplicados).
  - Código modular y reutilizable.
- Calidad
  - Tipado estricto, sin `any`.
  - Componentes de gráficos desacoplados, accesibilidad (descripciones/labels).
  - Evitar bloqueos: loaders y estados vacíos bien manejados.
