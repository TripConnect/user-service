'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'user',
      {
        id: {
          primaryKey: true,
          unique: true,
          allowNull: false,
          type: Sequelize.STRING
        },
        username: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        }
      },
      {
        timestamps: false // Disable createdAt and updatedAt fields
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};