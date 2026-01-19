# Guía de Respaldo y Restauración

Esta guía te ayudará a respaldar y restaurar tu base de datos de Supabase.

## 📦 Archivos de Respaldo

### `backup_complete.sql`
Script completo que contiene:
- ✅ Todas las tablas y su estructura
- ✅ Todos los índices
- ✅ Todas las funciones (helper functions, triggers)
- ✅ Todos los triggers
- ✅ Todas las políticas RLS (Row Level Security)
- ✅ Todas las políticas de Storage (Supabase Storage)

**IMPORTANTE**: Este script NO incluye datos, solo la estructura.

## 🔄 Cómo Respalda

### Opción 1: Respaldo Completo (Recomendado)

1. **Desde Supabase Dashboard:**
   - Ve a **Settings** > **Database**
   - Haz clic en **Backups**
   - Descarga el backup más reciente
   - Esto incluye estructura + datos

2. **Manual (Solo estructura):**
   - Ejecuta `backup_complete.sql` en Supabase SQL Editor
   - Esto recrea toda la estructura sin datos

### Opción 2: Respaldo de Datos

Para respaldar solo los datos (sin estructura):

```sql
-- Exportar datos de una tabla específica
COPY (SELECT * FROM profiles) TO STDOUT WITH CSV HEADER;

-- O usar pg_dump desde la terminal:
pg_dump -h [HOST] -U [USER] -d [DATABASE] --data-only > backup_data.sql
```

### Opción 3: Respaldo Incremental

Si solo quieres respaldar cambios recientes:

```sql
-- Ejemplo: Respaldo de solicitudes de adopción de los últimos 7 días
COPY (
  SELECT * FROM adoption_requests 
  WHERE created_at > NOW() - INTERVAL '7 days'
) TO STDOUT WITH CSV HEADER;
```

## 🔧 Cómo Restaurar

### Restaurar Estructura Completa

1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `backup_complete.sql`
3. Ejecuta el script completo
4. Verifica que no haya errores

### Restaurar desde Backup de Supabase

1. Ve a **Settings** > **Database** > **Backups**
2. Selecciona el backup que quieres restaurar
3. Haz clic en **Restore**
4. Espera a que termine la restauración

### Restaurar Datos Específicos

Si tienes un backup de datos en CSV:

```sql
-- Importar datos desde CSV
COPY profiles FROM STDIN WITH CSV HEADER;
-- Pega los datos aquí
\.
```

## ⚠️ Prevención de Pérdida de Datos

### 1. Respaldo Automático

Supabase hace backups automáticos, pero solo en planes pagos:
- **Free tier**: No hay backups automáticos
- **Pro tier**: Backups diarios por 7 días
- **Team tier**: Backups diarios por 30 días

### 2. Respaldo Manual Regular

**Recomendación**: Haz un respaldo manual al menos una vez por semana:

1. Ejecuta `backup_complete.sql` para respaldar estructura
2. Exporta datos importantes desde Supabase Dashboard
3. Guarda los archivos en:
   - Git (en un repositorio privado)
   - Google Drive / Dropbox
   - Disco externo
   - Otro servicio de backup

### 3. Script de Respaldo Automático (Opcional)

Puedes crear un script que se ejecute automáticamente:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

# Exportar estructura
pg_dump -h [HOST] -U [USER] -d [DATABASE] --schema-only > "structure_${BACKUP_FILE}"

# Exportar datos
pg_dump -h [HOST] -U [USER] -d [DATABASE] --data-only > "data_${BACKUP_FILE}"

# Comprimir
tar -czf "backup_${DATE}.tar.gz" "structure_${BACKUP_FILE}" "data_${BACKUP_FILE}"

# Subir a Google Drive, S3, etc.
# ...
```

## 📋 Checklist de Respaldo

Antes de dejar el proyecto por varios días:

- [ ] Ejecutar `backup_complete.sql` y guardar el resultado
- [ ] Exportar datos importantes desde Supabase Dashboard
- [ ] Verificar que el bucket `amg-private-files` esté configurado correctamente
- [ ] Guardar credenciales de Supabase en un lugar seguro
- [ ] Documentar cualquier cambio reciente en la estructura
- [ ] Verificar que las políticas RLS estén funcionando

## 🚨 Si Supabase Elimina tu Proyecto

Si Supabase elimina tu proyecto (por inactividad en free tier):

1. **Contacta a Supabase Support:**
   - Los proyectos eliminados pueden recuperarse dentro de 7 días
   - Ve a https://supabase.com/support

2. **Restaura desde Backup:**
   - Si tienes backup completo, crea un nuevo proyecto
   - Ejecuta `backup_complete.sql`
   - Importa los datos

3. **Prevención:**
   - Considera actualizar a un plan pagado si el proyecto es importante
   - O haz backups regulares manualmente

## 📝 Notas Importantes

1. **Este script NO incluye datos**: Solo estructura (tablas, funciones, políticas)
2. **Storage files**: Los archivos en Supabase Storage NO se incluyen en este backup
   - Para respaldar archivos, usa la funcionalidad de exportar de Supabase Dashboard
3. **Variables de entorno**: Guarda también tus variables de entorno en un lugar seguro
4. **Edge Functions**: Si tienes Edge Functions, respáldalas también desde el código fuente

## 🔍 Verificar que el Backup Funciona

Después de restaurar, verifica:

```sql
-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar que las funciones existen
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Verificar que las políticas RLS existen
SELECT tablename, policyname 
FROM pg_policies 
ORDER BY tablename, policyname;

-- Verificar políticas de Storage
SELECT policyname 
FROM pg_policies 
WHERE schemaname = 'storage';
```

## 💡 Consejos Adicionales

1. **Versiona tus cambios**: Usa Git para versionar cambios en la estructura
2. **Documenta cambios**: Si haces cambios manuales, actualiza `backup_complete.sql`
3. **Prueba restauraciones**: De vez en cuando, prueba restaurar en un proyecto de prueba
4. **Múltiples backups**: Guarda backups en múltiples lugares (local, cloud, etc.)
