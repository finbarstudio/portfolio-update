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

-- v2 (26 Oct 2026): Tesco-app parity. Additive and idempotent.
alter table products add column if not exists was_price    numeric(8,2);   -- shelf price before an offer (promo original_price)
alter table products add column if not exists offer_price  numeric(8,2);   -- best single-unit price he can actually pay (Nectar / price cut / 'Buy 1 for X')
alter table products add column if not exists review_avg   numeric(3,2);   -- Sainsbury's star rating, 0-5
alter table products add column if not exists review_count int;
alter table products add column if not exists is_new       boolean not null default false;
alter table products add column if not exists animal       text;           -- 'beef' | 'pork' | 'chicken' | 'lamb' | 'turkey' | 'duck' | 'fish' | 'seafood' | 'game' | null
create index if not exists products_promos on products using gin (promos jsonb_path_ops);
create index if not exists products_dept on products (zone, department, category);

-- Dinner meal deals (Dine In etc). Lunch deals are deliberately not stored.
create table if not exists deals (
  id          text primary key,              -- Sainsbury's promotion uid
  slug        text not null,                 -- e.g. 'ttd-dine-in-deal'
  title       text not null,                 -- e.g. 'Taste the Difference Dine In'
  strap       text not null,                 -- e.g. 'Meal Deal for £15.00 with Nectar'
  price       numeric(8,2) not null,
  nectar      boolean not null default false,
  starts_on   date,
  ends_on     date,
  updated_at  timestamptz not null default now()
);
create table if not exists deal_parts (
  deal_id  text not null references deals(id) on delete cascade,
  list_id  int not null,
  label    text not null,                    -- 'Main' | 'Side' | 'Dessert' | 'Drink' | 'Pizza' | 'Dip' ... (named from its products)
  qty      int not null default 1,
  primary key (deal_id, list_id)
);
create table if not exists deal_items (
  deal_id    text not null,
  list_id    int not null,
  product_id text not null references products(id) on delete cascade,
  primary key (deal_id, list_id, product_id),
  foreign key (deal_id, list_id) references deal_parts(deal_id, list_id) on delete cascade
);
create index if not exists deal_items_product on deal_items (product_id);

-- Past shops: "Finished shopping" snapshots the ticked list.
create table if not exists shops (
  id          bigserial primary key,
  finished_at timestamptz not null default now(),
  total       numeric(8,2) not null,
  full_price  numeric(8,2) not null,         -- what it would have cost without offers
  protein_g   numeric not null default 0,
  items       jsonb not null                 -- [{productId, label, name, qty, paidEach, offer}]
);

-- v3 (26 Oct 2026): Yes / No on weekly-basket picks. Yes keeps it in the next basket, No keeps it out
-- for a while; both teach his taste (category / brand affinity).
create table if not exists basket_votes (
  product_id text primary key references products(id) on delete cascade,
  vote       smallint not null check (vote in (-1, 1)),
  voted_at   timestamptz not null default now()
);

-- v4 (26 Oct 2026): ingredients for every product. Sainsbury's product page wins; otherwise the same barcode's
-- label from Finbar's Tesco data, then Open Food Facts. The source is stored so the app can say where it came from.
alter table products add column if not exists eans               text[] not null default '{}';
alter table products add column if not exists ingredients_source text;   -- 'sainsburys' | 'tesco' | 'openfoodfacts'
alter table products add column if not exists nutrition_source   text;   -- same values
create index if not exists products_eans on products using gin (eans);

-- v5 (26 Oct 2026): "basic ingredient" = a plain food you cook with (raw meat/fish, eggs, fruit & veg, rice,
-- oats, pulses, tofu, plain nuts, flour…), even with salt / water / a firming agent. Drives "Hide plain ingredients".
alter table products add column if not exists is_basic boolean not null default false;
