'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MovieId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Movies",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      StudioId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Studios",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      showDate: {
        type: Sequelize.DATE
      },
      showTime: {
        type: Sequelize.TIME
      },
      price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Schedules');
  }
};