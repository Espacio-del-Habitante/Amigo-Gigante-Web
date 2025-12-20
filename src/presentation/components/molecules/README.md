Molecules: combinaciones simples de atoms con una única responsabilidad.

- Orquestan atoms sin introducir estados complejos.
- Usan tokens del Design System y heredan estilos de los atoms que componen.
- Ejemplos: enlaces de navegación, chips con lógica de color, botones con iconos.
- Deben mantenerse genéricas para reutilizarse en distintas pantallas.

### Molecules disponibles

- `NavLink`: enlace de navegación tipográfico con estado activo.
  ```tsx
  <NavLink href="/adopta" label="Adopta" active />
  ```
- `SearchButton`: `IconButton` preconfigurado con icono de búsqueda.
  ```tsx
  <SearchButton tone="neutral" variant="ghost" />
  ```
- `StatusChip`: chip que aplica el tono según el `AnimalStatus`.
  ```tsx
  <StatusChip status="Apadrinamiento" />
  ```
