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

-- INDEXES
create index animals_foundation_id_idx on animals(foundation_id);
create index animals_published_idx on animals(is_published);
create index animals_foundation_published_idx on animals(foundation_id, is_published);

create index products_foundation_published_idx on products(foundation_id, is_published);
create index events_foundation_published_idx on events(foundation_id, is_published);

create index animal_photos_animal_sort_idx on animal_photos(animal_id, sort_order);

create index foundation_members_user_idx on foundation_members(user_id);
create index foundation_members_foundation_idx on foundation_members(foundation_id);
