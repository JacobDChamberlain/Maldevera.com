'use strict';

/**
 * Recomputes `variants.sort_order` from each variant's size.
 *
 * The original backfill ranked sizes with `SIZE_ORDER.indexOf(size)`, and the
 * admin routes defaulted a new variant's sort_order to 0. Both put any size
 * outside the XS..XXXL list (a "5X", say) ahead of Small — which is how the
 * Hydraulic Jeff shirt ended up listing 5X first.
 *
 * Size-less variants (CDs, patches, …) stay at 0; they're alone on their
 * product, so their sort_order never matters.
 */

const { sizeRank } = require('../utils/sizeRank');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { QueryTypes } = Sequelize;

    const variants = await queryInterface.sequelize.query(
      'SELECT id, size FROM variants',
      { type: QueryTypes.SELECT }
    );

    for (const variant of variants) {
      const sortOrder = variant.size ? sizeRank(variant.size) : 0;
      await queryInterface.sequelize.query(
        'UPDATE variants SET sort_order = :sortOrder, "updatedAt" = NOW() WHERE id = :id',
        { replacements: { sortOrder, id: variant.id }, type: QueryTypes.UPDATE }
      );
    }
  },

  // Ordering is derived from size, so there's no prior state worth restoring.
  down: async () => {}
};
