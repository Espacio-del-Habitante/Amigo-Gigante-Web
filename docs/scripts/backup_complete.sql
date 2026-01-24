-- ============================================
-- BACKUP COMPLETO DE LA BASE DE DATOS
-- ============================================
-- Este script contiene TODO lo necesario para restaurar la base de datos
-- Incluye: tablas, índices, triggers, funciones, políticas RLS y políticas de Storage
-- 
-- IMPORTANTE: Este script está diseñado para crear todo desde cero
-- Si ya existen objetos, algunos comandos pueden fallar (usa DROP IF EXISTS)
-- 
-- USO:
-- 1. Ejecutar este script completo en Supabase SQL Editor
-- 2. Verificar que no haya errores
-- 3. Probar la aplicación
--
-- NOTA: Este script NO incluye datos, solo la estructura
-- Para respaldar datos, usa: pg_dump o la funcionalidad de exportar de Supabase Dashboard
-- ============================================

-- ============================================
-- PARTE 1: CREAR TABLAS
-- ============================================

-- PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'external'
    check (role in ('admin','foundation_user','external')),
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- FOUNDATIONS
create table if not exists foundations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  city text,
  country text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- FOUNDATION MEMBERS
create table if not exists foundation_members (
  id bigint primary key generated always as identity,
  foundation_id uuid not null references foundations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  member_role text default 'editor' check (member_role in ('owner','editor')),
  created_at timestamptz not null default now(),
  unique (foundation_id, user_id)
);

-- FOUNDATION CONTACTS (1:1)
create table if not exists foundation_contacts (
  id bigint primary key generated always as identity,
  foundation_id uuid not null references foundations(id) on delete cascade,
  public_email text,
  public_phone text,
  instagram_url text,
  whatsapp_url text,
  address text,
  updated_at timestamptz not null default now(),
  unique (foundation_id)
);

-- ANIMALS
create table if not exists animals (
  id bigint primary key generated always as identity,
  foundation_id uuid not null references foundations(id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  sex text not null default 'unknown' check (sex in ('male','female','unknown')),
  age_months integer check (age_months is null or age_months >= 0),
  size text not null default 'unknown' check (size in ('small','medium','large','unknown')),
  status text not null default 'available'
    check (status in ('available','adopted','in_treatment','inactive')),
  description text,
  cover_image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ANIMAL PHOTOS
create table if not exists animal_photos (
  id bigint primary key generated always as identity,
  animal_id bigint not null references animals(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0
);

-- PRODUCTS
create table if not exists products (
  id bigint primary key generated always as identity,
  foundation_id uuid not null references foundations(id) on delete cascade,
  name text not null,
  description text,
  price numeric check (price is null or price >= 0),
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- EVENTS
create table if not exists events (
  id bigint primary key generated always as identity,
  foundation_id uuid not null references foundations(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  location_text text,
  banner_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ADOPTION REQUESTS
create table if not exists adoption_requests (
  id bigint primary key generated always as identity,
  animal_id bigint not null references animals(id) on delete cascade,
  foundation_id uuid not null references foundations(id) on delete cascade,
  adopter_user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in (
      'pending',
      'in_review',
      'info_requested',
      'preapproved',
      'approved',
      'rejected',
      'cancelled',
      'completed'
    )),
  priority integer not null default 0,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (animal_id, adopter_user_id)
);

-- ADOPTION REQUEST DETAILS (1:1)
create table if not exists adoption_request_details (
  id bigint primary key generated always as identity,
  request_id bigint not null references adoption_requests(id) on delete cascade,
  adopter_display_name text,
  adopter_phone text,
  adopter_email text,
  city text,
  neighborhood text,
  housing_type text check (housing_type in ('house','apartment','other')),
  is_rent boolean,
  allows_pets boolean,
  household_people_count integer check (household_people_count is null or household_people_count >= 0),
  has_children boolean,
  children_ages text,
  has_other_pets boolean,
  other_pets_description text,
  hours_alone_per_day integer check (hours_alone_per_day is null or hours_alone_per_day >= 0),
  travel_plan text,
  experience_text text,
  motivation_text text,
  accepts_vet_costs boolean,
  accepts_lifetime_commitment boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id)
);

-- ADOPTION REQUEST DOCUMENTS
create table if not exists adoption_request_documents (
  id bigint primary key generated always as identity,
  request_id bigint not null references adoption_requests(id) on delete cascade,
  doc_type text not null
    check (doc_type in (
      'id_document',
      'home_photos',
      'vaccination_card',
      'other'
    )),
  file_url text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  actor_user_id uuid references profiles(id) on delete set null,
  title text not null,
  body text,
  type text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- EMAIL QUEUE
create table if not exists email_queue (
  id bigint primary key generated always as identity,
  user_id uuid references profiles(id) on delete set null,
  to_email text not null,
  template text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending','sending','sent','failed')),
  attempts int not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

-- ============================================
-- PARTE 2: CREAR ÍNDICES
-- ============================================

create index if not exists animals_foundation_id_idx on animals(foundation_id);
create index if not exists animals_published_idx on animals(is_published);
create index if not exists animals_foundation_published_idx on animals(foundation_id, is_published);

create index if not exists products_foundation_published_idx on products(foundation_id, is_published);
create index if not exists events_foundation_published_idx on events(foundation_id, is_published);

create index if not exists animal_photos_animal_sort_idx on animal_photos(animal_id, sort_order);

create index if not exists foundation_members_user_idx on foundation_members(user_id);
create index if not exists foundation_members_foundation_idx on foundation_members(foundation_id);

create index if not exists adoption_requests_animal_idx on adoption_requests(animal_id);
create index if not exists adoption_requests_foundation_status_idx on adoption_requests(foundation_id, status);
create index if not exists adoption_requests_adopter_status_idx on adoption_requests(adopter_user_id, status);

create index if not exists adoption_request_details_request_idx on adoption_request_details(request_id);

create index if not exists adoption_request_documents_request_idx on adoption_request_documents(request_id);
create index if not exists adoption_request_documents_type_idx on adoption_request_documents(doc_type);

create index if not exists notifications_user_created_idx on notifications(user_id, created_at desc);
create index if not exists notifications_user_read_idx on notifications(user_id, read_at);

create index if not exists email_queue_status_created_idx on email_queue(status, created_at);

-- ============================================
-- PARTE 3: CREAR FUNCIONES HELPER
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

-- Función para actualizar updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Función para notificar a miembros de fundación
create or replace function notify_foundation_members(
  p_foundation_id uuid,
  p_actor_user_id uuid,
  p_title text,
  p_body text,
  p_type text,
  p_data jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  insert into notifications(user_id, actor_user_id, title, body, type, data)
  select fm.user_id, p_actor_user_id, p_title, p_body, p_type, p_data
  from foundation_members fm
  where fm.foundation_id = p_foundation_id;
end;
$$;

-- Función trigger para cuando se crea una solicitud de adopción
create or replace function trg_adoption_request_created()
returns trigger
language plpgsql
security definer
as $$
declare
  v_animal_name text;
  v_adopter_email text;
begin
  select a.name into v_animal_name
  from animals a
  where a.id = new.animal_id;

  select email into v_adopter_email
  from auth.users
  where id = new.adopter_user_id;

  -- Notificación al adoptante
  insert into notifications(user_id, actor_user_id, title, body, type, data)
  values (
    new.adopter_user_id,
    new.adopter_user_id,
    'Solicitud enviada',
    'Tu solicitud para ' || coalesce(v_animal_name,'la mascota') || ' fue creada y está en estado: ' || new.status,
    'adoption_request_created',
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'status', new.status
    )
  );

  -- Notificar a miembros de la fundación
  perform notify_foundation_members(
    new.foundation_id,
    new.adopter_user_id,
    'Nueva solicitud de adopción'::text,
    ('Tienes una nueva solicitud para ' || coalesce(v_animal_name,'una mascota') || '.')::text,
    'adoption_request_created'::text,
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'status', new.status
    )
  );

  -- Encolar email al adoptante
  if v_adopter_email is not null and length(v_adopter_email) > 3 then
    insert into email_queue(user_id, to_email, template, payload)
    values (
      new.adopter_user_id,
      v_adopter_email,
      'adoption_request_created',
      jsonb_build_object(
        'request_id', new.id,
        'animal_id', new.animal_id,
        'foundation_id', new.foundation_id,
        'status', new.status
      )
    );
  end if;

  return new;
end;
$$;

-- Función trigger para cuando cambia el estado de una solicitud
create or replace function trg_adoption_request_status_changed()
returns trigger
language plpgsql
security definer
as $$
declare
  v_animal_name text;
  v_adopter_email text;
begin
  if new.status = old.status then
    return new;
  end if;

  select a.name into v_animal_name
  from animals a
  where a.id = new.animal_id;

  select email into v_adopter_email
  from auth.users
  where id = new.adopter_user_id;

  -- Notificación al adoptante
  insert into notifications(user_id, actor_user_id, title, body, type, data)
  values (
    new.adopter_user_id,
    null,
    'Actualización de tu solicitud',
    'La solicitud para ' || coalesce(v_animal_name,'la mascota') || ' cambió a: ' || new.status,
    'adoption_status_changed',
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'old_status', old.status,
      'new_status', new.status
    )
  );

  -- Notificar a miembros de fundación
  perform notify_foundation_members(
    new.foundation_id,
    null,
    'Solicitud actualizada'::text,
    ('La solicitud para ' || coalesce(v_animal_name,'una mascota') || ' cambió a: ' || new.status)::text,
    'adoption_status_changed'::text,
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'old_status', old.status,
      'new_status', new.status
    )
  );

  -- Encolar email al adoptante
  if v_adopter_email is not null and length(v_adopter_email) > 3 then
    insert into email_queue(user_id, to_email, template, payload)
    values (
      new.adopter_user_id,
      v_adopter_email,
      'adoption_status_changed',
      jsonb_build_object(
        'request_id', new.id,
        'animal_id', new.animal_id,
        'foundation_id', new.foundation_id,
        'old_status', old.status,
        'new_status', new.status
      )
    );
  end if;

  return new;
end;
$$;

-- ============================================
-- PARTE 4: CREAR TRIGGERS
-- ============================================

drop trigger if exists trg_adoption_requests_updated_at on adoption_requests;
create trigger trg_adoption_requests_updated_at
before update on adoption_requests
for each row execute function set_updated_at();

drop trigger if exists trg_adoption_request_details_updated_at on adoption_request_details;
create trigger trg_adoption_request_details_updated_at
before update on adoption_request_details
for each row execute function set_updated_at();

drop trigger if exists trg_adoption_request_created on adoption_requests;
create trigger trg_adoption_request_created
after insert on adoption_requests
for each row execute function trg_adoption_request_created();

drop trigger if exists trg_adoption_request_status_changed on adoption_requests;
create trigger trg_adoption_request_status_changed
after update of status on adoption_requests
for each row execute function trg_adoption_request_status_changed();

-- ============================================
-- PARTE 5: ACTIVAR RLS Y CREAR POLÍTICAS
-- ============================================

-- PROFILES
alter table profiles enable row level security;
alter table profiles force row level security;

drop policy if exists profiles_select_own_or_admin on profiles;
create policy profiles_select_own_or_admin
on profiles for select
using (id = auth.uid() or is_admin());

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own
on profiles for update
using (id = auth.uid() or is_admin())
with check (
  is_admin()
  or (
    id = auth.uid()
    and role = (select role from profiles where id = auth.uid())
  )
);

drop policy if exists profiles_insert_own on profiles;
create policy profiles_insert_own
on profiles for insert
with check (id = auth.uid());

-- FOUNDATIONS
alter table foundations enable row level security;
alter table foundations force row level security;

drop policy if exists foundations_select_public on foundations;
create policy foundations_select_public
on foundations for select
using (true);

drop policy if exists foundations_select_member on foundations;
create policy foundations_select_member
on foundations for select
using (is_foundation_member(id) or is_admin());

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

drop policy if exists foundations_update_member on foundations;
create policy foundations_update_member
on foundations for update
using (is_foundation_member(id) or is_admin())
with check (is_foundation_member(id) or is_admin());

-- FOUNDATION MEMBERS
alter table foundation_members enable row level security;
alter table foundation_members force row level security;

drop policy if exists foundation_members_select_own on foundation_members;
create policy foundation_members_select_own
on foundation_members for select
using (user_id = auth.uid() or is_admin());

drop policy if exists foundation_members_insert on foundation_members;
create policy foundation_members_insert
on foundation_members for insert
with check (
  user_id = auth.uid() 
  or is_admin()
);

-- FOUNDATION CONTACTS
alter table foundation_contacts enable row level security;
alter table foundation_contacts force row level security;

drop policy if exists foundation_contacts_select_member on foundation_contacts;
create policy foundation_contacts_select_member
on foundation_contacts for select
using (is_foundation_member(foundation_id) or is_admin());

drop policy if exists foundation_contacts_insert_member on foundation_contacts;
create policy foundation_contacts_insert_member
on foundation_contacts for insert
with check (is_foundation_member(foundation_id) or is_admin());

drop policy if exists foundation_contacts_update_member on foundation_contacts;
create policy foundation_contacts_update_member
on foundation_contacts for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

-- ANIMALS
alter table animals enable row level security;
alter table animals force row level security;

drop policy if exists animals_select_public on animals;
create policy animals_select_public
on animals for select
using (is_published = true and status = 'available');

drop policy if exists animals_select_member on animals;
create policy animals_select_member
on animals for select
using (is_foundation_member(foundation_id) or is_admin());

drop policy if exists animals_insert_member on animals;
create policy animals_insert_member
on animals for insert
with check (is_foundation_member(foundation_id) or is_admin());

drop policy if exists animals_update_member on animals;
create policy animals_update_member
on animals for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

drop policy if exists animals_delete_by_foundation_member on animals;
create policy animals_delete_by_foundation_member
on animals for delete
using (
  exists (
    select 1
    from foundation_members fm
    where fm.foundation_id = animals.foundation_id
      and fm.user_id = auth.uid()
      and fm.member_role in ('owner', 'editor')
  )
);

-- ANIMAL PHOTOS
alter table animal_photos enable row level security;
alter table animal_photos force row level security;

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

drop policy if exists animal_photos_delete_by_foundation_member on animal_photos;
create policy animal_photos_delete_by_foundation_member
on animal_photos for delete
using (
  exists (
    select 1
    from animals a
    inner join foundation_members fm on fm.foundation_id = a.foundation_id
    where a.id = animal_photos.animal_id
      and fm.user_id = auth.uid()
      and fm.member_role in ('owner', 'editor')
  )
);

-- PRODUCTS
alter table products enable row level security;
alter table products force row level security;

drop policy if exists products_select_public on products;
create policy products_select_public
on products for select
using (is_published = true);

drop policy if exists products_select_member on products;
create policy products_select_member
on products for select
using (is_foundation_member(foundation_id) or is_admin());

drop policy if exists products_insert_member on products;
create policy products_insert_member
on products for insert
with check (is_foundation_member(foundation_id) or is_admin());

drop policy if exists products_update_member on products;
create policy products_update_member
on products for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

drop policy if exists products_delete_by_foundation_member on products;
create policy products_delete_by_foundation_member
on products for delete
using (
  exists (
    select 1
    from foundation_members fm
    where fm.foundation_id = products.foundation_id
      and fm.user_id = auth.uid()
      and fm.member_role in ('owner', 'editor')
  )
);

-- EVENTS
alter table events enable row level security;
alter table events force row level security;

drop policy if exists events_select_member on events;
create policy events_select_member
on events for select
using (is_foundation_member(foundation_id) or is_admin());

drop policy if exists events_insert_member on events;
create policy events_insert_member
on events for insert
with check (is_foundation_member(foundation_id) or is_admin());

drop policy if exists events_update_member on events;
create policy events_update_member
on events for update
using (is_foundation_member(foundation_id) or is_admin())
with check (is_foundation_member(foundation_id) or is_admin());

-- ADOPTION REQUESTS
alter table adoption_requests enable row level security;
alter table adoption_requests force row level security;

drop policy if exists adoption_requests_select_own on adoption_requests;
create policy adoption_requests_select_own
on adoption_requests for select
using (adopter_user_id = auth.uid() or is_admin());

drop policy if exists adoption_requests_select_foundation on adoption_requests;
create policy adoption_requests_select_foundation
on adoption_requests for select
using (is_foundation_member(foundation_id) or is_admin());

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

-- ADOPTION REQUEST DETAILS
alter table adoption_request_details enable row level security;
alter table adoption_request_details force row level security;

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

-- ADOPTION REQUEST DOCUMENTS
alter table adoption_request_documents enable row level security;
alter table adoption_request_documents force row level security;

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

-- NOTIFICATIONS
alter table notifications enable row level security;

drop policy if exists notifications_select_own on notifications;
create policy notifications_select_own
on notifications for select
using (user_id = auth.uid());

drop policy if exists notifications_update_own on notifications;
create policy notifications_update_own
on notifications for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- EMAIL QUEUE
alter table email_queue enable row level security;
-- No se crean políticas para email_queue (solo service role puede acceder)

-- ============================================
-- PARTE 6: POLÍTICAS DE STORAGE (Supabase Storage)
-- ============================================
-- IMPORTANTE: Estas políticas son para el bucket 'amg-private-files'
-- Asegúrate de que el bucket exista y esté configurado como PRIVADO

-- Política: Adoptantes pueden leer sus propios documentos
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

-- Política: Miembros de fundación pueden leer documentos de su fundación
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

-- Política: Admins pueden leer todos los documentos
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

-- Política: Usuarios autenticados pueden subir documentos
drop policy if exists "Authenticated users can upload documents" on storage.objects;
create policy "Authenticated users can upload documents"
on storage.objects
for insert
with check (
  bucket_id = 'amg-private-files' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- FIN DEL BACKUP
-- ============================================
-- 
-- NOTAS IMPORTANTES:
-- 1. Este script NO incluye datos, solo la estructura
-- 2. Para respaldar datos, usa pg_dump o exportar desde Supabase Dashboard
-- 3. Verifica que el bucket 'amg-private-files' exista y esté configurado como PRIVADO
-- 4. Después de ejecutar este script, verifica que todas las políticas funcionen correctamente
-- 5. Guarda este archivo en un lugar seguro (Git, backup externo, etc.)
--
-- Para restaurar datos:
-- - Usa Supabase Dashboard > Database > Backups
-- - O usa pg_dump para exportar/importar datos
-- ============================================
