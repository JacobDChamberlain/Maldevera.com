'use strict';

/**
 * Backfills products + variants from the existing `items` table.
 *
 * - Groups items by their name prefix (everything before " - "), so a sized
 *   garment's rows collapse into ONE product with many variants.
 * - Infers category: has a size -> clothing; name contains (CD|Cassette|Floppy)
 *   -> music; otherwise -> accessory.
 * - Preserves each item's `id` as the new variant `id`, so existing carts,
 *   checkout, and the stock webhook keep resolving line items unchanged.
 *
 * The `items` table is intentionally left in place (untouched) so this is
 * reversible and nothing else that still reads it breaks mid-migration.
 */

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferCategory(representativeRow, productName) {
  if (representativeRow.size) return 'clothing';
  if (/\((CD|Cassette|Floppy)\)/i.test(productName)) return 'music';
  return 'accessory';
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { QueryTypes } = Sequelize;

    const items = await queryInterface.sequelize.query(
      'SELECT * FROM items ORDER BY id',
      { type: QueryTypes.SELECT }
    );

    // Group by name prefix, preserving first-seen order (which follows id).
    const groups = new Map();
    for (const item of items) {
      const base = item.name.split(' - ')[0];
      if (!groups.has(base)) groups.set(base, []);
      groups.get(base).push(item);
    }

    const now = new Date();
    let sortOrder = 0;

    for (const [productName, rows] of groups) {
      const rep = rows[0];
      const slug = slugify(productName);

      await queryInterface.bulkInsert('products', [{
        name: productName,
        slug,
        description: rep.description,
        category: inferCategory(rep, productName),
        images: rep.images,
        active: true,
        featured: false,
        sort_order: sortOrder++,
        createdAt: now,
        updatedAt: now
      }]);

      const [product] = await queryInterface.sequelize.query(
        'SELECT id FROM products WHERE slug = :slug',
        { replacements: { slug }, type: QueryTypes.SELECT }
      );

      const variants = rows.map((row) => ({
        id: row.id, // preserve original id -> carts/checkout/webhook keep working
        product_id: product.id,
        size: row.size,
        price: row.price,
        stock: row.stock,
        sku: null,
        stripe_price_id: row.price_id,
        active: true,
        sort_order: row.size ? SIZE_ORDER.indexOf(row.size) : 0,
        createdAt: now,
        updatedAt: now
      }));

      await queryInterface.bulkInsert('variants', variants);
    }

    // We inserted explicit variant ids, so bump the serial past the max id
    // to avoid collisions on the next auto-generated insert.
    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('variants', 'id'), (SELECT MAX(id) FROM variants));"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('variants', null, {});
    await queryInterface.bulkDelete('products', null, {});
  }
};
