'use strict';

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const users = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    display_name: "Sad Boy",
    username: "sadboy1999",
    password: "123456789",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    display_name: "Sad Girl",
    username: "sadgirl1999",
    password: "123456789",
    created_at: new Date(),
    updated_at: new Date(),
  },
];
const userCredentials = users.map(({ id: user_id, password }) => {
  const salt = bcrypt.genSaltSync(12);
  const credential = bcrypt.hashSync(password, salt);
  return { user_id, credential };
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.bulkInsert('user', users.map(({ password, ...user }) => user)),
        queryInterface.bulkInsert('user_credential', userCredentials),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // Related user_credential rows will be removed automatically by user_id constraint
        queryInterface.bulkDelete('user', { username: { [Op.in]: users.map(user => user.username) } }, {}),
      ]);
    });
  }
};
