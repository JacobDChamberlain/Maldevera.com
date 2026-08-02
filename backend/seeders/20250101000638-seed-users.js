'use strict';
const bcrypt = require('bcrypt');

/**
 * Seeds a single admin user from environment variables so that no plaintext
 * credentials ever live in the repo (or its git history).
 *
 * Run with:
 *   ADMIN_USERNAME=you ADMIN_PASSWORD='your-secret' \
 *     npx sequelize-cli db:seed --seed 20250101000638-seed-users.js
 *
 * Idempotent: if the username already exists, its password is updated instead
 * of inserting a duplicate — so this also serves as a password reset.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'ADMIN_USERNAME and ADMIN_PASSWORD env vars are required to seed the admin user.'
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const now = new Date();

    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE username = :username',
      { replacements: { username }, type: Sequelize.QueryTypes.SELECT }
    );

    if (existing) {
      await queryInterface.bulkUpdate(
        'users',
        { password: hashed, updatedAt: now },
        { username }
      );
    } else {
      await queryInterface.bulkInsert('users', [
        { username, password: hashed, createdAt: now, updatedAt: now },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const username = process.env.ADMIN_USERNAME;
    if (username) {
      await queryInterface.bulkDelete('users', { username });
    }
  },
};
