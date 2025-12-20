Componentes atómicos: piezas básicas y autocontenidas.

- Solo resuelven una función puntual (botón, chip, icono, logotipo).
- No contienen lógica de negocio ni dependencias de routing.
- Deben estilizarse usando los tokens del Design System (`palette.primary`, `palette.secondary`, `text`, `background`).
- Exportar cada atom desde un `index.ts` dentro de su carpeta y opcionalmente desde `atoms/index.ts`.

### Atoms disponibles

- `Button`: wrapper estilizado de MUI `Button` con `tone` (`primary | secondary | neutral`), `variant` (`solid | outlined | ghost`) y `rounded` (`pill | default`).
  ```tsx
  <Button tone="secondary" variant="outlined" startIcon={<Icon />} rounded="default">
    Acción
  </Button>
  ```
- `Chip`: badges con tonos del sistema y variantes `solid`/`soft`.
  ```tsx
  <Chip tone="brand" variant="soft" label="Nuevo" size="small" />
  ```
- `IconButton`: icon buttons con variantes `ghost` y `filled`.
  ```tsx
  <IconButton tone="primary" variant="ghost" aria-label="Buscar">
    <SearchIcon />
  </IconButton>
  ```
- `Logo`: isotipo/logotipo reusable con `size` y `showWordmark`.
  ```tsx
  <Logo size={48} showWordmark />
  ```
