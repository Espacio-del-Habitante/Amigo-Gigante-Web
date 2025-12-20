Layouts reutilizables para estructurar secciones y páginas.

- Encapsulan paddings, fondos y contenedores comunes (ej. `Section`).
- No incluyen lógica de negocio; solo definen esqueleto y spacing.
- Deben usar tokens del Design System para colores y espacios.
- Las páginas consumen estos layouts para mantener consistencia vertical/horizontal.

### Ejemplo de uso

```tsx
<Section background="muted" spacingY={{ xs: 12, md: 16 }}>
  <Typography variant="h4">Título de sección</Typography>
  <Content />
  <Actions />
</Section>
```
