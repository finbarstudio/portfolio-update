create extension if not exists pg_trgm;

create table if not exists products (
  id               text primary key,          -- Sainsbury's product_uid, e.g. '7977681'
  slug             text not null,             -- product page path, e.g. 'sainsburys-320g-...-fillets'
  name             text not null,
  brand            text,
  image_url        text,                      -- Sainsbury's CDN 640x640 url
  zone             text,                      -- breadcrumb level 1, e.g. 'Meat & fish' (store section)
  department       text,                      -- breadcrumb level 2, e.g. 'Chicken'
  category         text,                      -- deepest breadcrumb, e.g. 'Chicken breast & fillet'
  price            numeric(8,2) not null,     -- shelf price, £
  unit_price       numeric(10,2),             -- £ per unit_measure
  unit_measure     text,                      -- 'kg' | 'ltr' | 'ea' | ...
  pack_grams       numeric,                   -- parsed pack weight in g (or ml), null if unknown
  promos           jsonb not null default '[]',   -- Promo[] (see below), expired ones removed at load
  nectar_price     numeric(8,2),              -- best single-unit price with Nectar (simple price-cut promos only)
  is_available     boolean not null default true,
  storage          text,                      -- 'frozen' | 'chilled' | 'ambient' | null
  nutrition        jsonb,                     -- Nutrition per 100g/ml or null
  ingredients      text,
  ingredient_count int,
  seed_oil         text not null default 'unknown', -- 'none' | 'likely' | 'yes' | 'unknown'
  seed_oils_found  text[] not null default '{}',
  upf_markers      text[] not null default '{}',
  health           numeric(4,1),              -- objective 0-10 (no taste, no price)
  reasons          jsonb not null default '[]',   -- string[] plain-English why, best first
  is_food          boolean not null default true,
  listed_at        timestamptz not null,      -- last time seen in a listing scrape
  detail_at        timestamptz,               -- last time product page parsed
  first_seen       timestamptz not null default now()
);
create index if not exists products_name_trgm on products using gin (name gin_trgm_ops);
create index if not exists products_zone on products (zone);

create table if not exists price_history (
  product_id text not null references products(id) on delete cascade,
  seen_on    date not null,
  price      numeric(8,2) not null,
  nectar_price numeric(8,2),
  primary key (product_id, seen_on)
);

create table if not exists ratings (
  product_id text primary key references products(id) on delete cascade,
  stars      smallint not null check (stars between 1 and 5),
  updated_at timestamptz not null default now()
);

create table if not exists not_at_store (
  product_id text primary key references products(id) on delete cascade,
  marked_at  timestamptz not null default now()
);

create table if not exists list_items (
  id          bigserial primary key,
  product_id  text references products(id) on delete set null,
  label       text,                         -- free text when product_id is null ("milk")
  qty         smallint not null default 1 check (qty between 1 and 50),
  ticked      boolean not null default false,
  ticked_at   timestamptz,
  source      text not null default 'manual', -- 'manual' | 'basket'
  added_at    timestamptz not null default now(),
  check (product_id is not null or label is not null)
);

create table if not exists baskets (
  id         bigserial primary key,
  created_at timestamptz not null default now(),
  settings   jsonb not null,
  items      jsonb not null,                 -- BasketItem[]
  total      numeric(8,2) not null,
  protein_g  numeric not null,
  warnings   jsonb not null default '[]'
);

create table if not exists settings (
  key   text primary key,
  value jsonb not null
);

insert into settings (key, value) values
  ('budget_gbp', '60'), ('people', '1'), ('protein_g_per_day', '100'),
  ('max_per_category', '2'), ('include_unrated_share', '0.2')
on conflict (key) do nothing;
