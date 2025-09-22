# Especificaciones de Componentes (Sin código)

Este documento define el comportamiento y props esperadas de los componentes clave sin implementar código. Sirve como contrato para la generación durante el evento.

## Button
- Variantes: primary | secondary | ghost | outline | destructive
- Tamaños: sm | md | lg
- Props:
  - `children` (contenido)
  - `variant` (default: primary)
  - `size` (default: md)
  - `disabled`, `loading`
  - `leftIcon`, `rightIcon` (opcional)
  - `aria-label` cuando no hay texto visible
- Estados visuales: default, hover, focus-visible, active, disabled, loading
- Accesibilidad: foco visible, `aria-busy` cuando `loading`

## Input
- Props: `id`, `label`, `placeholder`, `value`, `onChange`, `error`, `helpText`, `required`
- Accesibilidad: `label` asociado por `for/id`, `aria-invalid` cuando `error`, `aria-describedby` a help/error

## Select
- Props: `id`, `label`, `options: {value,label}[]`, `value`, `onChange`, `placeholder`, `error`
- Estados: abierto/cerrado, item activo/seleccionado
- Accesibilidad: navegable por teclado, roles ARIA de listbox/options

## Card
- Slots: `header` (título + acción), `content`, `footer`
- Variantes: default, elevated, outlined

## Table
- Props: `columns`, `data`, `loading`, `emptyState`
- Comportamiento: cabecera sticky, filas hover, columnas responsivas
- Accesibilidad: `table` semántica, `scope="col"`, captions opcionales

## Badge
- Variantes: success | warning | error | info | neutral
- Uso: estados/etiquetas pequeñas con color semántico

## Spinner
- Props: `size`, `aria-label` (p.ej. "Cargando")

## Layout (Navbar/Sidebar/Layout)
- Navbar: marca, navegación principal, usuario (email/rol)
- Sidebar: navegación por secciones; colapsable en móvil
- Layout: contenedor central, breadcrumbs opcionales, slots para acciones
