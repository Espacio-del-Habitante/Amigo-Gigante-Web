# 🎓 Cómo Funciona Este Proyecto - Guía Práctica

> **Para desarrolladores que quieren entender realmente cómo funciona el código**

Esta guía explica **paso a paso** cómo funciona el proyecto, usando ejemplos reales del código. Si sientes que construiste todo con "vibe coding" y no entiendes realmente cómo funciona, esta guía es para ti.

---

## 📚 Tabla de Contenidos

1. [La Arquitectura en 3 Minutos](#la-arquitectura-en-3-minutos)
2. [Ejemplo Real: Cómo Funciona el Login](#ejemplo-real-cómo-funciona-el-login)
3. [Las 3 Capas Explicadas](#las-3-capas-explicadas)
4. [Cómo Funciona el Routing (Next.js)](#cómo-funciona-el-routing-nextjs)
5. [Cómo Funciona la Internacionalización (i18n)](#cómo-funciona-la-internacionalización-i18n)
6. [Cómo Funciona la Inyección de Dependencias (IoC)](#cómo-funciona-la-inyección-de-dependencias-ioc)
7. [Cómo Funciona la Autenticación](#cómo-funciona-la-autenticación)
8. [Flujo Completo: Registro de Fundación](#flujo-completo-registro-de-fundación)

---

## La Arquitectura en 3 Minutos

### El Concepto Clave: Capas con Dependencias Unidireccionales

Imagina una cebolla 🧅:

```
┌─────────────────────────────────────┐
│   PRESENTATION (La Cáscara)         │  ← Lo que el usuario ve
│   - Componentes React               │
│   - Páginas Next.js                 │
│   - Hooks personalizados            │
└─────────────────────────────────────┘
              │
              ▼ (solo puede llamar)
┌─────────────────────────────────────┐
│   DOMAIN (El Núcleo)                │  ← La lógica de negocio
│   - Use Cases (casos de uso)        │
│   - Interfaces de repositorios      │
│   - Modelos de datos                │
└─────────────────────────────────────┘
              │
              ▼ (solo puede llamar)
┌─────────────────────────────────────┐
│   INFRASTRUCTURE (La Implementación)│  ← Conexiones externas
│   - Repositorios (Supabase)         │
│   - Configuración                   │
│   - IoC Container                   │
└─────────────────────────────────────┘
```

**Regla de Oro**: Las dependencias siempre van hacia adentro. El Domain nunca sabe que existe Supabase, React, o Next.js.

### ¿Por qué esta arquitectura?

1. **Testeable**: Puedes probar la lógica de negocio sin necesidad de Supabase o React
2. **Mantenible**: Si cambias de Supabase a Firebase, solo tocas Infrastructure
3. **Escalable**: Agregar features nuevas no rompe lo existente

---

## Ejemplo Real: Cómo Funciona el Login

Vamos a seguir el flujo completo de un login, archivo por archivo:

### 1. El Usuario Hace Click en "Iniciar Sesión"

**Archivo**: `src/presentation/components/login/LoginForm.tsx`

```typescript
// El usuario llena el formulario y hace submit
const formik = useFormik({
  onSubmit: async (values) => {
    // 1. Obtiene el UseCase del contenedor IoC
    const loginUseCase = appContainer.get<LoginUseCase>(USE_CASE_TYPES.LoginUseCase);
    
    // 2. Ejecuta el caso de uso
    const result = await loginUseCase.execute({
      email: values.email,
      password: values.password,
    });
    
    // 3. Redirige según el rol
    router.push(`/${locale}/foundations`);
  }
});
```

**¿Qué está pasando?**
- El componente UI (Presentation) NO llama directamente a Supabase
- En su lugar, llama a un "UseCase" que está en Domain
- El UseCase se obtiene de un "contenedor" (IoC) que inyecta las dependencias

### 2. El UseCase Ejecuta la Lógica de Negocio

**Archivo**: `src/domain/usecases/auth/LoginUseCase.ts`

```typescript
export class LoginUseCase {
  // El repositorio se inyecta automáticamente (no lo creamos nosotros)
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    // 1. Llama al repositorio (que es una INTERFAZ, no implementación)
    const { user, session } = await this.authRepository.signIn({
      email: input.email,
      password: input.password,
    });

    // 2. Retorna el resultado
    return {
      user,
      session,
      role: user.role,
    };
  }
}
```

**¿Qué está pasando?**
- El UseCase NO sabe que existe Supabase
- Solo conoce la INTERFAZ `IAuthRepository` (que está en Domain)
- La implementación real está en Infrastructure, pero el UseCase no lo sabe

### 3. El Repositorio Implementa la Conexión con Supabase

**Archivo**: `src/infrastructure/repositories/AuthRepository.ts`

```typescript
class AuthRepository implements IAuthRepository {
  async signIn(params: SignInParams): Promise<SignInResult> {
    // AQUÍ es donde finalmente se usa Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      throw new Error(this.translateSignInError(error));
    }

    // Obtiene el rol del usuario desde la base de datos
    const role = await this.fetchUserRole(data.user.id);

    return {
      user: this.mapUserWithRole(data.user, role),
      session: this.mapSessionWithRole(data.session, role),
    };
  }
}
```

**¿Qué está pasando?**
- Esta es la ÚNICA capa que conoce Supabase
- Convierte los datos de Supabase a los modelos del Domain
- Maneja errores y los traduce a mensajes legibles

### 4. El Contenedor IoC Conecta Todo

**Archivo**: `src/infrastructure/ioc/container.ts`

```typescript
// Este archivo "conecta" las interfaces con las implementaciones
const appContainer = new Container();

// Registra: "Cuando alguien pida IAuthRepository, dale AuthRepository"
appContainer.bind<IAuthRepository>(REPOSITORY_TYPES.AuthRepository)
  .to(AuthRepository);

// Registra: "Cuando alguien pida LoginUseCase, créalo con AuthRepository inyectado"
appContainer.bind<LoginUseCase>(USE_CASE_TYPES.LoginUseCase)
  .to(LoginUseCase);
```

**¿Qué está pasando?**
- El contenedor IoC es como un "directorio telefónico"
- Cuando alguien pide `LoginUseCase`, el contenedor:
  1. Crea `AuthRepository`
  2. Crea `LoginUseCase` pasándole `AuthRepository` como parámetro
  3. Retorna el `LoginUseCase` listo para usar

---

## Las 3 Capas Explicadas

### 🎨 Presentation Layer (Lo que el usuario ve)

**Ubicación**: `src/presentation/`

**Responsabilidades**:
- Componentes React/UI
- Páginas de Next.js
- Hooks personalizados (`useAuth`, etc.)
- Manejo de formularios (Formik)

**Puede**:
- ✅ Llamar a UseCases del Domain
- ✅ Usar hooks de React
- ✅ Renderizar UI

**NO puede**:
- ❌ Llamar directamente a Supabase
- ❌ Conocer detalles de implementación de repositorios

**Ejemplo**:
```typescript
// ✅ CORRECTO: Llama a un UseCase
const loginUseCase = appContainer.get<LoginUseCase>(USE_CASE_TYPES.LoginUseCase);
await loginUseCase.execute({ email, password });

// ❌ INCORRECTO: Llamar directamente a Supabase
await supabaseClient.auth.signInWithPassword({ email, password });
```

### 🧠 Domain Layer (La lógica de negocio)

**Ubicación**: `src/domain/`

**Responsabilidades**:
- Define QUÉ hace la aplicación (no CÓMO)
- Use Cases (casos de uso)
- Interfaces de repositorios (contratos)
- Modelos de datos del negocio

**Puede**:
- ✅ Definir interfaces
- ✅ Contener lógica de negocio pura
- ✅ Definir modelos de datos

**NO puede**:
- ❌ Importar React, Next.js, Supabase
- ❌ Conocer detalles de implementación

**Ejemplo**:
```typescript
// ✅ CORRECTO: Define una interfaz (contrato)
export interface IAuthRepository {
  signIn(params: SignInParams): Promise<SignInResult>;
}

// ✅ CORRECTO: UseCase con lógica de negocio
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}
  async execute(input: LoginInput): Promise<LoginResult> {
    // Lógica de negocio aquí
  }
}
```

### 🔧 Infrastructure Layer (Las implementaciones)

**Ubicación**: `src/infrastructure/`

**Responsabilidades**:
- Implementa las interfaces del Domain
- Conexiones externas (Supabase, APIs, etc.)
- Configuración
- IoC Container (conecta todo)

**Puede**:
- ✅ Usar Supabase, APIs externas, etc.
- ✅ Implementar repositorios
- ✅ Configurar servicios externos

**Ejemplo**:
```typescript
// ✅ CORRECTO: Implementa la interfaz del Domain
class AuthRepository implements IAuthRepository {
  async signIn(params: SignInParams): Promise<SignInResult> {
    // Aquí SÍ se usa Supabase
    const { data } = await supabaseClient.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });
    // ...
  }
}
```

---

## Cómo Funciona el Routing (Next.js)

### Estructura de Archivos = Rutas

Next.js usa el sistema de archivos para crear rutas automáticamente:

```
src/app/
├── [locale]/              ← Segmento dinámico (es, en)
│   ├── page.tsx           → /es o /en
│   ├── login/
│   │   └── page.tsx        → /es/login o /en/login
│   ├── register/
│   │   └── page.tsx        → /es/register o /en/register
│   └── foundations/
│       ├── layout.tsx      ← Layout que envuelve todas las rutas /foundations/*
│       ├── page.tsx        → /es/foundations
│       └── profile/
│           └── page.tsx    → /es/foundations/profile
```

### El Proxy (Middleware)

**Archivo**: `src/proxy.ts`

Este archivo se ejecuta ANTES de que Next.js renderice cualquier página. Es como un "guardián" que:

1. **Maneja i18n**: Asegura que todas las rutas tengan un locale (`/es/...` o `/en/...`)
2. **Protege rutas**: Verifica si el usuario está autenticado antes de permitir acceso
3. **Redirige**: Si no hay locale, redirige a `/es/...` (o el locale por defecto)

**Flujo**:
```
Usuario visita: /login
    ↓
proxy.ts intercepta
    ↓
Detecta que no hay locale
    ↓
Redirige a: /es/login
    ↓
Next.js renderiza: src/app/[locale]/login/page.tsx
```

---

## Cómo Funciona la Internacionalización (i18n)

### Configuración

**Archivo**: `src/i18n/config.ts`

```typescript
export const locales = ["es", "en"] as const;
export const defaultLocale = "es";
```

### Archivos de Traducción

**Ubicación**: `src/messages/{locale}/*.json`

```
src/messages/
├── es/
│   ├── login.json
│   ├── register.json
│   └── ...
└── en/
    ├── login.json
    ├── register.json
    └── ...
```

### Uso en Componentes

```typescript
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("login"); // Namespace: "login"
  
  return <h1>{t("form.title")}</h1>; // Busca en login.json → form.title
}
```

**¿Cómo funciona?**
1. El componente usa `useTranslations("login")`
2. Next-intl busca el locale actual (de la URL: `/es/...` o `/en/...`)
3. Carga `src/messages/{locale}/login.json`
4. Retorna la traducción correspondiente

### Layout con Traducciones

**Archivo**: `src/app/[locale]/layout.tsx`

Este layout:
1. Extrae el `locale` de la URL (`[locale]` es un segmento dinámico)
2. Carga los archivos JSON de traducción correspondientes
3. Envuelve todos los componentes hijos con `NextIntlClientProvider`
4. Ahora todos los componentes pueden usar `useTranslations`

---

## Cómo Funciona la Inyección de Dependencias (IoC)

### El Problema que Resuelve

Sin IoC, tendrías que hacer esto en cada componente:

```typescript
// ❌ MAL: Crear dependencias manualmente
const authRepository = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
```

Con IoC, solo pides lo que necesitas:

```typescript
// ✅ BIEN: El contenedor se encarga de todo
const loginUseCase = appContainer.get<LoginUseCase>(USE_CASE_TYPES.LoginUseCase);
```

### Cómo Funciona el Contenedor

**Archivo**: `src/infrastructure/ioc/usecases/usecases.container.ts`

```typescript
// 1. Define un "tipo" (identificador único)
export const USE_CASE_TYPES = {
  LoginUseCase: Symbol("LoginUseCase"),
  RegisterFoundationUseCase: Symbol("RegisterFoundationUseCase"),
} as const;

// 2. Registra: "Cuando pidan LoginUseCase, crea uno nuevo"
container.bind<LoginUseCase>(USE_CASE_TYPES.LoginUseCase)
  .to(LoginUseCase);
```

**¿Qué hace `.to(LoginUseCase)`?**
- InversifyJS ve que `LoginUseCase` necesita `IAuthRepository` en su constructor
- Busca en el contenedor si hay algo registrado como `IAuthRepository`
- Encuentra `AuthRepository` (registrado en `repositories.container.ts`)
- Crea `AuthRepository` primero
- Crea `LoginUseCase` pasándole `AuthRepository`
- Retorna el `LoginUseCase` listo para usar

### Ventajas

1. **Testeable**: Puedes cambiar `AuthRepository` por un mock en tests
2. **Centralizado**: Cambias la implementación en un solo lugar
3. **Automático**: No tienes que crear dependencias manualmente

---

## Cómo Funciona la Autenticación

### Flujo Completo

```
1. Usuario llena formulario de login
   ↓
2. LoginForm llama a LoginUseCase
   ↓
3. LoginUseCase llama a AuthRepository.signIn()
   ↓
4. AuthRepository usa Supabase para autenticar
   ↓
5. Supabase retorna usuario y sesión
   ↓
6. AuthRepository obtiene el rol desde la tabla `profiles`
   ↓
7. AuthRepository retorna usuario + sesión + rol
   ↓
8. LoginUseCase retorna el resultado
   ↓
9. LoginForm redirige según el rol:
   - foundation_user → /foundations
   - admin → /admin
   - external → /external
```

### Protección de Rutas

**Archivo**: `src/proxy.ts`

El proxy verifica si el usuario está autenticado antes de permitir acceso:

```typescript
// Si la ruta NO es pública
if (!isPublic) {
  // Obtiene la sesión (en desarrollo usa mock, en producción consulta Supabase)
  const session = await getSession();
  
  // Si no hay sesión, redirige a login
  if (!session) {
    return NextResponse.redirect("/login");
  }
}
```

### Mock en Desarrollo

Para facilitar el desarrollo, el proxy crea una sesión "falsa" en desarrollo:

```typescript
if (process.env.NODE_ENV === "development") {
  // Crea una sesión mock según la ruta
  if (pathname.startsWith("/foundations")) {
    session = { user: { role: "foundation_user" }, ... };
  }
}
```

Esto permite probar rutas protegidas sin tener que hacer login real.

---

## Flujo Completo: Registro de Fundación

Vamos a seguir el flujo completo de registro, paso a paso:

### 1. Usuario Llena el Formulario

**Archivo**: `src/presentation/components/register/RegisterForm.tsx`

```typescript
onSubmit: async (values) => {
  // Obtiene el UseCase
  const registerUseCase = appContainer.get<RegisterFoundationUseCase>(...);
  
  // Ejecuta el registro
  await registerUseCase.execute({
    foundationName: values.foundationName,
    officialEmail: values.officialEmail,
    password: values.password,
    taxId: values.taxId,
  });
  
  // Redirige
  router.push(`/${locale}/foundations`);
}
```

### 2. El UseCase Orquesta Todo

**Archivo**: `src/domain/usecases/auth/RegisterFoundationUseCase.ts`

```typescript
async execute(input: RegisterFoundationInput): Promise<RegisterFoundationResult> {
  // 1. Crea el usuario en Supabase Auth
  const { user, session } = await this.authRepository.signUp({
    email: input.officialEmail,
    password: input.password,
  });

  // 2. Crea el perfil con rol "foundation_user"
  await this.authRepository.createProfile({
    userId: user.id,
    role: "foundation_user",
  });

  // 3. Crea la fundación en la base de datos
  const foundation = await this.foundationRepository.createFoundation({
    name: input.foundationName,
    taxId: input.taxId,
  });

  // 4. Crea el contacto de la fundación
  await this.foundationRepository.createFoundationContact({
    foundationId: foundation.id,
    officialEmail: input.officialEmail,
    taxId: input.taxId,
  });

  // 5. Crea el miembro (relación usuario-fundación)
  await this.foundationRepository.createFoundationMember({
    foundationId: foundation.id,
    userId: user.id,
    memberRole: "owner",
  });

  return { user, foundation, session };
}
```

**¿Por qué este orden?**
- Primero el usuario (necesitas el `user.id`)
- Luego el perfil (necesitas el `user.id`)
- Luego la fundación (necesitas el `foundation.id`)
- Luego el contacto (necesitas el `foundation.id`)
- Finalmente el miembro (necesitas ambos IDs)

### 3. Los Repositorios Implementan las Operaciones

**Archivo**: `src/infrastructure/repositories/AuthRepository.ts`

```typescript
async signUp(params: SignUpParams): Promise<SignUpResult> {
  // Llama a Supabase
  const { data, error } = await supabaseClient.auth.signUp({
    email: params.email,
    password: params.password,
  });
  
  // Convierte el resultado de Supabase al modelo del Domain
  return {
    user: this.mapUser(data.user),
    session: this.mapSession(data.session),
  };
}
```

**Archivo**: `src/infrastructure/repositories/FoundationRepository.ts`

```typescript
async createFoundation(params: CreateFoundationParams): Promise<Foundation> {
  // Inserta en la tabla `foundations`
  const { data, error } = await supabaseClient
    .from("foundations")
    .insert({ name: params.name, tax_id: params.taxId })
    .select()
    .single();
  
  // Convierte a modelo del Domain
  return this.mapFoundation(data);
}
```

---

## Preguntas Frecuentes

### ¿Por qué no llamo directamente a Supabase desde los componentes?

**Respuesta**: Porque romperías la arquitectura. Si mañana cambias de Supabase a Firebase, tendrías que cambiar TODOS los componentes. Con esta arquitectura, solo cambias los repositorios.

### ¿Qué pasa si quiero agregar una nueva feature?

**Pasos**:
1. Define el modelo en `domain/models/`
2. Define la interfaz del repositorio en `domain/repositories/`
3. Crea el UseCase en `domain/usecases/`
4. Implementa el repositorio en `infrastructure/repositories/`
5. Registra todo en los contenedores IoC
6. Crea el componente UI en `presentation/components/`

### ¿Cómo pruebo que todo funciona?

1. **Unit tests**: Prueba los UseCases con mocks de repositorios
2. **Integration tests**: Prueba los repositorios con Supabase real (o mock)
3. **E2E tests**: Prueba el flujo completo desde el UI

### ¿Dónde va la lógica de negocio?

**Siempre en Domain**, específicamente en los UseCases. Los repositorios solo obtienen/guardan datos. Los UseCases orquestan la lógica.

---

## Recursos Adicionales

- **Arquitectura detallada**: `docs/01_arquitectura.md`
- **Guía de i18n**: `docs/i18n-usage-guide.md`
- **Estrategia de auth**: `docs/auth-strategy.md`

---

## Conclusión

Esta arquitectura puede parecer "demasiado" al principio, pero tiene sentido cuando:

- El proyecto crece
- Necesitas cambiar de backend
- Necesitas testear
- Trabajas en equipo

La clave es entender que:
- **Presentation** = Lo que el usuario ve
- **Domain** = La lógica de negocio (lo más importante)
- **Infrastructure** = Las conexiones externas

Y que las dependencias siempre van hacia adentro: Presentation → Domain → Infrastructure.

Si tienes dudas sobre alguna parte específica, revisa el código de ejemplo en esta guía y sigue el flujo paso a paso.

