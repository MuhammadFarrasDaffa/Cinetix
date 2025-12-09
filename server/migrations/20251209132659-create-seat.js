'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      seatRow: {
        type: Sequelize.STRING
      },
      seatNumber: {
        type: Sequelize.INTEGER
      },
      seatCode: {
        type: Sequelize.STRING
      },
      isAvailable: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Seats');
  }
};