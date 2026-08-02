-- Merch revamp — manual SQL equivalent of migrations 120001–120004.
--
-- Use this ONLY if applying the merch-revamp schema change by hand (e.g. in a
-- SQL client like Postico) instead of running `npx sequelize-cli db:migrate`.
-- It produces byte-identical results to the JS migrations and records them in
-- SequelizeMeta so a later `db:migrate` correctly treats them as applied.
--
-- Prerequisites / notes:
--   * Run against a database whose `items` table is already populated (prod is).
--   * Confirm you are connected to the intended database before running.
--   * Wrapped in a transaction: any error rolls the whole thing back.
--   * Leaves the `items` table untouched (kept as a safety net).
--   * Recommended order: run this FIRST, then deploy the new backend code
--     (the running app keeps using `items` until the new code ships).

BEGIN;

-- ===== 20260801120001-create-products =====
CREATE TYPE "enum_products_category" AS ENUM ('clothing', 'music', 'accessory');

CREATE TABLE "products" (
  "id"          SERIAL PRIMARY KEY,
  "name"        VARCHAR(255) NOT NULL,
  "slug"        VARCHAR(255) NOT NULL UNIQUE,
  "description" TEXT,
  "category"    "enum_products_category" NOT NULL,
  "images"      TEXT[] NOT NULL DEFAULT '{}',
  "active"      BOOLEAN NOT NULL DEFAULT true,
  "featured"    BOOLEAN NOT NULL DEFAULT false,
  "sort_order"  INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ===== 20260801120002-create-variants =====
CREATE TABLE "variants" (
  "id"              SERIAL PRIMARY KEY,
  "product_id"      INTEGER NOT NULL REFERENCES "products"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  "size"            VARCHAR(255),
  "price"           NUMERIC(10,2) NOT NULL,
  "stock"           INTEGER NOT NULL DEFAULT 0,
  "sku"             VARCHAR(255),
  "stripe_price_id" VARCHAR(255),
  "active"          BOOLEAN NOT NULL DEFAULT true,
  "sort_order"      INTEGER NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt"       TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX "variants_product_id" ON "variants" ("product_id");

-- ===== 20260801120003-backfill-products-and-variants =====
-- One product per name-prefix (text before ' - '); category/description/images
-- taken from the lowest-id row in each group; sort_order follows id order.
INSERT INTO "products" (name, slug, description, category, images, active, featured, sort_order, "createdAt", "updatedAt")
SELECT
  rep.base_name,
  trim(both '-' from regexp_replace(lower(rep.base_name), '[^a-z0-9]+', '-', 'g')),
  rep.description,
  (CASE
    WHEN rep.size IS NOT NULL THEN 'clothing'
    WHEN rep.base_name ~* '\((CD|Cassette|Floppy)\)' THEN 'music'
    ELSE 'accessory'
  END)::"enum_products_category",
  rep.images,
  true,
  false,
  (row_number() OVER (ORDER BY rep.min_id)) - 1,
  now(), now()
FROM (
  -- lowest-id row per name-prefix = the "representative" row (matches JS rows[0])
  SELECT DISTINCT ON (split_part(name, ' - ', 1))
    split_part(name, ' - ', 1) AS base_name,
    id AS min_id,
    description,
    images,
    size
  FROM items
  ORDER BY split_part(name, ' - ', 1), id
) rep
ORDER BY rep.min_id;

-- Variants: preserve each item's id as the variant id; link by name-prefix.
INSERT INTO "variants" (id, product_id, size, price, stock, sku, stripe_price_id, active, sort_order, "createdAt", "updatedAt")
SELECT
  i.id,
  p.id,
  i.size,
  i.price,
  i.stock,
  NULL,
  i.price_id,
  true,
  CASE i.size
    WHEN 'XS' THEN 0 WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3
    WHEN 'XL' THEN 4 WHEN 'XXL' THEN 5 WHEN 'XXXL' THEN 6
    ELSE 0
  END,
  now(), now()
FROM items i
JOIN products p ON p.name = split_part(i.name, ' - ', 1);

-- Bump the variants id sequence past the explicit ids we just inserted.
SELECT setval(pg_get_serial_sequence('variants', 'id'), (SELECT MAX(id) FROM variants));

-- ===== 20260801120004-drop-legacy-users-table =====
DROP TABLE IF EXISTS "Users";

-- ===== Record all four as applied so `db:migrate` never re-runs them =====
INSERT INTO "SequelizeMeta" (name) VALUES
  ('20260801120001-create-products.js'),
  ('20260801120002-create-variants.js'),
  ('20260801120003-backfill-products-and-variants.js'),
  ('20260801120004-drop-legacy-users-table.js');

COMMIT;
