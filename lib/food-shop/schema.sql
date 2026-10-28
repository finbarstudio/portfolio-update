-- Food shop beta (lab.finbar.studio/foodshop): Tesco products mirrored from Finbar's local
-- scorer, plus invite-only accounts with their own settings, basket, ratings and past shops.
-- Idempotent: safe to run again. Only product data comes from the scorer; nothing personal
-- to Finbar (basket, ratings, prefs, orders, price history) is ever stored here.

create extension if not exists pg_trgm;

-- ---------- products (written only by scripts/food-shop-publish.ts) ----------
create table if not exists products (
  id            text primary key,              -- Tesco product id, e.g. '281381417'
  name          text not null,
  img           text,
  url           text not null,                 -- product page on tesco.com
  cat           text not null,                 -- scorer category: 'dairy-eggs', 'ready-meal', 'treats', ...
  grp           text,                          -- comparison group, e.g. 'plain & greek yogurt (tubs)'
  dept          text,                          -- browse department, e.g. 'dairy'
  subtype       text,
  regular       numeric(8,2),                  -- shelf price £ (no Clubcard)
  reg_unit      jsonb,                         -- { price, unit } at shelf price
  cc_unit       jsonb,                         -- { price, unit } at Clubcard price, when there is one
  offers        jsonb not null default '[]',   -- Offer[] as scraped (kind, label, minQty, unitPrice, discount, from, until, bundle?)
  best          jsonb,                         -- the best of offers, or null
  on_offer      boolean not null default false,
  offer_short   text,                          -- '3 for £6', 'Clubcard price', ...
  ends          text,                          -- '10 Nov'
  pack_g        numeric,
  pack_label    text,
  pack_protein  numeric,                       -- grams of protein in the whole pack
  n100          jsonb,                         -- per 100g: kcal, protein, fat, sat, carbs, sugar, fibre, salt
  flags         jsonb,                         -- airfry, fromFrozen, microwave, oven, freezable
  ingredients   text,                          -- null = not scraped yet ("check label")
  storage       text,                          -- 'frozen' | 'ambient' | 'chilled'
  freeze_state  text,                          -- chilled only: 'yes' | 'no' | 'unchecked'
  proc          jsonb,                         -- { type, count, markers[], watch[], nova }
  processing    smallint,                      -- neutral 0-10 processing subscore (no personal avoid rules)
  shelf         smallint,                      -- neutral 0-10 shelf-life subscore
  value_parts   jsonb,                         -- scorer's value inputs: deal, protein, cheap, perKg, fullKg, typicalKg, ppp, typicalPpp, ...
  compare       jsonb,                         -- { per: 'kg' | '100g protein', value, kind }
  honesty       jsonb,                         -- { alwaysOn, weeks, honestDiscount } when an offer isn't really a saving
  luxury        boolean not null default false,
  rating        real,                          -- Tesco star rating
  reviews       int,
  oos           boolean not null default false,
  price_stale   boolean not null default false,
  seen_at       timestamptz,
  part          text,                          -- meal-deal part ('main', 'side', ...)
  slot          text,                          -- meal-deal slot label ('Pies')
  is_new        boolean not null default false,
  non_food      boolean not null default false,
  variant_of    text,
  active        boolean not null default true,  -- false once it drops out of deals.json (kept so ratings/lists survive)
  published_at  timestamptz not null default now(),
  search        tsvector generated always as (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(grp, '') || ' ' || coalesce(subtype, ''))) stored
);
create index if not exists products_name_trgm on products using gin (name gin_trgm_ops);
create index if not exists products_search on products using gin (search);
create index if not exists products_dept on products (dept);
create index if not exists products_on_offer on products (on_offer) where on_offer;
alter table products add column if not exists active boolean not null default true;

-- updated_at, product count, anything else the publish step stamps
create table if not exists meta (
  key   text primary key,
  value jsonb not null
);

-- ---------- accounts ----------
create table if not exists invites (
  code       text primary key,                 -- handed out by Finbar, case-insensitive (stored lower-case)
  note       text,                             -- who it's for
  max_uses   int not null default 1 check (max_uses >= 1),
  uses       int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,          -- stored lower-case, trimmed
  name          text,
  password_hash text not null,                 -- 'scrypt$N$r$p$salt_b64$hash_b64'
  invite_code   text references invites(code) on delete set null,
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz
);

create table if not exists sessions (
  token_hash text primary key,                 -- sha256 of the cookie token; the token itself is never stored
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists sessions_user on sessions (user_id);

-- failed logins, for the "too many tries" throttle (10 per email or 30 per IP in 15 minutes).
-- Cleared for an email when it logs in; old rows are swept as new failures come in.
create table if not exists login_attempts (
  email text,                                  -- normalised; null when what was typed wasn't an email
  ip    text,                                  -- null when no proxy header was sent
  at    timestamptz not null default now()
);
create index if not exists login_attempts_email on login_attempts (email, at);
create index if not exists login_attempts_ip on login_attempts (ip, at);
create index if not exists login_attempts_at on login_attempts (at);

-- one row per user; data is a Settings object (lib/food-shop/settings.ts)
create table if not exists settings (
  user_id    uuid primary key references users(id) on delete cascade,
  data       jsonb not null,
  setup_done boolean not null default false,
  updated_at timestamptz not null default now()
);

-- tables from the first beta build (ratings, list and scores now live in user_docs and the browser).
-- They only ever held test accounts' data.
drop table if exists user_scores, list_items, ratings;

-- "Not available to me": Tesco's range is mostly national but some lines aren't sold everywhere, and there's
-- no public way to ask which store delivers to a postcode. So people report it, per postcode area ("BR7"):
-- one report hides the product for everyone in that area; "It's available to me" clears the area's reports.
create table if not exists unavailable_reports (
  area       text not null,                    -- outward code of the reporter's postcode, e.g. 'BR7'
  product_id text not null references products(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (area, product_id, user_id)
);
create index if not exists unavailable_reports_product on unavailable_reports (product_id);

-- The cloned app's own state, one JSON document per person per kind, shaped exactly like the files Finbar's
-- local server keeps (data/basket.json, ratings.json, removals.json, locks.json, orders.json), so the copied
-- page needs no changes to read and write them.
create table if not exists user_docs (
  user_id    uuid not null references users(id) on delete cascade,
  kind       text not null check (kind in ('basket', 'ratings', 'removals', 'locks', 'orders')),
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind)
);
