'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
          username: 'J-Man',
          password: await bcrypt.hash('praiseGod94!', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
      },
      {
          username: 'PKFire',
          password: await bcrypt.hash('tarantula666!', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
