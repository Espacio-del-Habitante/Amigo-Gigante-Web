-- ============================================
-- ROW LEVEL SECURITY (RLS) - Activación Paso a Paso
-- ============================================
-- Este script activa RLS de manera incremental para no romper funcionalidad existente
-- Ejecutar cada sección por separado y probar antes de continuar

-- ============================================
-- PASO 1: Crear funciones helper
-- ============================================

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

-- ============================================
-- PASO 2: Activar RLS en profiles
-- ============================================

alter table profiles enable row level security;
alter table profiles force row level security;

-- Política: Los usuarios pueden ver su propio perfil o si son admin
drop policy if exists profiles_select_own_or_admin on profiles;
create policy profiles_select_own_or_admin
on profiles for select
using (id = auth.uid() or is_admin());

-- Política: Los usuarios pueden actualizar su propio perfil (pero no cambiar su role)
-- Los admins pueden actualizar cualquier perfil
drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own
on profiles for update
using (id = auth.uid() or is_admin())
with check (
  is_admin() -- los admins pueden hacer cualquier cambio
  or (
    id = auth.uid() -- el user solo puede actualizarse a sí mismo
    and role = (select role from profiles where id = auth.uid()) -- evita que cambie su role
  )
);

-- Política: Permitir inserción durante registro (cualquier usuario autenticado puede crear su perfil)
drop policy if exists profiles_insert_own on profiles;
create policy profiles_insert_own
on profiles for insert
with check (id = auth.uid());

-- ============================================
-- PASO 3: Activar RLS en foundations
-- ============================================

alter table foundations enable row level security;
alter table foundations force row level security;

-- Política: Lectura pública de fundaciones (para catálogo público)
drop policy if exists foundations_select_public on foundations;
create policy foundations_select_public
on foundations for select
using (true);

-- Política: Los miembros de fundación pueden ver su fundación
-- (redundante con la pública, pero más específica)
drop policy if exists foundations_select_member on foundations;
create policy foundations_select_member
on foundations for select
using (is_foundation_member(id) or is_admin());

-- Política: Los usuarios foundation_user pueden crear fundaciones durante registro
drop policy if exists foundations_insert_member on foundations;
create policy foundations_insert_member
on foundations for insert
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('foundation_user', 'admin')
  )
);

-- Política: Los miembros de fundación pueden actualizar su fundación
drop policy if exists foundations_update_member on foundations;
create policy foundations_update_member
on foundations for update
using (is_foundation_member(id) or is_admin())
with check (is_foundation_member(id) or is_admin());

-- ============================================
-- PASO 4: Activar RLS en foundation_members
-- ============================================

alter table foundation_members enable row level security;
alter table foundation_members force row level security;

-- Política: Los usuarios pueden ver su propia membresía
drop policy if exists foundation_members_select_own on foundation_members;
create policy foundation_members_select_own
on foundation_members for select
using (user_id = auth.uid() or is_admin());

-- Política: Los usuarios pueden insertar su propia membresía (durante registro)
-- o los admins pueden insertar cualquier membresía
drop policy if exists foundation_members_insert on foundation_members;
create policy foundation_members_insert
on foundation_members for insert
with check (
  user_id = auth.uid() 
  or is_admin()
);

-- ============================================
-- PASO 5: Activar RLS en foundation_contacts
-- ============================================

alter table foundation_contacts enable row level security;
alter table foundation_contacts force row level security;

-- Política: Los miembros de fundación pueden ver contactos de su fundación
drop policy if exists foundation_contacts_select_member on foundation_contacts;
create policy foundation_contacts_select_member
on foundation_contacts for select
using (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden insertar contactos
drop policy if exists foundation_contacts_insert_member on foundation_contacts;
create policy foundation_contacts_insert_member
on foundation_contacts for insert
with check (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden actualizar contactos
drop policy if exists foundation_contacts_update_member on foundation_contacts;
create policy foundation_contacts_update_member
on foundation_contacts for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

-- ============================================
-- PASO 6: Activar RLS en animals
-- ============================================

alter table animals enable row level security;
alter table animals force row level security;

-- Política: Lectura pública de animales publicados (para catálogo)
drop policy if exists animals_select_public on animals;
create policy animals_select_public
on animals for select
using (is_published = true and status = 'available');

-- Política: Los miembros de fundación pueden ver todos los animales de su fundación
drop policy if exists animals_select_member on animals;
create policy animals_select_member
on animals for select
using (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden insertar animales
drop policy if exists animals_insert_member on animals;
create policy animals_insert_member
on animals for insert
with check (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden actualizar animales de su fundación
drop policy if exists animals_update_member on animals;
create policy animals_update_member
on animals for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

-- ============================================
-- PASO 7: Activar RLS en animal_photos
-- ============================================

alter table animal_photos enable row level security;
alter table animal_photos force row level security;

-- Política: Lectura pública de fotos de animales publicados
drop policy if exists animal_photos_select_public on animal_photos;
create policy animal_photos_select_public
on animal_photos for select
using (
  exists (
    select 1 from animals
    where animals.id = animal_photos.animal_id
      and animals.is_published = true
      and animals.status = 'available'
  )
);

-- Política: Los miembros de fundación pueden ver fotos de animales de su fundación
drop policy if exists animal_photos_select_member on animal_photos;
create policy animal_photos_select_member
on animal_photos for select
using (
  exists (
    select 1 from animals
    where animals.id = animal_photos.animal_id
      and (is_foundation_member(animals.foundation_id) or is_admin())
  )
);

-- Política: Los miembros de fundación pueden insertar fotos
drop policy if exists animal_photos_insert_member on animal_photos;
create policy animal_photos_insert_member
on animal_photos for insert
with check (
  exists (
    select 1 from animals
    where animals.id = animal_photos.animal_id
      and (is_foundation_member(animals.foundation_id) or is_admin())
  )
);

-- ============================================
-- PASO 8: Activar RLS en products
-- ============================================

alter table products enable row level security;
alter table products force row level security;

-- Política: Lectura pública de productos publicados
drop policy if exists products_select_public on products;
create policy products_select_public
on products for select
using (is_published = true);

-- Política: Los miembros de fundación pueden ver productos de su fundación
drop policy if exists products_select_member on products;
create policy products_select_member
on products for select
using (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden insertar productos
drop policy if exists products_insert_member on products;
create policy products_insert_member
on products for insert
with check (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden actualizar productos de su fundación
drop policy if exists products_update_member on products;
create policy products_update_member
on products for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

-- ============================================
-- PASO 9: Activar RLS en events
-- ============================================

alter table events enable row level security;
alter table events force row level security;

-- Política: Los miembros de fundación pueden ver eventos de su fundación
drop policy if exists events_select_member on events;
create policy events_select_member
on events for select
using (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden insertar eventos
drop policy if exists events_insert_member on events;
create policy events_insert_member
on events for insert
with check (is_foundation_member(foundation_id) or is_admin());

-- Política: Los miembros de fundación pueden actualizar eventos de su fundación
drop policy if exists events_update_member on events;
create policy events_update_member
on events for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

-- ============================================
-- PASO 10: Activar RLS en adoption_requests
-- ============================================

alter table adoption_requests enable row level security;
alter table adoption_requests force row level security;

-- Política: Los adoptantes pueden ver sus propias solicitudes
drop policy if exists adoption_requests_select_own on adoption_requests;
create policy adoption_requests_select_own
on adoption_requests for select
using (adopter_user_id = auth.uid() or is_admin());

-- Política: Las fundaciones pueden ver solicitudes de sus animales
drop policy if exists adoption_requests_select_foundation on adoption_requests;
create policy adoption_requests_select_foundation
on adoption_requests for select
using (is_foundation_member(foundation_id) or is_admin());

-- Política: Los usuarios externos pueden crear solicitudes
drop policy if exists adoption_requests_insert_adopter on adoption_requests;
create policy adoption_requests_insert_adopter
on adoption_requests for insert
with check (
  adopter_user_id = auth.uid()
  and exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('external', 'admin')
  )
);

-- Política: Las fundaciones pueden actualizar solicitudes de sus animales
-- Los adoptantes pueden:
--   - Cancelar sus propias solicitudes
--   - Actualizar de 'info_requested' a 'in_review' cuando responden a solicitudes de información
drop policy if exists adoption_requests_update on adoption_requests;
create policy adoption_requests_update
on adoption_requests for update
using (
  is_foundation_member(foundation_id) 
  or (adopter_user_id = auth.uid() and (status = 'cancelled' or status = 'info_requested'))
  or is_admin()
)
with check (
  is_foundation_member(foundation_id) 
  or (adopter_user_id = auth.uid() and (status = 'cancelled' or status = 'in_review'))
  or is_admin()
);

-- ============================================
-- PASO 11: Activar RLS en adoption_request_details
-- ============================================

alter table adoption_request_details enable row level security;
alter table adoption_request_details force row level security;

-- Política: Los adoptantes pueden ver detalles de sus solicitudes
drop policy if exists adoption_request_details_select_own on adoption_request_details;
create policy adoption_request_details_select_own
on adoption_request_details for select
using (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_details.request_id
      and (adoption_requests.adopter_user_id = auth.uid() or is_admin())
  )
);

-- Política: Las fundaciones pueden ver detalles de solicitudes de sus animales
drop policy if exists adoption_request_details_select_foundation on adoption_request_details;
create policy adoption_request_details_select_foundation
on adoption_request_details for select
using (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_details.request_id
      and (is_foundation_member(adoption_requests.foundation_id) or is_admin())
  )
);

-- Política: Los adoptantes pueden insertar detalles de sus solicitudes
drop policy if exists adoption_request_details_insert_own on adoption_request_details;
create policy adoption_request_details_insert_own
on adoption_request_details for insert
with check (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_details.request_id
      and adoption_requests.adopter_user_id = auth.uid()
  )
);

-- Política: Los adoptantes pueden actualizar detalles de sus solicitudes
drop policy if exists adoption_request_details_update_own on adoption_request_details;
create policy adoption_request_details_update_own
on adoption_request_details for update
using (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_details.request_id
      and adoption_requests.adopter_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_details.request_id
      and adoption_requests.adopter_user_id = auth.uid()
  )
);

-- ============================================
-- PASO 12: Activar RLS en adoption_request_documents
-- ============================================

alter table adoption_request_documents enable row level security;
alter table adoption_request_documents force row level security;

-- Política: Los adoptantes pueden ver documentos de sus solicitudes
drop policy if exists adoption_request_documents_select_own on adoption_request_documents;
create policy adoption_request_documents_select_own
on adoption_request_documents for select
using (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_documents.request_id
      and (adoption_requests.adopter_user_id = auth.uid() or is_admin())
  )
);

-- Política: Las fundaciones pueden ver documentos de solicitudes de sus animales
drop policy if exists adoption_request_documents_select_foundation on adoption_request_documents;
create policy adoption_request_documents_select_foundation
on adoption_request_documents for select
using (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_documents.request_id
      and (is_foundation_member(adoption_requests.foundation_id) or is_admin())
  )
);

-- Política: Los adoptantes pueden insertar documentos en sus solicitudes
drop policy if exists adoption_request_documents_insert_own on adoption_request_documents;
create policy adoption_request_documents_insert_own
on adoption_request_documents for insert
with check (
  exists (
    select 1 from adoption_requests
    where adoption_requests.id = adoption_request_documents.request_id
      and adoption_requests.adopter_user_id = auth.uid()
  )
);



-- RLS
alter table notifications enable row level security;

-- El usuario solo ve sus notificaciones
create policy "notifications_select_own"
on notifications for select
using (user_id = auth.uid());

-- El usuario solo puede marcar como leída la suya
create policy "notifications_update_own"
on notifications for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Nadie inserta desde el cliente (solo funciones/servicio)
-- (No crees policy de insert)


alter table email_queue enable row level security;

-- No exposición al cliente
-- (No crees policies, o solo service role si quieres)

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Ejecutar este script paso a paso, probando cada sección
-- 2. Verificar que las funciones helper funcionan correctamente
-- 3. Probar cada política antes de continuar con la siguiente
-- 4. Si algo falla, puedes desactivar RLS temporalmente con:
--    ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;
-- 5. Para ver las políticas creadas:
--    SELECT * FROM pg_policies WHERE tablename = 'nombre_tabla';
