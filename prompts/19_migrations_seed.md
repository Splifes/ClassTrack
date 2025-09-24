# Prompt 19 — Migraciones y Datos Seed — Roadmap (Opcional)

Nota: Bajo Opción A, el backend Flask proxyea Google Classroom y la app puede funcionar sin DB propia. Estas migraciones/seed aplican solo si se adopta Supabase u otra DB. Ver `ClassTrack/README02.md` (Architecture Option A).

Objetivo: organizar scripts SQL para versionar el esquema y cargar datos de ejemplo.

## Estructura sugerida
```
/db
  /migrations
    001_init.sql
    002_indexes.sql
    003_policies.sql
  /seed
    001_minimal_demo.sql
```

## Flujo con Supabase CLI
```
supabase db push               # aplicar cambios locales al proyecto
supabase db reset --db-url ... # reset + seed en local
```

## Reglas
- Un cambio por archivo de migración, con comentarios claros.
- Seeds idempotentes (usar `on conflict do nothing`).

## Ejemplo seed mínimo
```sql
-- Tenant demo
insert into public.users (id, tenant_id, email, role)
values ('00000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','demo-coord@example.com','coordinator')
on conflict do nothing;
```

## Aceptación
- Migraciones aplican en orden sin errores.
- Seed permite demostrar dashboard sin integrar Google aún.
