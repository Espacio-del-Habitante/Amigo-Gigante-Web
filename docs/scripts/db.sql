-- Create profiles table
create table profiles (
  id uuid primary key,
  role text,
  display_name text,
  phone text,
  created_at timestamp with time zone default now()
);

-- Create foundations table
create table foundations (
  id uuid primary key,
  name text,
  description text,
  logo_url text,
  city text,
  country text,
  is_verified boolean,
  created_at timestamp with time zone default now()
);

-- Create foundation_members table
create table foundation_members (
  id bigint primary key generated always as identity,
  foundation_id uuid references foundations (id),
  user_id uuid references profiles (id),
  member_role text,
  created_at timestamp with time zone default now()
);

-- Create foundation_contacts table
create table foundation_contacts (
  id bigint primary key generated always as identity,
  foundation_id uuid references foundations (id),
  public_email text,
  public_phone text,
  instagram_url text,
  whatsapp_url text,
  address text,
  updated_at timestamp with time zone default now()
);

-- Create animals table
create table animals (
  id bigint primary key generated always as identity,
  foundation_id uuid references foundations (id),
  name text,
  species text,
  breed text,
  sex text,
  age_months integer,
  size text,
  status text,
  description text,
  cover_image_url text,
  is_published boolean,
  created_at timestamp with time zone default now()
);

-- Create animal_photos table
create table animal_photos (
  id bigint primary key generated always as identity,
  animal_id bigint references animals (id),
  url text,
  sort_order integer
);

-- Create products table
create table products (
  id bigint primary key generated always as identity,
  foundation_id uuid references foundations (id),
  name text,
  description text,
  price numeric,
  image_url text,
  is_published boolean,
  created_at timestamp with time zone default now()
);

-- Create events table
create table events (
  id bigint primary key generated always as identity,
  foundation_id uuid references foundations (id),
  title text,
  description text,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  location_text text,
  banner_url text,
  is_published boolean
);