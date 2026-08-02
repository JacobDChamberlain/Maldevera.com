'use strict';

/**
 * Drops the legacy capital-U "Users" table.
 *
 * It was created long ago by a `sequelize.sync()` (Sequelize pluralizes the
 * `User` model to "Users"), NOT by a migration — which is why it never had a
 * create/drop migration of its own. The app only ever reads the lowercase
 * `users` table (the model forces tableName: 'users'; see create-users), so
 * this orphan just holds stale rows (the old J-Man / PKFire logins).
 *
 * IF EXISTS makes this safe to run everywhere: it drops the orphan on prod,
 * and is a no-op on any DB where it's already gone (e.g. local).
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "Users";');
  },

  down: async (queryInterface, Sequelize) => {
    // Intentionally irreversible — we never want to recreate the orphan table.
  }
};
