Guía para los componentes UI de la capa de presentación.

## Atomic Design en Amigo Gigante

La carpeta `components` se organiza siguiendo Atomic Design:

- **Atoms**: piezas básicas estilizadas con los tokens del Design System.
- **Molecules**: combinaciones sencillas de atoms que resuelven una acción puntual.
- **Organisms**: componentes complejos que usan molecules/atoms y resuelven una sección completa.
- **Layouts**: contenedores reutilizables para secciones o páginas.
- **home/**: componentes específicos de la página home que se irán migrando gradualmente.

### Convenciones

- Nombres en PascalCase y sufijos coherentes con su nivel (ej. `StatusChip`, `NavBar`).
- Usar siempre los tokens del Design System (`brand`, `accent`, `neutral`) desde el tema de MUI o Tailwind.
- Evitar estilos inline arbitrarios: preferir `sx` con valores del tema o utilidades de Tailwind.
- Las nuevas piezas deben vivir en su nivel correspondiente y exponerse con un `index.ts` local.
