-- ============================================
-- Script para verificar el funcionamiento de las notificaciones
-- ============================================
-- Este script ayuda a entender cómo se están creando las notificaciones
-- y verificar que la lógica es correcta

-- IMPORTANTE: Cómo funcionan las notificaciones
-- ============================================
-- 1. Cuando se crea una solicitud de adopción, se crean DOS tipos de notificaciones:
--    a) Para el ADOPTANTE:
--       - user_id = adopter_user_id (quien recibe)
--       - actor_user_id = adopter_user_id (quien originó - mismo usuario)
--       - Título: "Solicitud enviada"
--
--    b) Para cada MIEMBRO de la FUNDACIÓN:
--       - user_id = member_user_id (cada miembro recibe una)
--       - actor_user_id = adopter_user_id (el adoptante que originó)
--       - Título: "Nueva solicitud de adopción"
--
-- 2. La función notify_foundation_members() busca TODOS los miembros
--    en foundation_members donde foundation_id = la fundación de la solicitud
--    y crea una notificación para CADA uno.

-- Ver todas las notificaciones con información detallada
SELECT 
  n.id,
  n.user_id as "Usuario que recibe",
  n.actor_user_id as "Usuario que originó",
  n.title as "Título",
  n.type as "Tipo",
  n.read_at as "Leída",
  n.created_at as "Creada",
  -- Verificar si el usuario que recibe es miembro de alguna fundación
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM foundation_members fm 
      WHERE fm.user_id = n.user_id
    ) THEN 'Es miembro de fundación'
    ELSE 'No es miembro (probablemente adoptante)'
  END as "Tipo de usuario",
  -- Verificar si el actor es el mismo que el receptor
  CASE 
    WHEN n.user_id = n.actor_user_id THEN 'Auto-notificación (adoptante)'
    ELSE 'Notificación de otro usuario'
  END as "Relación"
FROM notifications n
ORDER BY n.created_at DESC
LIMIT 20;

-- Ver notificaciones agrupadas por tipo de relación
SELECT 
  CASE 
    WHEN n.user_id = n.actor_user_id THEN 'Auto-notificación (adoptante)'
    ELSE 'Notificación de adoptante a fundación'
  END as "Tipo de notificación",
  COUNT(*) as "Cantidad",
  COUNT(CASE WHEN n.read_at IS NULL THEN 1 END) as "No leídas"
FROM notifications n
GROUP BY 
  CASE 
    WHEN n.user_id = n.actor_user_id THEN 'Auto-notificación (adoptante)'
    ELSE 'Notificación de adoptante a fundación'
  END;

-- Verificar que las notificaciones para fundaciones tienen diferentes user_id
-- pero el mismo actor_user_id (el adoptante)
SELECT 
  n.actor_user_id as "Adoptante (actor)",
  COUNT(DISTINCT n.user_id) as "Miembros notificados",
  STRING_AGG(DISTINCT n.user_id::text, ', ') as "IDs de miembros",
  n.title as "Título"
FROM notifications n
WHERE n.user_id != n.actor_user_id  -- Solo notificaciones a fundación
GROUP BY n.actor_user_id, n.title
ORDER BY COUNT(DISTINCT n.user_id) DESC;

-- Verificar miembros de fundaciones y sus notificaciones
SELECT 
  f.name as "Fundación",
  COUNT(DISTINCT fm.user_id) FILTER (WHERE fm.user_id IS NOT NULL) as "Miembros",
  COUNT(DISTINCT n.id) FILTER (WHERE n.user_id = fm.user_id) as "Notificaciones recibidas"
FROM foundations f
LEFT JOIN foundation_members fm ON fm.foundation_id = f.id
LEFT JOIN notifications n ON n.user_id = fm.user_id
GROUP BY f.id, f.name
ORDER BY "Notificaciones recibidas" DESC;

-- DIAGNÓSTICO: Verificar si hay miembros en las fundaciones
-- Si esta consulta no devuelve filas, significa que no hay miembros registrados
-- y por eso no se están creando notificaciones para la fundación
SELECT 
  f.id as "ID Fundación",
  f.name as "Nombre Fundación",
  COUNT(fm.user_id) as "Cantidad de Miembros",
  STRING_AGG(fm.user_id::text, ', ') as "IDs de Miembros"
FROM foundations f
LEFT JOIN foundation_members fm ON fm.foundation_id = f.id
GROUP BY f.id, f.name
ORDER BY "Cantidad de Miembros" DESC;

-- DIAGNÓSTICO: Ver notificaciones de una solicitud específica
-- Reemplaza 'REQUEST_ID' con el ID de una solicitud de adopción
-- SELECT 
--   ar.id as "Solicitud ID",
--   ar.foundation_id as "Fundación ID",
--   ar.adopter_user_id as "Adoptante ID",
--   COUNT(DISTINCT CASE WHEN n.user_id = ar.adopter_user_id THEN n.id END) as "Notificaciones al adoptante",
--   COUNT(DISTINCT CASE WHEN n.user_id != ar.adopter_user_id THEN n.id END) as "Notificaciones a fundación"
-- FROM adoption_requests ar
-- LEFT JOIN notifications n ON n.data->>'request_id' = ar.id::text
-- WHERE ar.id = REQUEST_ID  -- Reemplaza con un ID real
-- GROUP BY ar.id, ar.foundation_id, ar.adopter_user_id;
