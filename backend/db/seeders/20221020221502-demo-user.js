'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Charlie',
        lastName: 'Brown'
      },
      {
        email: 'user2@user.io',
        username: 'ilovelinus',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Sally',
        lastName: 'Brown'
      },
      {
        email: 'user3@user.io',
        username: 'snoopdawg',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Snoopy',
        lastName: 'Dog'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'ilovelinus', 'snoopdawg'] }
    }, {});
  }
};
