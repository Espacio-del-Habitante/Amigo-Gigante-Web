# 🎨 Design System — Amigo Gigante

Este documento describe los **tokens oficiales** y reglas de uso del Design System. Tailwind es la fuente de verdad; el tema de MUI refleja exactamente estos valores.

---

## Paleta de colores

- **Brand** (`brand`): gradiente azul para acciones primarias (500: `#1cb0f6`, 300: `#4dc7ff`, 700: `#0f6ab3`).
- **Accent** (`accent`): naranja para estados destacados o secundarios (500: `#f97316`, 300: `#ffa55a`, 700: `#b54109`).
- **Neutral** (`neutral`): escala gris/azulada para fondos y texto (50: `#f8fafc`, 600: `#334155`, 800: `#0f172a`, white/black definidos).
- Solo se permiten colores definidos en `tailwind.config.ts` (`brand`, `accent`, `neutral`); se prohíben colores inline fuera de estos tokens.

## Tipografía

- Fuente base: `Poppins, Arial, sans-serif` (`fontFamily.sans`).
- Pesos fuertes (`fontWeightBold: 800`) para títulos (`h4`, `h5`) en MUI.
- En Tailwind usar `font-sans` para heredar la familia definida en los tokens.

## Espaciado y esquinas

- Radio de borde oficial `lg` = `16px` (equivalente al `shape.borderRadius` de MUI). Otros radios disponibles: `sm` (8px), `md` (12px), `xl` (24px), `full`.
- Mantener consistencia usando las clases de Tailwind (`rounded-lg`, `rounded-md`, etc.). Evitar valores ad-hoc en línea.

## Sombras

- Sombras tokenizadas en Tailwind (`soft`, `focus`, `strong`):
  - `soft`: relieve suave para tarjetas.
  - `focus`: halo azul para estados de foco/accesibilidad.
  - `strong`: profundidad pronunciada para overlays.
- El tema MUI reutiliza estos mismos valores en su configuración de `shadows`.

## Botones y reglas de uso

- **Primarios**: usan `brand` (MUI `palette.primary`, Tailwind `bg-brand-500`).
- **Secundarios/destacados**: usan `accent` (MUI `palette.secondary`, Tailwind `bg-accent-500`).
- Texto sobre fondos de color debe usar neutrales claros (`neutral-50`) para garantizar contraste.
- Deshabilitado: reducir opacidad, sin cambiar tokens de color.

## Convenciones obligatorias

- Tailwind es la fuente de verdad; cualquier cambio de tokens se realiza en `tailwind.config.ts`.
- MUI no puede definir colores ni tamaños fuera de los tokens. `palette.primary` ⇔ `brand`, `palette.secondary` ⇔ `accent`.
- Evitar estilos inline: preferir utilidades de Tailwind o el tema de MUI.
- No agregar nuevas dependencias de estilos sin aprobación.

---

Cumpliendo estas reglas se garantiza consistencia visual y alineación entre Tailwind y MUI.
