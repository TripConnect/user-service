'use strict';

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const users = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    display_name: "Sad Boy",
    username: "ndtrong",
    password: "ndtrong@1234",
    avatar: "https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    display_name: "Sad Girl",
    username: "sadgirl",
    password: "sadgirl@1234",
    avatar: "https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg",
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
      ]).then((result) => {
        return Promise.all([
          queryInterface.bulkInsert('user_credential', userCredentials)
        ]);
      });
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.bulkDelete('user', { id: { [Op.in]: users.map(user => user.id) } }, {}),
      ]);
    });
  }
};
