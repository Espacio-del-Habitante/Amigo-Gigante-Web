# Guía de Uso de Traducciones (i18n)

## 📚 Cómo usar traducciones en tu código

### 1. **Estructura de archivos de traducción**

Las traducciones están organizadas por **namespace** (carpetas) y **locale** (idioma):

```
src/messages/
├── es/
│   ├── common.json    # Textos comunes (botones, labels, etc.)
│   ├── home.json      # Textos de la página home
│   └── register.json  # Textos del formulario de registro
└── en/
    ├── common.json
    ├── home.json
    └── register.json
```

### 2. **Ejemplo práctico: HeroSection.tsx**

Mira cómo se usa en `src/presentation/components/home/HeroSection.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";

export function HeroSection({ heroAnimals }: HeroSectionProps) {
  // 1. Importar el hook useTranslations
  // 2. Especificar el namespace (carpeta) que quieres usar
  const t = useTranslations("home");        // Para textos de home.json
  const common = useTranslations("common");  // Para textos de common.json

  return (
    <Box>
      {/* 3. Usar t("key") para obtener la traducción */}
      {/* La key debe coincidir con la estructura en el JSON */}
      
      <Chip label={t("hero.badge")} />
      {/* En español: "Más de 500 amigos buscando hogar" */}
      {/* En inglés: "Over 500 friends looking for a home" */}
      
      <Typography>
        {t("hero.title")}
        {/* En español: "Encuentra a tu" */}
        {/* En inglés: "Find your" */}
      </Typography>
      
      <TextField 
        placeholder={t("hero.searchPlaceholder")}
        /* En español: "Busca por nombre, ciudad o tipo" */
        /* En inglés: "Search by name, city, or type" */
      />
      
      <Button>
        {common("buttons.search")}
        {/* En español: "Buscar" */}
        {/* En inglés: "Search" */}
      </Button>
    </Box>
  );
}
```

### 3. **Estructura de las keys en JSON**

Las keys deben seguir la estructura anidada del JSON:

**src/messages/es/home.json:**
```json
{
  "hero": {
    "badge": "Más de 500 amigos buscando hogar",
    "title": "Encuentra a tu",
    "highlight": "Compañero Ideal",
    "subtitle": "Adoptar salva vidas...",
    "searchPlaceholder": "Busca por nombre, ciudad o tipo"
  },
  "filters": {
    "tags": {
      "dogs": "Perros",
      "cats": "Gatos",
      "sponsor": "Apadrinar"
    }
  }
}
```

**Uso en el componente:**
```tsx
t("hero.badge")           // ✅ "Más de 500 amigos buscando hogar"
t("hero.title")           // ✅ "Encuentra a tu"
t("filters.tags.dogs")    // ✅ "Perros"
```

### 4. **Ejemplo completo: Crear una nueva página**

Supongamos que quieres crear una página "About" (`/es/about` y `/en/about`):

#### Paso 1: Crear los archivos de traducción

**src/messages/es/about.json:**
```json
{
  "title": "Sobre Nosotros",
  "description": "Somos una plataforma dedicada a conectar mascotas con hogares amorosos.",
  "mission": {
    "title": "Nuestra Misión",
    "text": "Salvar vidas, una adopción a la vez."
  }
}
```

**src/messages/en/about.json:**
```json
{
  "title": "About Us",
  "description": "We are a platform dedicated to connecting pets with loving homes.",
  "mission": {
    "title": "Our Mission",
    "text": "Saving lives, one adoption at a time."
  }
}
```

#### Paso 2: Agregar el namespace al layout

**src/app/[locale]/layout.tsx:**
```tsx
// Agregar 'about' a la lista de imports
const [common, home, register, about] = await Promise.all([
  import(`@/messages/${locale}/common.json`),
  import(`@/messages/${locale}/home.json`),
  import(`@/messages/${locale}/register.json`),
  import(`@/messages/${locale}/about.json`),  // ← Nuevo
]);

const messages = {
  common: common.default,
  home: home.default,
  register: register.default,
  about: about.default,  // ← Nuevo
};
```

#### Paso 3: Crear la página

**src/app/[locale]/about/page.tsx:**
```tsx
"use client";

import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  // Usar el namespace "about"
  const t = useTranslations("about");

  return (
    <Container>
      <Typography variant="h1">
        {t("title")}
        {/* En español: "Sobre Nosotros" */}
        {/* En inglés: "About Us" */}
      </Typography>
      
      <Typography variant="body1">
        {t("description")}
      </Typography>
      
      <Box>
        <Typography variant="h2">
          {t("mission.title")}
        </Typography>
        <Typography>
          {t("mission.text")}
        </Typography>
      </Box>
    </Container>
  );
}
```

### 5. **Mejores prácticas**

✅ **DO (Hacer):**
- Usar keys descriptivas y anidadas: `hero.title`, `form.email.label`
- Mantener la misma estructura en todos los idiomas
- Usar `useMemo` para traducciones que se usan en arrays o objetos
- Agrupar traducciones relacionadas en el mismo namespace

❌ **DON'T (No hacer):**
- Hardcodear textos en los componentes
- Usar keys genéricas como `text1`, `text2`
- Olvidar agregar el namespace al layout cuando creas uno nuevo

### 6. **Ejemplo con useMemo (cuando necesites arrays)**

```tsx
const t = useTranslations("home");

// ✅ Correcto: usar useMemo para arrays de traducciones
const filterTags = useMemo(
  () => [
    t("filters.tags.dogs"),
    t("filters.tags.cats"),
    t("filters.tags.sponsor")
  ],
  [t]  // Dependencia del hook
);

// ❌ Incorrecto: crear el array directamente (se recrea en cada render)
const filterTags = [
  t("filters.tags.dogs"),
  t("filters.tags.cats"),
  t("filters.tags.sponsor")
];
```

### 7. **Resumen rápido**

```tsx
// 1. Importar
import { useTranslations } from "next-intl";

// 2. Usar el hook con el namespace
const t = useTranslations("home");

// 3. Obtener traducciones con la key
{t("hero.title")}

// 4. Para keys anidadas, usar punto
{t("filters.tags.dogs")}
```

---

**¿Necesitas ayuda?** Revisa los ejemplos en:
- `src/presentation/components/home/HeroSection.tsx`
- `src/presentation/components/organisms/NavBar/HomeNavBar.tsx`
- `src/presentation/components/register/RegisterForm.tsx`

