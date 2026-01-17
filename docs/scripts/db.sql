-- PROFILES
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'external'
    check (role in ('admin','foundation_user','external')),
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- FOUNDATIONS
create table foundations (
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
create table foundation_members (
  id bigint primary key generated always as identity,
  foundation_id uuid not null references foundations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  member_role text default 'editor' check (member_role in ('owner','editor')),
  created_at timestamptz not null default now(),
  unique (foundation_id, user_id)
);

-- FOUNDATION CONTACTS (1:1)
create table foundation_contacts (
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
create table animals (
  id bigint primary key generated always as identity,
  foundation_id uuid not null references foundations(id) on delete cascade,
  name text not null,
  species text not null, -- dog/cat/etc (si quieres luego check)
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

create table animal_photos (
  id bigint primary key generated always as identity,
  animal_id bigint not null references animals(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0
);

-- PRODUCTS
create table products (
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
create table events (
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

-- -- ADOPTION REQUESTS (solicitud principal)
create table adoption_requests (
  id bigint primary key generated always as identity,

  animal_id bigint not null references animals(id) on delete cascade,
  foundation_id uuid not null references foundations(id) on delete cascade,

  adopter_user_id uuid not null references profiles(id) on delete cascade,

  status text not null default 'pending'
    check (status in (
      'pending',           -- recién creada por el adoptante
      'in_review',         -- la fundación la está revisando
      'info_requested',    -- la fundación pidió más info
      'preapproved',       -- pasa a entrevista/visita
      'approved',          -- aprobada lista para entrega/firma
      'rejected',          -- rechazada
      'cancelled',         -- cancelada por alguna parte
      'completed'          -- entrega realizada + cerrada
    )),

  -- Para controlar el "caos" y filtrar rápido
  priority integer not null default 0,
  rejection_reason text,

  -- Auditoría básica
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Evita spam: un usuario no crea múltiples solicitudes para el mismo animal
  unique (animal_id, adopter_user_id)
);

-- ADOPTION REQUEST DETAILS (1:1)
create table adoption_request_details (
  id bigint primary key generated always as identity,
  request_id bigint not null references adoption_requests(id) on delete cascade,
  -- snapshot del contexto (útil si luego el user cambia teléfono o ciudad)
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
  children_ages text, -- simple: "3, 8" o "0-5"

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


-- REQUEST DOCUMENTS
create table adoption_request_documents (
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
-- NOTIFICATIONS (in-app)
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,

  -- quién/qué originó el evento (opcional pero útil)
  actor_user_id uuid references profiles(id) on delete set null,

  title text not null,
  body text,
  type text not null, -- ej: 'adoption_request_created', 'adoption_status_changed'
  data jsonb not null default '{}'::jsonb, -- { request_id, animal_id, foundation_id, new_status }

  read_at timestamptz,
  created_at timestamptz not null default now()
);


-- EMAIL QUEUE
create table email_queue (
  id bigint primary key generated always as identity,

  user_id uuid references profiles(id) on delete set null,
  to_email text not null,

  template text not null,  -- ej: 'adoption_request_created', 'adoption_status_changed'
  payload jsonb not null default '{}'::jsonb,

  status text not null default 'pending'
    check (status in ('pending','sending','sent','failed')),

  attempts int not null default 0,
  last_error text,

  created_at timestamptz not null default now(),
  sent_at timestamptz
);



-- INDEXES
create index animals_foundation_id_idx on animals(foundation_id);
create index animals_published_idx on animals(is_published);
create index animals_foundation_published_idx on animals(foundation_id, is_published);

create index products_foundation_published_idx on products(foundation_id, is_published);
create index events_foundation_published_idx on events(foundation_id, is_published);

create index animal_photos_animal_sort_idx on animal_photos(animal_id, sort_order);

create index foundation_members_user_idx on foundation_members(user_id);
create index foundation_members_foundation_idx on foundation_members(foundation_id);

create index adoption_requests_animal_idx on adoption_requests(animal_id);
create index adoption_requests_foundation_status_idx on adoption_requests(foundation_id, status);
create index adoption_requests_adopter_status_idx on adoption_requests(adopter_user_id, status);

create index adoption_request_details_request_idx on adoption_request_details(request_id);


create index adoption_request_documents_request_idx on adoption_request_documents(request_id);
create index adoption_request_documents_type_idx on adoption_request_documents(doc_type);

create index notifications_user_created_idx on notifications(user_id, created_at desc);
create index notifications_user_read_idx on notifications(user_id, read_at);

create index email_queue_status_created_idx on email_queue(status, created_at);


-- TRIGGERS
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_adoption_requests_updated_at
before update on adoption_requests
for each row execute function set_updated_at();


create trigger trg_adoption_request_details_updated_at
before update on adoption_request_details
for each row execute function set_updated_at();


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


create or replace function trg_adoption_request_created()
returns trigger
language plpgsql
security definer
as $$
declare
  v_animal_name text;
begin
  select a.name into v_animal_name
  from animals a
  where a.id = new.animal_id;

  -- 1) Notificación al adoptante
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

  -- 2) Notificar a miembros de la fundación
  perform notify_foundation_members(
    new.foundation_id,
    new.adopter_user_id,
    'Nueva solicitud de adopción',
    'Tienes una nueva solicitud para ' || coalesce(v_animal_name,'una mascota') || '.',
    'adoption_request_created',
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'status', new.status
    )
  );

  -- 3) Encolar emails (si tienes email del adoptante en details, úsalo; si no, luego lo decides desde profiles)
  -- Si estás guardando adopter_email en adoption_request_details, puedes encolar desde un trigger en details.
  -- Aquí lo dejo opcional y simple: solo encola si existe adopter_email en details.
  insert into email_queue(user_id, to_email, template, payload)
  select
    new.adopter_user_id,
    d.adopter_email,
    'adoption_request_created',
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'status', new.status
    )
  from adoption_request_details d
  where d.request_id = new.id
    and d.adopter_email is not null
    and length(d.adopter_email) > 3;

  return new;
end;
$$;

create trigger trg_adoption_request_created
after insert on adoption_requests
for each row execute function trg_adoption_request_created();


create or replace function trg_adoption_request_status_changed()
returns trigger
language plpgsql
security definer
as $$
declare
  v_animal_name text;
begin
  if new.status = old.status then
    return new;
  end if;

  select a.name into v_animal_name
  from animals a
  where a.id = new.animal_id;

  -- Notificación al adoptante
  insert into notifications(user_id, actor_user_id, title, body, type, data)
  values (
    new.adopter_user_id,
    null, -- si quieres, luego pasas el actor desde tu backend (RPC) para saber quién cambió el estado
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

  -- Notificar a miembros de fundación (opcional: solo si el cambio lo hizo el adoptante o si quieres que siempre llegue)
  perform notify_foundation_members(
    new.foundation_id,
    null,
    'Solicitud actualizada',
    'La solicitud para ' || coalesce(v_animal_name,'una mascota') || ' cambió a: ' || new.status,
    'adoption_status_changed',
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'old_status', old.status,
      'new_status', new.status
    )
  );

  -- Encolar email al adoptante (si existe el email en details)
  insert into email_queue(user_id, to_email, template, payload)
  select
    new.adopter_user_id,
    d.adopter_email,
    'adoption_status_changed',
    jsonb_build_object(
      'request_id', new.id,
      'animal_id', new.animal_id,
      'foundation_id', new.foundation_id,
      'old_status', old.status,
      'new_status', new.status
    )
  from adoption_request_details d
  where d.request_id = new.id
    and d.adopter_email is not null
    and length(d.adopter_email) > 3;

  return new;
end;
$$;

create trigger trg_adoption_request_status_changed
after update of status on adoption_requests
for each row execute function trg_adoption_request_status_changed();
