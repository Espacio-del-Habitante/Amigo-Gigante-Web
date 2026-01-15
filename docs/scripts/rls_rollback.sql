-- ============================================
-- ROLLBACK: DESACTIVAR RLS
-- ============================================
-- Este script desactiva RLS en todas las tablas
-- Úsalo si necesitas revertir los cambios

-- Desactivar RLS en todas las tablas
alter table profiles disable row level security;
alter table foundations disable row level security;
alter table foundation_members disable row level security;
alter table foundation_contacts disable row level security;
alter table animals disable row level security;
alter table animal_photos disable row level security;
alter table products disable row level security;
alter table events disable row level security;
alter table adoption_requests disable row level security;
alter table adoption_request_details disable row level security;
alter table adoption_request_documents disable row level security;

-- Eliminar todas las políticas (opcional, pero recomendado)
drop policy if exists profiles_select_own_or_admin on profiles;
drop policy if exists profiles_update_own on profiles;
drop policy if exists profiles_insert_own on profiles;

drop policy if exists foundations_select_public on foundations;
drop policy if exists foundations_select_member on foundations;
drop policy if exists foundations_insert_member on foundations;
drop policy if exists foundations_update_member on foundations;

drop policy if exists foundation_members_select_own on foundation_members;
drop policy if exists foundation_members_insert on foundation_members;

drop policy if exists foundation_contacts_select_member on foundation_contacts;
drop policy if exists foundation_contacts_insert_member on foundation_contacts;
drop policy if exists foundation_contacts_update_member on foundation_contacts;

drop policy if exists animals_select_public on animals;
drop policy if exists animals_select_member on animals;
drop policy if exists animals_insert_member on animals;
drop policy if exists animals_update_member on animals;

drop policy if exists animal_photos_select_public on animal_photos;
drop policy if exists animal_photos_select_member on animal_photos;
drop policy if exists animal_photos_insert_member on animal_photos;

drop policy if exists products_select_public on products;
drop policy if exists products_select_member on products;
drop policy if exists products_insert_member on products;
drop policy if exists products_update_member on products;

drop policy if exists events_select_member on events;
drop policy if exists events_insert_member on events;
drop policy if exists events_update_member on events;

drop policy if exists adoption_requests_select_own on adoption_requests;
drop policy if exists adoption_requests_select_foundation on adoption_requests;
drop policy if exists adoption_requests_insert_adopter on adoption_requests;
drop policy if exists adoption_requests_update on adoption_requests;

drop policy if exists adoption_request_details_select_own on adoption_request_details;
drop policy if exists adoption_request_details_select_foundation on adoption_request_details;
drop policy if exists adoption_request_details_insert_own on adoption_request_details;
drop policy if exists adoption_request_details_update_own on adoption_request_details;

drop policy if exists adoption_request_documents_select_own on adoption_request_documents;
drop policy if exists adoption_request_documents_select_foundation on adoption_request_documents;
drop policy if exists adoption_request_documents_insert_own on adoption_request_documents;

-- Eliminar funciones helper (opcional)
drop function if exists is_admin();
drop function if exists is_foundation_member(uuid);
drop function if exists get_user_foundation_id();
