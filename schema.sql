-- CropGuard.ai SQL Schema for Supabase

-- Enable extensions
create extension if not exists postgis;
create extension if not exists pg_cron;

-- FARMERS table
create table if not exists farmers (
  id uuid default gen_random_uuid() primary key,
  phone text unique not null,
  name text,
  district text,
  state text default 'Andhra Pradesh',
  lat float,
  lng float,
  language text default 'en',
  created_at timestamptz default now()
);

-- DIAGNOSES table
create table if not exists diagnoses (
  id uuid default gen_random_uuid() primary key,
  farmer_id uuid references farmers(id),
  disease_name text not null,
  confidence float,
  severity text check (severity in ('low','medium','high')),
  image_url text,
  crop_type text,
  lat float,
  lng float,
  location geography(Point, 4326),
  created_at timestamptz default now()
);

-- TREATMENTS cache table
create table if not exists treatments (
  id uuid default gen_random_uuid() primary key,
  disease_name text not null,
  language text default 'en',
  steps jsonb,
  organic_cure text,
  chemical_cure text,
  cost_inr integer,
  days_to_act integer,
  cached_at timestamptz default now(),
  unique(disease_name, language)
);

-- ALERTS LOG
create table if not exists alerts_log (
  id uuid default gen_random_uuid() primary key,
  disease_name text,
  district text,
  farmers_alerted integer,
  message_sent text,
  created_at timestamptz default now()
);

-- PostGIS trigger: auto-set location from lat/lng
create or replace function set_location_from_coords()
returns trigger as $$
begin
  if new.lat is not null and new.lng is not null then
    new.location = ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326);
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger trg_set_location
  before insert on diagnoses
  for each row execute function set_location_from_coords();

-- RPC: Find nearby outbreaks within radius
create or replace function nearby_outbreaks(
  p_lat float, p_lng float, radius_km float default 20
)
returns table(disease_name text, count bigint, last_seen timestamptz) as $$
  select disease_name, count(*) as count, max(created_at) as last_seen
  from diagnoses
  where created_at > now() - interval '48 hours'
    and ST_DWithin(location,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      radius_km * 1000)
  group by disease_name order by count desc;
$$ language sql;

-- RPC: Check outbreak threshold (3+ cases in 10km within 1 hour)
create or replace function check_outbreak_threshold(
  p_disease text, p_lat float, p_lng float
)
returns integer as $$
  select count(*)::integer from diagnoses
  where disease_name = p_disease
    and created_at > now() - interval '60 minutes'
    and ST_DWithin(location,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography, 10000);
$$ language sql;

-- Row Level Security
alter table farmers enable row level security;
alter table diagnoses enable row level security;
alter table treatments enable row level security;

create policy "public read diagnoses" on diagnoses for select using (true);
create policy "insert diagnoses" on diagnoses for insert with check (true);
create policy "public read treatments" on treatments for select using (true);
create policy "insert treatments" on treatments for insert with check (true);
create policy "public read farmers" on farmers for select using (true);
create policy "insert farmers" on farmers for insert with check (true);
