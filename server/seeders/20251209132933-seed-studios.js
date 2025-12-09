'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require('../data/studio.json');
    data.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert('Studios', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Studios', null, {});
  }
};
