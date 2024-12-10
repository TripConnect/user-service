'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('user', "avatar", { type: Sequelize.STRING });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('user', "avatar");
    }
};
//# sourceMappingURL=20240316095114-add-avatar.js.map