# 🎨 Design System — Amigo Gigante (v1)

Este documento define el **Design System oficial** del proyecto **Amigo Gigante**.

📌 **Regla fundamental**  
Tailwind es la **fuente de verdad** para estilos.  
MUI debe reflejar exactamente estos tokens.

---

## 🎯 Objetivos

- Consistencia visual en toda la app
- Evitar tamaños, colores y estilos arbitrarios
- Facilitar trabajo con agentes IA y nuevos devs
- Escalabilidad sin deuda visual

---

## 🎨 Colores

### Brand (Azul / Teal)

```ts
brand: {
  50:  "#E6FBFF",
  100: "#C8F6FF",
  200: "#9DEEFF",
  300: "#6FE5FF",
  400: "#45EBED",
  500: "#19D3D6",
  600: "#0FB3B6",
  700: "#0A8F91",
  800: "#066E70",
  900: "#044D4E",
}
```

---

### Accent (Amarillo — Apadrinar)

```ts
accent: {
  50:  "#FFFBEB",
  100: "#FEF3C7",
  200: "#FDE68A",
  300: "#FCD34D",
  400: "#FBBF24",
  500: "#F59E0B",
  600: "#D97706",
  700: "#B45309",
}
```

---

### Neutrales

```ts
neutral: {
  0:   "#FFFFFF",
  50:  "#F7F9FC",
  100: "#EEF2F7",
  200: "#D9E2EF",
  300: "#B7C3D6",
  400: "#8B98B0",
  500: "#66748B",
  600: "#4B5669",
  700: "#353D4B",
  800: "#232834",
  900: "#141824",
}
```

---

## 🔤 Tipografía

| Uso | Clase | px |
|---|---|---|
| Caption | text-sm | 14 |
| Body | text-base | 16 |
| Subtitle | text-lg | 18 |
| H3 | text-2xl | 24 |
| H2 | text-3xl | 30 |
| H1 | text-4xl | 36 |

---

## 📐 Layout

- Contenedor estándar:
```
max-w-6xl mx-auto px-4 md:px-6 lg:px-10
```

---

## 🔘 Botones

- **Primary**: brand-500 (Adoptar, Explorar)
- **Accent**: accent-500 (Apadrinar)
- **Secondary**: outline / neutral

---

## 🚦 Reglas

- ❌ No estilos inline
- ❌ No colores fuera de tokens
- ✅ Todo cambio pasa por este documento
