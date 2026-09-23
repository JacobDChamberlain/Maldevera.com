-- Resort variants by size — manual SQL equivalent of migration
-- 20260922120000-resort-variants-by-size.
--
-- Use this ONLY if applying the change by hand (e.g. in Postico) instead of
-- running `npx sequelize-cli db:migrate`. It records the migration in
-- SequelizeMeta so a later `db:migrate` correctly treats it as applied.
--
-- OPTIONAL: the storefront dropdown sorts sizes client-side and is already
-- correct without this. This only fixes the row order in the Manage Store
-- admin table (and the raw /api/products variant order), which still reflects
-- the old sort_order values.
--
-- Prerequisites / notes:
--   * Confirm you are connected to the intended database before running.
--   * Wrapped in a transaction: any error rolls the whole thing back.
--   * Run the SELECT preview and check it before you COMMIT.

BEGIN;

-- Ranking, kept in step with backend/utils/sizeRank.js:
--   XS=0  S=1  M=2  L=3  XL=4  XXL/2X=5  XXXL/3X=6  4X=7  5X=8
--   unrecognized label = 999 (sorts last), size-less variant = 0
WITH normalized AS (
  SELECT id,
         upper(regexp_replace(COALESCE(size, ''), '[[:space:]._-]', '', 'g')) AS n
    FROM variants
), scored AS (
  SELECT id,
         CASE
           WHEN n = ''                                THEN 0
           WHEN n IN ('XS', 'XSMALL', 'EXTRASMALL')   THEN 0
           WHEN n IN ('S', 'SMALL')                   THEN 1
           WHEN n IN ('M', 'MEDIUM', 'MED')           THEN 2
           WHEN n IN ('L', 'LARGE')                   THEN 3
           WHEN n IN ('XLARGE', 'EXTRALARGE')         THEN 4
           -- "XL", "XXL", "XXXL", ... -> the X count is the multiplier
           WHEN n ~ '^X+L$'                           THEN 3 + (length(n) - 1)
           -- "2X", "2XL", "5X", "5XL", ... -> leading number is the multiplier
           WHEN n ~ '^[0-9]+XL?$'                     THEN 3 + (regexp_replace(n, '[^0-9]', '', 'g'))::INTEGER
           ELSE 999
         END AS rank
    FROM normalized
)
UPDATE variants v
   SET sort_order = s.rank,
       "updatedAt" = NOW()
  FROM scored s
 WHERE v.id = s.id
   AND v.sort_order IS DISTINCT FROM s.rank;

-- Preview: every product's sizes in their new order. Sanity-check this
-- (smallest -> largest, no 5X leading) before committing.
SELECT p.name,
       string_agg(COALESCE(v.size, '(one size)'), ', ' ORDER BY v.sort_order, v.id) AS sizes_in_order
  FROM products p
  JOIN variants v ON v.product_id = p.id
 GROUP BY p.id, p.name, p.sort_order
 ORDER BY p.sort_order, p.id;

INSERT INTO "SequelizeMeta" ("name")
VALUES ('20260922120000-resort-variants-by-size.js')
ON CONFLICT DO NOTHING;

COMMIT;
