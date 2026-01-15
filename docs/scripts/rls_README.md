# Guía de Activación de Row Level Security (RLS)

Esta guía te ayudará a activar RLS paso a paso sin romper la funcionalidad existente.

## 📋 Archivos

- **`rls_policies.sql`**: Script completo con funciones helper y todas las políticas
- **`rls_enable_only.sql`**: Solo activa RLS sin crear políticas (⚠️ bloquea las tablas)
- **`rls_rollback.sql`**: Desactiva RLS y elimina políticas (para revertir cambios)

## 🚀 Proceso Recomendado (Paso a Paso)

### Paso 1: Crear funciones helper

Primero, ejecuta solo la sección de funciones helper del archivo `rls_policies.sql`:

```sql
-- Función para verificar si el usuario es admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1
    from profiles
    where id = auth.uid()
      and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Función para verificar si el usuario es miembro de una fundación
create or replace function is_foundation_member(foundation_id_param uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from foundation_members
    where foundation_id = foundation_id_param
      and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Función para obtener el foundation_id del usuario autenticado
create or replace function get_user_foundation_id()
returns uuid as $$
declare
  result uuid;
begin
  select foundation_id into result
  from foundation_members
  where user_id = auth.uid()
  limit 1;
  
  return result;
end;
$$ language plpgsql security definer;
```

**Verificación**: Prueba las funciones:
```sql
select is_admin();
select is_foundation_member('tu-foundation-id-aqui');
select get_user_foundation_id();
```

### Paso 2: Activar RLS en `profiles`

Ejecuta la sección de `profiles` del archivo `rls_policies.sql` y prueba:

```sql
-- Verificar que puedes ver tu propio perfil
select * from profiles where id = auth.uid();

-- Verificar que puedes actualizar tu perfil
update profiles set display_name = 'Test' where id = auth.uid();
```

### Paso 3: Activar RLS en `foundations`

Ejecuta la sección de `foundations` y prueba:

```sql
-- Verificar lectura pública
select * from foundations limit 5;

-- Verificar que los miembros pueden ver su fundación
select * from foundations where id = get_user_foundation_id();
```

### Paso 4: Activar RLS en `foundation_members`

Ejecuta la sección correspondiente y prueba:

```sql
-- Verificar que puedes ver tu membresía
select * from foundation_members where user_id = auth.uid();
```

### Paso 5: Activar RLS en `foundation_contacts`

Ejecuta la sección correspondiente y prueba:

```sql
-- Verificar que puedes ver contactos de tu fundación
select * from foundation_contacts 
where foundation_id = get_user_foundation_id();
```

### Paso 6: Activar RLS en `animals`

Ejecuta la sección correspondiente y prueba:

```sql
-- Verificar lectura pública (animales publicados)
select * from animals 
where is_published = true and status = 'available' 
limit 5;

-- Verificar que los miembros pueden ver animales de su fundación
select * from animals 
where foundation_id = get_user_foundation_id();
```

### Paso 7: Activar RLS en `animal_photos`

Ejecuta la sección correspondiente y prueba:

```sql
-- Verificar lectura pública
select * from animal_photos ap
join animals a on a.id = ap.animal_id
where a.is_published = true and a.status = 'available'
limit 5;
```

### Paso 8: Activar RLS en `products`

Ejecuta la sección correspondiente y prueba:

```sql
-- Verificar lectura pública
select * from products where is_published = true limit 5;

-- Verificar que los miembros pueden ver productos de su fundación
select * from products where foundation_id = get_user_foundation_id();
```

### Paso 9: Activar RLS en `events`

Ejecuta la sección correspondiente y prueba:

```sql
-- Verificar que los miembros pueden ver eventos de su fundación
select * from events where foundation_id = get_user_foundation_id();
```

### Paso 10: Activar RLS en tablas de adopción

Ejecuta las secciones de `adoption_requests`, `adoption_request_details` y `adoption_request_documents`.

## ⚠️ Si algo sale mal

Si encuentras problemas, puedes revertir todo con:

```sql
-- Ejecutar rls_rollback.sql
```

O desactivar RLS temporalmente en una tabla específica:

```sql
alter table nombre_tabla disable row level security;
```

## 🔍 Verificar políticas creadas

Para ver todas las políticas de una tabla:

```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

Para ver todas las políticas:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
ORDER BY tablename, policyname;
```

## 📝 Notas importantes

1. **Siempre prueba después de cada paso**: No ejecutes todo el script de una vez
2. **Backup**: Considera hacer un backup de la base de datos antes de empezar
3. **Modo desarrollo**: Si estás en desarrollo, puedes desactivar RLS temporalmente para debugging
4. **Funciones security definer**: Las funciones helper usan `security definer` para que puedan acceder a las tablas incluso cuando RLS está activo

## 🐛 Troubleshooting

### Error: "permission denied for table"
- Verifica que las políticas permitan la operación que intentas hacer
- Verifica que estés autenticado (`auth.uid()` no es null)

### Error: "new row violates row-level security policy"
- Verifica la cláusula `with check` de la política
- Asegúrate de que los datos que insertas/actualizas cumplan las condiciones

### Las funciones helper no funcionan
- Verifica que las funciones existan: `\df is_admin`
- Verifica que estés autenticado: `select auth.uid()`
