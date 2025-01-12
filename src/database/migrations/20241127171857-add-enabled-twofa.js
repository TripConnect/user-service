'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user', "enabled_twofa", { type: Sequelize.BOOLEAN, defaultValue: false });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', "enabled_twofa");
  }
};