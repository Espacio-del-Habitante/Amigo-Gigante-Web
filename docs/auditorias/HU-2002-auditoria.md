# HU-2002 — Auditoría de Seguridad (Ejecutada)

## Alcance
Auditoría manual del código actual con foco en autenticación, autorización, exposición de datos, configuración de seguridad, manejo de logs y validación de entradas/archivos. No se realizaron cambios de código.

## Metodología
- Revisión estática del código fuente relevante.
- Identificación de riesgos observables y su severidad.
- Propuesta de tareas de remediación (sin implementar).

---

## Hallazgos

### 🔴 CRÍTICO

#### 1) Bypass de autenticación mediante sesión mock en middleware
**Riesgo**: El middleware crea sesiones mock basadas en `process.env.ENV === "development"`. Un valor incorrecto en producción permitiría acceso no autorizado a rutas protegidas.
**Evidencia**: `src/proxy.ts` (bloque de sesión mock con `process.env.ENV` y `console.log`).

**Tareas**:
- [ ] **TAREA-2002-101**: Cambiar la condición a `process.env.NODE_ENV === "development"`.
- [ ] **TAREA-2002-102**: Restringir el mock a `localhost` y entornos locales.
- [ ] **TAREA-2002-103**: Eliminar el mock antes de despliegue y agregar validación pre-deploy.

---

### 🟡 ALTO

#### 2) Potencial escalación de privilegios vía actualización de rol en perfiles
**Riesgo**: El rol se lee directamente desde la tabla `profiles` en el middleware. Si un usuario puede modificar su propio `role` (por políticas RLS permisivas o reglas de escritura débiles), podría escalar privilegios y acceder a rutas protegidas.
**Evidencia**: `src/infrastructure/repositories/AuthMiddlewareRepository.ts` (lectura del campo `role` desde `profiles`).

**Tareas**:
- [ ] **TAREA-2002-104**: Revisar políticas RLS de `profiles` para impedir que usuarios actualicen su propio `role`.
- [ ] **TAREA-2002-105**: Restringir actualizaciones de `role` exclusivamente a roles administrativos/servicios.
- [ ] **TAREA-2002-106**: Agregar validación de rol en servidor (si existe API) para bloquear cambios no autorizados.

#### 3) Exposición pública de documentos sensibles (adopciones)
**Riesgo**: Los documentos de adopción se suben a Storage y se publican mediante `getPublicUrl`, exponiendo potencialmente documentos sensibles (identificación, fotos de hogar).
**Evidencia**: `src/infrastructure/repositories/AdoptionRequestRepository.ts` (upload de documentos y uso de `getPublicUrl`).

**Tareas**:
- [ ] **TAREA-2002-107**: Usar URLs firmadas (signed URLs) y bucket privado para documentos sensibles.
- [ ] **TAREA-2002-108**: Agregar expiración de URL y validación de permisos por rol.

#### 4) Búsquedas con concatenación directa en filtros `.or/.ilike`
**Riesgo**: Concatenar entradas del usuario en filtros puede permitir patrones inesperados o abuso de consultas; también puede afectar performance o generar errores por caracteres especiales.
**Evidencia**: `src/infrastructure/repositories/ProductRepository.ts`, `AnimalRepository.ts`, `AdoptionRequestRepository.ts` (uso de `.or`/`.ilike` con strings concatenados).

**Tareas**:
- [ ] **TAREA-2002-109**: Sanitizar/escapar parámetros de búsqueda antes de construir filtros.
- [ ] **TAREA-2002-110**: Limitar longitud de búsqueda y caracteres permitidos.

#### 5) Validación insuficiente de archivos subidos
**Riesgo**: No se valida el tipo MIME real ni el tamaño máximo en el repositorio; solo se sanitiza el nombre. Esto permite subir archivos no deseados o potencialmente peligrosos.
**Evidencia**: `src/infrastructure/repositories/AdoptionRequestRepository.ts` (upload sin validación de MIME/tamaño).

**Tareas**:
- [ ] **TAREA-2002-111**: Validar MIME real (magic bytes) y tamaños por tipo.
- [ ] **TAREA-2002-112**: Implementar listas permitidas de tipos y límites estrictos.

---

### 🟢 MEDIO

#### 6) Logging en runtime con datos sensibles/contexto
**Riesgo**: `console.log`/`console.warn` en runtime puede filtrar información de rutas, locales y errores. En producción estos logs pueden quedar expuestos.
**Evidencia**: `src/proxy.ts`, `src/app/[locale]/layout.tsx`, `src/infrastructure/repositories/AuthRepository.ts`.

**Tareas**:
- [ ] **TAREA-2002-113**: Eliminar logs en producción o reemplazar con logger con niveles y redacción.
- [ ] **TAREA-2002-114**: Enmascarar datos sensibles en logs.

#### 7) Falta de headers de seguridad HTTP
**Riesgo**: No hay configuración de headers de seguridad estándar (CSP, HSTS, X-Frame-Options, etc.).
**Evidencia**: `next.config.ts` no define `headers()` ni políticas de seguridad.

**Tareas**:
- [ ] **TAREA-2002-115**: Definir headers de seguridad en `next.config.ts` (CSP, HSTS, X-Content-Type-Options, etc.).
- [ ] **TAREA-2002-116**: Ajustar políticas según necesidades de recursos externos.

#### 8) Exposición de credenciales públicas en cliente
**Riesgo**: El uso de `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` expone el endpoint y anon key en el bundle del cliente, lo que puede facilitar abuso si no existe RLS estricto.
**Evidencia**: `src/infrastructure/config/environment.ts` y `src/infrastructure/config/supabase.ts`.

**Tareas**:
- [ ] **TAREA-2002-117**: Evaluar mover operaciones sensibles a servidor (SSR/Server Actions).
- [ ] **TAREA-2002-118**: Revisar políticas RLS y rate limiting para asegurar uso seguro de la anon key.

---

## Resumen de tareas por severidad
- **Crítico**: 3 tareas
- **Alto**: 9 tareas
- **Medio**: 6 tareas

**Total tareas nuevas**: 18
