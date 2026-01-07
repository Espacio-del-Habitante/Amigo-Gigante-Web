# 🔒 Cómo Probar Rutas Protegidas

Esta guía explica cómo probar las rutas protegidas después de implementar el login.

---

## 🎯 Estado Actual

### Rutas Protegidas

Las siguientes rutas requieren autenticación:

- **`/foundations/*`** → Requiere rol `foundation_user`
- **`/admin/*`** → Requiere rol `admin`
- **`/external/*`** → Requiere rol `external`

### Rutas Públicas

Estas rutas NO requieren autenticación:

- `/` (home)
- `/tienda`
- `/login`
- `/register`

---

## 🚀 Opción 1: Usar Mock Session (Desarrollo - Más Fácil)

### ¿Cómo funciona?

En **modo desarrollo**, el `proxy.ts` crea automáticamente una sesión "falsa" (mock) según la ruta que visites:

```typescript
// En src/proxy.ts (líneas 117-142)
if (process.env.NODE_ENV === "development") {
  // Crea una sesión mock según la ruta
  if (normalizedPathname.startsWith("/admin")) {
    mockRole = "admin";
  } else if (normalizedPathname.startsWith("/external")) {
    mockRole = "external";
  } else if (normalizedPathname.startsWith("/foundations")) {
    mockRole = "foundation_user";
  }
  
  session = {
    accessToken: "mock-token-dev",
    user: {
      id: "mock-user-id-dev",
      email: "dev@example.com",
      role: mockRole,
    },
  };
}
```

### Pasos para Probar

1. **Asegúrate de estar en modo desarrollo**:
   ```bash
   npm run dev
   ```

2. **Accede directamente a una ruta protegida**:
   - `http://localhost:3000/es/foundations`
   - `http://localhost:3000/es/foundations/profile`
   - `http://localhost:3000/es/admin` (si existe)
   - `http://localhost:3000/es/external` (si existe)

3. **Verifica en la consola del servidor**:
   Deberías ver un log como:
   ```
   [Proxy] 🔧 DEV MODE: Using mock session with role "foundation_user" for path "/foundations"
   ```

4. **La página debería cargar** sin redirigirte al login.

### Ventajas

- ✅ No necesitas hacer login
- ✅ Funciona automáticamente
- ✅ Perfecto para desarrollo de UI

### Desventajas

- ❌ No prueba el flujo real de autenticación
- ❌ Solo funciona en desarrollo
- ❌ No verifica que el login funcione correctamente

---

## 🔐 Opción 2: Login Real (Recomendado para Testing Completo)

### Pasos para Probar

1. **Asegúrate de tener un usuario creado en Supabase**:
   - Ve al dashboard de Supabase
   - Authentication → Users
   - Verifica que el usuario existe y está verificado

2. **Inicia sesión**:
   - Ve a `http://localhost:3000/es/login`
   - Ingresa email y contraseña
   - Haz click en "Iniciar Sesión"

3. **Verifica que el login funciona**:
   - Deberías ser redirigido a `/es/foundations`
   - No deberías ver errores en la consola

4. **Prueba las rutas protegidas**:
   - `http://localhost:3000/es/foundations`
   - `http://localhost:3000/es/foundations/profile`
   - Deberían cargar sin problemas

5. **Prueba la protección**:
   - Cierra sesión (si tienes implementado logout)
   - O borra las cookies del navegador
   - Intenta acceder a `/es/foundations`
   - Deberías ser redirigido a `/es/login?redirectTo=/foundations`

### Verificar la Sesión en el Cliente

Puedes usar el hook `useAuth` en cualquier componente para verificar el estado:

```typescript
import { useAuth } from "@/presentation/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, role, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  
  if (!isAuthenticated) {
    return <div>No estás autenticado</div>;
  }

  return (
    <div>
      <p>Usuario: {user?.email}</p>
      <p>Rol: {role}</p>
    </div>
  );
}
```

---

## 🧪 Opción 3: Deshabilitar Mock y Probar Protección Real

Si quieres probar que la protección funciona correctamente (sin mock):

### Pasos

1. **Comentar el código del mock en `proxy.ts`**:

```typescript
// src/proxy.ts (líneas 117-142)
// Comentar esto:
// if (process.env.NODE_ENV === "development") {
//   // ... código del mock
// }

// Y dejar que siempre intente obtener la sesión real:
let session: AuthSession | null = null;

// TODO: Implementar obtención real de sesión
// const getSessionUseCase = appContainer.get<GetSessionUseCase>(...);
// session = await getSessionUseCase.execute();
```

2. **Implementar la obtención real de sesión** (si aún no está implementada):

```typescript
// En proxy.ts
import { appContainer } from "@/infrastructure/ioc/container";
import { GetSessionUseCase } from "@/domain/usecases/auth/GetSessionUseCase";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

// Dentro de la función proxy:
const getSessionUseCase = appContainer.get<GetSessionUseCase>(
  USE_CASE_TYPES.GetSessionUseCase
);
session = await getSessionUseCase.execute();
```

3. **Probar**:
   - Sin login: debería redirigir a `/login`
   - Con login: debería permitir acceso

---

## 🔍 Debugging

### Ver Logs del Proxy

El proxy ya tiene logs habilitados. Revisa la consola del servidor cuando accedas a rutas protegidas:

```
[Proxy] 🔍 Processing: /es/foundations
[Proxy] 🔧 DEV MODE: Using mock session with role "foundation_user" for path "/foundations"
```

### Verificar Sesión en el Navegador

1. Abre DevTools (F12)
2. Ve a Application → Cookies
3. Busca cookies relacionadas con Supabase (si usas login real)
4. O verifica localStorage si guardas la sesión ahí

### Verificar Hook useAuth

Agrega un `console.log` temporal en un componente:

```typescript
const { user, isAuthenticated, role } = useAuth();
console.log("Auth state:", { user, isAuthenticated, role });
```

---

## 📋 Checklist de Pruebas

### Con Mock Session (Desarrollo)

- [ ] Acceder a `/es/foundations` sin login → Debe cargar
- [ ] Acceder a `/es/foundations/profile` sin login → Debe cargar
- [ ] Verificar que el mock session se crea correctamente (logs)
- [ ] Verificar que `useAuth` retorna datos del mock

### Con Login Real

- [ ] Hacer login con credenciales válidas → Debe redirigir a `/foundations`
- [ ] Acceder a `/es/foundations` después de login → Debe cargar
- [ ] Verificar que `useAuth` retorna datos reales del usuario
- [ ] Cerrar sesión o borrar cookies → Debe redirigir a `/login`
- [ ] Intentar acceder a `/es/foundations` sin sesión → Debe redirigir a `/login?redirectTo=/foundations`

### Protección por Roles

- [ ] Usuario con rol `foundation_user` accede a `/foundations` → ✅ Permitido
- [ ] Usuario con rol `foundation_user` accede a `/admin` → ❌ Debería denegar (cuando se implemente)
- [ ] Usuario con rol `admin` accede a `/admin` → ✅ Permitido (cuando se implemente)

---

## 🐛 Problemas Comunes

### "Siempre me redirige al login"

**Causa**: El mock session no se está creando o la sesión real no se está obteniendo.

**Solución**:
1. Verifica que estás en modo desarrollo (`NODE_ENV === "development"`)
2. Revisa los logs del proxy
3. Si usas login real, verifica que la sesión se guarda correctamente en Supabase

### "El mock session no funciona"

**Causa**: El proxy puede no estar ejecutándose o hay un error en la lógica.

**Solución**:
1. Verifica que `proxy.ts` está en la raíz del proyecto
2. Revisa que el `config.matcher` está correcto
3. Revisa los logs del servidor

### "useAuth siempre retorna null"

**Causa**: El `GetSessionUseCase` no está obteniendo la sesión correctamente.

**Solución**:
1. Verifica que `AuthRepository.getSession()` funciona
2. Revisa que Supabase está configurado correctamente
3. Verifica que las cookies de sesión se están guardando

---

## 🎓 Resumen

- **Para desarrollo rápido de UI**: Usa el mock session (Opción 1)
- **Para testing completo**: Usa login real (Opción 2)
- **Para probar protección real**: Deshabilita mock y usa sesión real (Opción 3)

La opción más práctica durante desarrollo es usar el mock session, y cuando quieras probar el flujo completo, usar login real.

