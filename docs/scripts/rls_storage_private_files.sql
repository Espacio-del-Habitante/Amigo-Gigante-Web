-- ============================================
-- RLS POLICIES PARA SUPABASE STORAGE
-- Bucket: amg-private-files
-- ============================================
-- Este script configura las políticas RLS para el bucket de archivos privados
-- Permite que adoptantes y miembros de fundación accedan a los documentos según corresponda

-- ============================================
-- POLÍTICA 1: Adoptantes pueden leer sus propios documentos
-- ============================================
-- Los usuarios externos (adoptantes) pueden leer archivos de sus propias solicitudes de adopción
-- El path debe seguir el formato: adoption-requests/{foundationId}/{requestId}/{filename}

drop policy if exists "Adopters can read their own documents" on storage.objects;

create policy "Adopters can read their own documents"
on storage.objects
for select
using (
  bucket_id = 'amg-private-files' AND
  (storage.foldername(name))[1] = 'adoption-requests' AND
  EXISTS (
    SELECT 1 
    FROM adoption_requests ar
    WHERE ar.id::text = (storage.foldername(name))[3]
      AND ar.adopter_user_id = auth.uid()
  )
);

-- ============================================
-- POLÍTICA 2: Miembros de fundación pueden leer documentos de su fundación
-- ============================================
-- Los miembros de fundación (owner/editor) pueden leer archivos de solicitudes de su fundación

drop policy if exists "Foundation users can read their foundation documents" on storage.objects;

create policy "Foundation users can read their foundation documents"
on storage.objects
for select
using (
  bucket_id = 'amg-private-files' AND
  (storage.foldername(name))[1] = 'adoption-requests' AND
  EXISTS (
    SELECT 1 
    FROM adoption_requests ar
    INNER JOIN foundation_members fm ON fm.foundation_id = ar.foundation_id
    WHERE ar.id::text = (storage.foldername(name))[3]
      AND ar.foundation_id::text = (storage.foldername(name))[2]
      AND fm.user_id = auth.uid()
      AND fm.member_role IN ('owner', 'editor')
  )
);

-- ============================================
-- POLÍTICA 3: Admins pueden leer todos los documentos
-- ============================================

drop policy if exists "Admins can read all documents" on storage.objects;

create policy "Admins can read all documents"
on storage.objects
for select
using (
  bucket_id = 'amg-private-files' AND
  EXISTS (
    SELECT 1 
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

-- ============================================
-- POLÍTICA 4: Usuarios autenticados pueden subir documentos
-- ============================================
-- El sistema controla los permisos antes de permitir el upload
-- Esta política solo verifica que el usuario esté autenticado

drop policy if exists "Authenticated users can upload documents" on storage.objects;

create policy "Authenticated users can upload documents"
on storage.objects
for insert
with check (
  bucket_id = 'amg-private-files' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. El bucket 'amg-private-files' debe estar configurado como PRIVADO en Supabase Dashboard
-- 2. Las políticas usan storage.foldername(name) para extraer partes del path:
--    - [1] = 'adoption-requests'
--    - [2] = foundationId (UUID como string)
--    - [3] = requestId (número como string)
--    - [4] = nombre del archivo
-- 3. Estas políticas solo aplican a operaciones de Storage, no a las tablas de BD
-- 4. Las signed URLs requieren que estas políticas permitan el acceso
-- 5. Si cambias la estructura de paths, actualiza estas políticas
